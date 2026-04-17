'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LeadWithDraft, LeadStatus, LeadEvent, DraftedReply } from '@/lib/types';
import { DEMO_LEADS, DEMO_ALTERNATE_DRAFTS } from '@/lib/demoData';
import DashboardStats from '@/components/DashboardStats';
import KanbanBoard from '@/components/KanbanBoard';
import LeadDetail from '@/components/LeadDetail';
import DemoBanner from '@/components/DemoBanner';
import Toast from '@/components/Toast';
import { Inbox, RefreshCw, Filter, LogIn } from 'lucide-react';

export default function DemoPage() {
  const [leads, setLeads] = useState<LeadWithDraft[]>(DEMO_LEADS);
  const [selectedLead, setSelectedLead] = useState<LeadWithDraft | null>(null);
  const [filter, setFilter] = useState<'all' | 'needs_review'>('all');
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' } | null>(null);
  const [syncing, setSyncing] = useState(false);

  const needsReviewCount = leads.filter(l => l.needs_review).length;

  // Rebind the selected lead whenever the master list updates so the drawer stays in sync
  const refreshSelected = (updatedLeads: LeadWithDraft[]) => {
    if (!selectedLead) return;
    const fresh = updatedLeads.find(l => l.id === selectedLead.id);
    if (fresh) setSelectedLead(fresh);
  };

  const appendEvent = (lead: LeadWithDraft, event_type: LeadEvent['event_type'], description: string): LeadEvent => ({
    id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    lead_id: lead.id,
    user_id: lead.user_id,
    event_type,
    description,
    metadata: {},
    created_at: new Date().toISOString(),
  });

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    const updated = leads.map(l => {
      if (l.id !== leadId) return l;
      return {
        ...l,
        status,
        lead_events: [
          ...(l.lead_events || []),
          appendEvent(l, 'status_changed', `Status changed to ${status}`),
        ],
      };
    });
    setLeads(updated);
    refreshSelected(updated);
    setToast({ message: `Marked as ${status}`, type: 'success' });
  };

  const handleSendReply = async (leadId: string, draftId: string, body: string) => {
    const updated = leads.map(l => {
      if (l.id !== leadId) return l;
      const updatedDrafts: DraftedReply[] = (l.drafted_replies || []).map(d =>
        d.id === draftId
          ? { ...d, body, is_sent: true, sent_at: new Date().toISOString() }
          : d
      );
      return {
        ...l,
        status: 'replied' as LeadStatus,
        drafted_replies: updatedDrafts,
        lead_events: [
          ...(l.lead_events || []),
          appendEvent(l, 'reply_sent', 'Reply sent (demo, nothing actually sent)'),
        ],
      };
    });
    setLeads(updated);
    refreshSelected(updated);
    setToast({ message: 'Reply sent (demo)', type: 'success' });
  };

  const handleRegenerateDraft = async (leadId: string) => {
    const alternates = DEMO_ALTERNATE_DRAFTS[leadId];
    const updated = leads.map(l => {
      if (l.id !== leadId) return l;
      const drafts = l.drafted_replies || [];
      const latestIdx = drafts.findIndex(d => !d.is_sent);
      if (latestIdx === -1 || !alternates || alternates.length === 0) return l;

      // Pick the alternate the user hasn't seen recently
      const currentBody = drafts[latestIdx].body;
      const nextBody =
        alternates.find(a => a.trim() !== currentBody.trim()) || alternates[0];

      const newDrafts = [...drafts];
      newDrafts[latestIdx] = {
        ...newDrafts[latestIdx],
        body: nextBody,
        id: `draft-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return {
        ...l,
        drafted_replies: newDrafts,
        lead_events: [
          ...(l.lead_events || []),
          appendEvent(l, 'reply_drafted', 'New AI draft reply generated'),
        ],
      };
    });
    setLeads(updated);
    refreshSelected(updated);
    setToast({ message: 'New draft generated', type: 'success' });
  };

  const handleSync = async () => {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 900));
    setSyncing(false);
    setToast({
      message: 'Demo mode. Connect your Gmail to sync real emails.',
      type: 'info',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <DemoBanner />

      {/* Simplified header for demo (no auth) */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600">
              <Inbox className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-base font-semibold text-zinc-900">Inbox Pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Set up with my Gmail
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Top bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">Pipeline</h1>
            <p className="text-sm text-zinc-500">
              {leads.length} sample leads. Click any card to see the extracted details and drafted reply.
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-60 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Inbox'}
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <DashboardStats leads={leads} />
        </div>

        {/* Filter bar */}
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            All leads
          </button>
          {needsReviewCount > 0 && (
            <button
              onClick={() => setFilter('needs_review')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === 'needs_review'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Needs Review ({needsReviewCount})
            </button>
          )}
        </div>

        {/* Kanban */}
        <KanbanBoard
          leads={leads}
          onLeadClick={setSelectedLead}
          filter={filter}
        />

        {/* Footer CTA */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-white p-8 text-center">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
            This, but on your actual inbox.
          </h2>
          <p className="mt-2 text-sm text-zinc-600 max-w-lg mx-auto sm:text-base">
            Plug in Gmail, click sync, and real enquiries land in the kanban in under a minute.
            Open source. Self-hosted. Your data stays with you.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Set up with my Gmail
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-400">
            Prefer the code?{' '}
            <a
              href="https://github.com/stoddnetworks/inbox-pipeline"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-600 transition-colors"
            >
              View the repo on GitHub
            </a>
          </p>
        </div>
      </main>

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
          onSendReply={handleSendReply}
          onRegenerateDraft={handleRegenerateDraft}
          userId="demo-user"
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
