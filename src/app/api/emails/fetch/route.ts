import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { fetchRecentEmails } from '@/lib/gmail';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Get connected account
    const { data: account } = await supabase
      .from('connected_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'gmail')
      .single();

    if (!account) {
      return NextResponse.json({ error: 'Gmail not connected' }, { status: 400 });
    }

    // Fetch emails from Gmail
    const emails = await fetchRecentEmails(
      account.access_token,
      account.refresh_token,
      25
    );

    let newCount = 0;

    for (const email of emails) {
      // Check if already stored
      const { data: existing } = await supabase
        .from('email_threads')
        .select('id')
        .eq('user_id', userId)
        .eq('gmail_message_id', email.messageId)
        .single();

      if (existing) continue;

      // Insert new email
      const { error } = await supabase.from('email_threads').insert({
        user_id: userId,
        gmail_message_id: email.messageId,
        gmail_thread_id: email.threadId,
        from_name: email.fromName,
        from_email: email.fromEmail,
        subject: email.subject,
        snippet: email.snippet,
        body_text: email.bodyText,
        body_html: email.bodyHtml,
        received_at: email.receivedAt.toISOString(),
        classification: 'unclassified',
        processed: false,
        lead_created: false,
      });

      if (!error) newCount++;
    }

    // Update last sync
    await supabase
      .from('connected_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', account.id);

    return NextResponse.json({ fetched: emails.length, new: newCount });
  } catch (err) {
    console.error('Email fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}
