export type Classification =
  | 'business_enquiry'
  | 'existing_client'
  | 'newsletter'
  | 'spam'
  | 'needs_review'
  | 'unclassified';

export type LeadStatus = 'new' | 'replied' | 'booked' | 'lost';
export type Urgency = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  tone_description: string;
  created_at: string;
}

export interface ConnectedAccount {
  id: string;
  user_id: string;
  provider: string;
  email: string;
  access_token: string;
  refresh_token: string;
  token_expiry: string;
  last_sync_at: string | null;
  history_id: string | null;
}

export interface EmailThread {
  id: string;
  user_id: string;
  gmail_message_id: string;
  gmail_thread_id: string;
  from_name: string | null;
  from_email: string;
  subject: string | null;
  snippet: string | null;
  body_text: string | null;
  body_html: string | null;
  received_at: string;
  classification: Classification;
  classification_confidence: number | null;
  processed: boolean;
  lead_created: boolean;
}

export interface Lead {
  id: string;
  user_id: string;
  email_thread_id: string | null;
  sender_name: string | null;
  sender_email: string;
  company_name: string | null;
  service_requested: string | null;
  summary: string | null;
  urgency: Urgency | null;
  budget_hint: string | null;
  location: string | null;
  meeting_intent: boolean;
  confidence_score: number | null;
  status: LeadStatus;
  needs_review: boolean;
  original_email_body: string | null;
  original_email_subject: string | null;
  received_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadEvent {
  id: string;
  lead_id: string;
  user_id: string;
  event_type: 'created' | 'reply_drafted' | 'reply_sent' | 'status_changed' | 'note_added';
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DraftedReply {
  id: string;
  lead_id: string;
  user_id: string;
  subject: string | null;
  body: string;
  is_sent: boolean;
  sent_at: string | null;
  gmail_message_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadWithDraft extends Lead {
  drafted_replies?: DraftedReply[];
  lead_events?: LeadEvent[];
}
