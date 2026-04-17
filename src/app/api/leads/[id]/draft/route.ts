import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { draftReply } from '@/lib/claude';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const [{ data: lead }, { data: user }] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id).single(),
    supabase.from('users').select('tone_description').eq('id', userId).single(),
  ]);

  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  const tone = user?.tone_description || 'professional, warm, and concise';

  const replyBody = await draftReply(
    lead.sender_name || 'there',
    lead.service_requested,
    lead.summary || '',
    lead.original_email_subject || '',
    tone
  );

  const { data: draft } = await supabase
    .from('drafted_replies')
    .insert({
      lead_id: id,
      user_id: userId,
      subject: lead.original_email_subject ? `Re: ${lead.original_email_subject}` : 'Re: Your enquiry',
      body: replyBody,
    })
    .select()
    .single();

  await supabase.from('lead_events').insert({
    lead_id: id,
    user_id: userId,
    event_type: 'reply_drafted',
    description: 'New AI draft reply generated',
  });

  return NextResponse.json(draft);
}
