'use client';

import { useState } from 'react';
import { LeadWithDraft, LeadStatus } from '@/lib/types';
import { formatDistanceToNow, format } from 'date-fns';
import {
  X, Send, CalendarCheck, XCircle, RotateCcw, RefreshCw,
  Clock, DollarSign, MapPin, Phone, Building, AlertTriangle,
  Mail, FileText
} from 'lucide-react';

interface Props {
  lead: LeadWithDraft;
  onClose: () => void;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
  onSendReply: (leadId: string, draftId: string, body: string) => void;
  onRegenerateDraft: (leadId: string) => void;
  userId: string;
}

export default function LeadDetail({
  lead,
  onClose,
  onStatusChange,
  onSendReply,
  onRegenerateDraft,
}: Props) {
  const latestDraft = lead.drafted_replies?.filter(d => !d.is_sent).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];

  const [draftBody, setDraftBody] = useState(latestDraft?.body || '');
  const [sending, setSending] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const handleSend = async () => {
    if (!latestDraft || sending) return;
    setSending(true);
    await onSendReply(lead.id, latestDraft.id, draftBody);
    setSending(false);
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    await onRegenerateDraft(lead.id);
    setRegenerating(false);
  };

  const events = (lead.lead_events || []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20" onClick={onClose}>
      <div
        className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-3">
          <h2 className="text-base font-semibold text-zinc-900">
            {lead.sender_name || lead.sender_email}
          </h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-zinc-100">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Status + Actions */}
          <div className="flex flex-wrap gap-2">
            {lead.status !== 'replied' && lead.status !== 'booked' && (
              <button
                onClick={handleSend}
                disabled={sending || !latestDraft}
                className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                {sending ? 'Sending...' : 'Send Reply'}
              </button>
            )}
            {lead.status !== 'booked' && (
              <button
                onClick={() => onStatusChange(lead.id, 'booked')}
                className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                <CalendarCheck className="h-3.5 w-3.5" />
                Mark Booked
              </button>
            )}
            {lead.status !== 'lost' && (
              <button
                onClick={() => onStatusChange(lead.id, 'lost')}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <XCircle className="h-3.5 w-3.5" />
                Mark Lost
              </button>
            )}
            {(lead.status === 'booked' || lead.status === 'lost') && (
              <button
                onClick={() => onStatusChange(lead.id, 'new')}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reopen
              </button>
            )}
          </div>

          {/* Needs Review Badge */}
          {lead.needs_review && (
            <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-800">Needs review. AI confidence was low for this lead.</span>
            </div>
          )}

          {/* Extracted Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-900">Lead Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <Detail icon={Mail} label="Email" value={lead.sender_email} />
              {lead.company_name && <Detail icon={Building} label="Company" value={lead.company_name} />}
              {lead.service_requested && <Detail icon={FileText} label="Service" value={lead.service_requested} />}
              {lead.urgency && <Detail icon={Clock} label="Urgency" value={lead.urgency} />}
              {lead.budget_hint && <Detail icon={DollarSign} label="Budget" value={lead.budget_hint} />}
              {lead.location && <Detail icon={MapPin} label="Location" value={lead.location} />}
              {lead.meeting_intent && <Detail icon={Phone} label="Meeting" value="Wants to meet/call" />}
              {lead.confidence_score != null && (
                <Detail icon={AlertTriangle} label="Confidence" value={`${Math.round(lead.confidence_score * 100)}%`} />
              )}
            </div>
          </div>

          {/* AI Summary */}
          {lead.summary && (
            <div>
              <h3 className="text-sm font-medium text-zinc-900 mb-1">AI Summary</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">{lead.summary}</p>
            </div>
          )}

          {/* Original Email */}
          {lead.original_email_body && (
            <div>
              <h3 className="text-sm font-medium text-zinc-900 mb-1">
                Original Email
                {lead.original_email_subject && (
                  <span className="ml-2 font-normal text-zinc-500">· {lead.original_email_subject}</span>
                )}
              </h3>
              <div className="max-h-48 overflow-y-auto rounded-md border border-zinc-200 bg-zinc-50 p-3">
                <pre className="whitespace-pre-wrap text-xs text-zinc-600 font-sans">
                  {lead.original_email_body}
                </pre>
              </div>
            </div>
          )}

          {/* Draft Reply */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-zinc-900">Draft Reply</h3>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${regenerating ? 'animate-spin' : ''}`} />
                {regenerating ? 'Regenerating...' : 'Regenerate'}
              </button>
            </div>
            {latestDraft ? (
              <textarea
                value={draftBody}
                onChange={e => setDraftBody(e.target.value)}
                className="w-full rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
                rows={6}
              />
            ) : (
              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-center">
                <p className="text-sm text-zinc-400">No draft available</p>
                <button
                  onClick={handleRegenerate}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Generate a draft
                </button>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          {events.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-zinc-900 mb-2">Activity</h3>
              <div className="space-y-2">
                {events.map(event => (
                  <div key={event.id} className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-300 shrink-0" />
                    <div>
                      <p className="text-xs text-zinc-600">{event.description}</p>
                      <p className="text-[10px] text-zinc-400">
                        {format(new Date(event.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Received timestamp */}
          {lead.received_at && (
            <p className="text-xs text-zinc-400">
              Received {formatDistanceToNow(new Date(lead.received_at), { addSuffix: true })} · {format(new Date(lead.received_at), 'PPp')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-zinc-50 px-2.5 py-2">
      <Icon className="h-3.5 w-3.5 text-zinc-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">{label}</p>
        <p className="text-xs text-zinc-700 truncate">{value}</p>
      </div>
    </div>
  );
}
