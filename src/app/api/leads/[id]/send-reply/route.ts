import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { sendReply } from '@/lib/gmail';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId, draftId, body: replyBody } = await request.json();

  if (!userId || !draftId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Get lead and connected account
  const [{ data: lead }, { data: account }, { data: draft }] = await Promise.all([
    supabase.from('leads').select('*, email_threads(*)').eq('id', id).single(),
    supabase.from('connected_accounts').select('*').eq('user_id', userId).eq('provider', 'gmail').single(),
    supabase.from('drafted_replies').select('*').eq('id', draftId).single(),
  ]);

  if (!lead || !account || !draft) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  try {
    // Send via Gmail
    const emailThread = Array.isArray(lead.email_threads) ? lead.email_threads[0] : lead.email_threads;
    const sentId = await sendReply(
      account.access_token,
      account.refresh_token,
      lead.sender_email,
      draft.subject || `Re: ${lead.original_email_subject || 'Your enquiry'}`,
      replyBody || draft.body,
      emailThread?.gmail_thread_id || '',
      emailThread?.gmail_message_id || ''
    );

    // Update draft
    await supabase
      .from('drafted_replies')
      .update({ is_sent: true, sent_at: new Date().toISOString(), gmail_message_id: sentId })
      .eq('id', draftId);

    // Update lead status
    await supabase.from('leads').update({ status: 'replied' }).eq('id', id);

    // Log event
    await supabase.from('lead_events').insert({
      lead_id: id,
      user_id: userId,
      event_type: 'reply_sent',
      description: 'Reply sent via Gmail',
    });

    return NextResponse.json({ success: true, gmail_message_id: sentId });
  } catch (err) {
    console.error('Send reply error:', err);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}
