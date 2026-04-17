import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: lead, error } = await supabase
    .from('leads')
    .select(`
      *,
      drafted_replies (*),
      lead_events (*)
    `)
    .eq('id', id)
    .single();

  if (error || !lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  return NextResponse.json(lead);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const supabase = createServiceClient();

  const { data: lead, error } = await supabase
    .from('leads')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log status change event if status was updated
  if (body.status && lead) {
    await supabase.from('lead_events').insert({
      lead_id: id,
      user_id: lead.user_id,
      event_type: 'status_changed',
      description: `Status changed to ${body.status}`,
      metadata: { new_status: body.status },
    });
  }

  return NextResponse.json(lead);
}
