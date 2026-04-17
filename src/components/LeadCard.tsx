'use client';

import { Lead } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Clock, DollarSign, MapPin, Phone } from 'lucide-react';

interface Props {
  lead: Lead;
  onClick: () => void;
}

const urgencyColors: Record<string, string> = {
  low: 'bg-zinc-100 text-zinc-600',
  medium: 'bg-indigo-100 text-indigo-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export default function LeadCard({ lead, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-zinc-200 bg-white p-3.5 text-left shadow-sm hover:shadow-md hover:border-zinc-300 transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900">
            {lead.sender_name || lead.sender_email}
          </p>
          {lead.company_name && (
            <p className="truncate text-xs text-zinc-500">{lead.company_name}</p>
          )}
        </div>
        {lead.needs_review && (
          <div className="shrink-0 rounded-full bg-amber-100 p-1" title="Needs review">
            <AlertTriangle className="h-3 w-3 text-amber-600" />
          </div>
        )}
      </div>

      {lead.service_requested && (
        <p className="mt-2 text-xs font-medium text-zinc-700">{lead.service_requested}</p>
      )}

      {lead.summary && (
        <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{lead.summary}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {lead.urgency && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${urgencyColors[lead.urgency]}`}>
            <Clock className="h-2.5 w-2.5" />
            {lead.urgency}
          </span>
        )}
        {lead.budget_hint && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
            <DollarSign className="h-2.5 w-2.5" />
            {lead.budget_hint.length > 20 ? lead.budget_hint.slice(0, 20) + '...' : lead.budget_hint}
          </span>
        )}
        {lead.location && (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700">
            <MapPin className="h-2.5 w-2.5" />
            {lead.location}
          </span>
        )}
        {lead.meeting_intent && (
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700">
            <Phone className="h-2.5 w-2.5" />
            call
          </span>
        )}
        {lead.confidence_score != null && (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            lead.confidence_score >= 0.8 ? 'bg-green-50 text-green-700' :
            lead.confidence_score >= 0.5 ? 'bg-amber-50 text-amber-700' :
            'bg-red-50 text-red-700'
          }`}>
            {Math.round(lead.confidence_score * 100)}%
          </span>
        )}
      </div>

      {lead.received_at && (
        <p className="mt-2 text-[10px] text-zinc-400">
          {formatDistanceToNow(new Date(lead.received_at), { addSuffix: true })}
        </p>
      )}
    </button>
  );
}
