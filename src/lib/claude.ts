import Anthropic from '@anthropic-ai/sdk';
import type { Classification, Urgency } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface ClassificationResult {
  classification: Classification;
  confidence: number;
  reason: string;
}

export async function classifyEmail(
  subject: string,
  fromEmail: string,
  bodyText: string
): Promise<ClassificationResult> {
  const truncatedBody = bodyText.slice(0, 3000);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `Classify this inbound email. You must respond with ONLY valid JSON, no other text.

From: ${fromEmail}
Subject: ${subject}
Body:
${truncatedBody}

Classify as exactly one of:
- "business_enquiry" — someone reaching out about hiring, buying a service, or working together
- "existing_client" — an ongoing conversation with someone already working with the recipient
- "newsletter" — marketing email, newsletter, or promotional content
- "spam" — spam, scam, or irrelevant automated email

Rules:
- If confidence is below 0.6, classify as "needs_review" instead
- Be conservative — when in doubt, use "needs_review"

Respond with JSON:
{"classification": "...", "confidence": 0.0-1.0, "reason": "one line explanation"}`,
      },
    ],
  });

  try {
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    return JSON.parse(jsonMatch[0]) as ClassificationResult;
  } catch {
    return { classification: 'needs_review', confidence: 0, reason: 'Failed to parse AI response' };
  }
}

export interface ExtractionResult {
  sender_name: string | null;
  company_name: string | null;
  service_requested: string | null;
  summary: string;
  urgency: Urgency;
  budget_hint: string | null;
  location: string | null;
  meeting_intent: boolean;
  confidence_score: number;
}

export async function extractLeadDetails(
  subject: string,
  fromName: string | null,
  fromEmail: string,
  bodyText: string
): Promise<ExtractionResult> {
  const truncatedBody = bodyText.slice(0, 3000);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: `Extract structured lead details from this business enquiry email. Respond with ONLY valid JSON, no other text.

From: ${fromName || 'Unknown'} <${fromEmail}>
Subject: ${subject}
Body:
${truncatedBody}

Extract:
{
  "sender_name": "full name or null",
  "company_name": "company name if mentioned, or null",
  "service_requested": "brief description of what they want",
  "summary": "2-3 sentence summary of the enquiry",
  "urgency": "low|medium|high|urgent",
  "budget_hint": "any budget/pricing mentions or null",
  "location": "location if mentioned or null",
  "meeting_intent": true/false,
  "confidence_score": 0.0-1.0
}

Be conservative with urgency. Default to "medium" unless there are clear signals.
Only mark meeting_intent true if they explicitly mention a call, meeting, or demo.`,
      },
    ],
  });

  try {
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    return JSON.parse(jsonMatch[0]) as ExtractionResult;
  } catch {
    return {
      sender_name: fromName,
      company_name: null,
      service_requested: null,
      summary: 'Could not extract details automatically.',
      urgency: 'medium',
      budget_hint: null,
      location: null,
      meeting_intent: false,
      confidence_score: 0,
    };
  }
}

export async function draftReply(
  senderName: string,
  serviceRequested: string | null,
  summary: string,
  originalSubject: string,
  toneDescription: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: `Draft a reply to this business enquiry. Output ONLY the email body text — no subject line, no "Subject:" prefix, no JSON wrapping.

Enquiry from: ${senderName}
Subject: ${originalSubject}
Service requested: ${serviceRequested || 'Not specified'}
Summary: ${summary}

Tone: ${toneDescription}

Rules:
- Professional, warm, concise
- Acknowledge their specific need
- Express interest in helping
- Suggest a next step (call, meeting, or more details)
- Keep it short — 3-5 sentences max
- Sound like a real human, not a template
- Do not include a subject line
- Start directly with the greeting`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return text.trim();
}
