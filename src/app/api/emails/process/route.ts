import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { classifyEmail, extractLeadDetails, draftReply } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Get user tone preference
    const { data: user } = await supabase
      .from('users')
      .select('tone_description')
      .eq('id', userId)
      .single();

    const tone = user?.tone_description || 'professional, warm, and concise';

    // Get unprocessed emails
    const { data: emails } = await supabase
      .from('email_threads')
      .select('*')
      .eq('user_id', userId)
      .eq('processed', false)
      .order('received_at', { ascending: false })
      .limit(10);

    if (!emails || emails.length === 0) {
      return NextResponse.json({ processed: 0, leads_created: 0 });
    }

    let leadsCreated = 0;

    for (const email of emails) {
      // Step 1: Classify
      const classification = await classifyEmail(
        email.subject || '',
        email.from_email,
        email.body_text || email.snippet || ''
      );

      // Update email with classification
      await supabase
        .from('email_threads')
        .update({
          classification: classification.classification,
          classification_confidence: classification.confidence,
          processed: true,
        })
        .eq('id', email.id);

      // Step 2: If business enquiry, extract and create lead
      if (classification.classification === 'business_enquiry' || classification.classification === 'needs_review') {
        const extraction = await extractLeadDetails(
          email.subject || '',
          email.from_name,
          email.from_email,
          email.body_text || email.snippet || ''
        );

        const { data: lead } = await supabase
          .from('leads')
          .insert({
            user_id: userId,
            email_thread_id: email.id,
            sender_name: extraction.sender_name || email.from_name,
            sender_email: email.from_email,
            company_name: extraction.company_name,
            service_requested: extraction.service_requested,
            summary: extraction.summary,
            urgency: extraction.urgency,
            budget_hint: extraction.budget_hint,
            location: extraction.location,
            meeting_intent: extraction.meeting_intent,
            confidence_score: extraction.confidence_score,
            status: 'new',
            needs_review: classification.classification === 'needs_review' || extraction.confidence_score < 0.6,
            original_email_body: email.body_text,
            original_email_subject: email.subject,
            received_at: email.received_at,
          })
          .select()
          .single();

        if (lead) {
          // Mark email as lead-created
          await supabase
            .from('email_threads')
            .update({ lead_created: true })
            .eq('id', email.id);

          // Create event
          await supabase.from('lead_events').insert({
            lead_id: lead.id,
            user_id: userId,
            event_type: 'created',
            description: `Lead created from email: ${email.subject}`,
          });

          // Draft a reply
          const replyBody = await draftReply(
            extraction.sender_name || email.from_name || 'there',
            extraction.service_requested,
            extraction.summary,
            email.subject || '',
            tone
          );

          await supabase.from('drafted_replies').insert({
            lead_id: lead.id,
            user_id: userId,
            subject: email.subject ? `Re: ${email.subject}` : 'Re: Your enquiry',
            body: replyBody,
          });

          await supabase.from('lead_events').insert({
            lead_id: lead.id,
            user_id: userId,
            event_type: 'reply_drafted',
            description: 'AI draft reply generated',
          });

          leadsCreated++;
        }
      }
    }

    return NextResponse.json({ processed: emails.length, leads_created: leadsCreated });
  } catch (err) {
    console.error('Email process error:', err);
    return NextResponse.json({ error: 'Failed to process emails' }, { status: 500 });
  }
}
