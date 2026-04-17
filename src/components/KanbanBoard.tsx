'use client';

import { LeadWithDraft, LeadStatus } from '@/lib/types';
import LeadCard from './LeadCard';

interface Props {
  leads: LeadWithDraft[];
  onLeadClick: (lead: LeadWithDraft) => void;
  filter: 'all' | 'needs_review';
}

const columns: { status: LeadStatus; label: string; accent: string }[] = [
  { status: 'new', label: 'New', accent: 'border-t-blue-500' },
  { status: 'replied', label: 'Replied', accent: 'border-t-amber-500' },
  { status: 'booked', label: 'Booked', accent: 'border-t-green-500' },
  { status: 'lost', label: 'Lost', accent: 'border-t-zinc-400' },
];

export default function KanbanBoard({ leads, onLeadClick, filter }: Props) {
  const filteredLeads = filter === 'needs_review'
    ? leads.filter(l => l.needs_review)
    : leads;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {columns.map(col => {
        const columnLeads = filteredLeads.filter(l => l.status === col.status);
        return (
          <div key={col.status} className={`rounded-lg border border-zinc-200 border-t-2 ${col.accent} bg-zinc-50/50`}>
            <div className="flex items-center justify-between px-3 py-2.5">
              <h3 className="text-sm font-medium text-zinc-700">{col.label}</h3>
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600">
                {columnLeads.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 px-2 pb-2" style={{ minHeight: '120px' }}>
              {columnLeads.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-8">
                  <p className="text-xs text-zinc-400">No leads</p>
                </div>
              ) : (
                columnLeads.map(lead => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onClick={() => onLeadClick(lead)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
