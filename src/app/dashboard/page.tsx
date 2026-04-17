'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LeadWithDraft, LeadStatus, ConnectedAccount } from '@/lib/types';
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import KanbanBoard from '@/components/KanbanBoard';
import LeadDetail from '@/components/LeadDetail';
import ConnectGmail from '@/components/ConnectGmail';
import { RefreshCw, Filter, Inbox } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [leads, setLeads] = useState<LeadWithDraft[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadWithDraft | null>(null);
  const [account, setAccount] = useState<ConnectedAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'needs_review'>('all');

  // Load session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
        return;
      }
      setUserId(session.user.id);
      setUserEmail(session.user.email || '');
      setAccessToken(session.access_token);
    });
  }, [router]);

  // Load connected account
  useEffect(() => {
    if (!userId) return;
    supabase
      .from('connected_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'gmail')
      .single()
      .then(({ data }) => {
        setAccount(data as ConnectedAccount | null);
      });
  }, [userId]);

  // Load leads
  const fetchLeads = useCallback(async () => {
    if (!userId || !accessToken) return;
    try {
      const res = await fetch(`/api/leads?userId=${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, accessToken]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Sync emails from Gmail
  const handleSync = async () => {
    if (!userId || syncing) return;
    setSyncing(true);
    try {
      const res = await fetch('/api/emails/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.new > 0) {
        // Process new emails with AI
        setProcessing(true);
        await fetch('/api/emails/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        setProcessing(false);
        await fetchLeads();
      }
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setSyncing(false);
      setProcessing(false);
    }
  };

  // Status change
  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      // Update locally
      setLeads(prev =>
        prev.map(l => (l.id === leadId ? { ...l, status } : l))
      );
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error('Status change error:', err);
    }
  };

  // Send reply
  const handleSendReply = async (leadId: string, draftId: string, body: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/send-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, draftId, body }),
      });
      if (res.ok) {
        setLeads(prev =>
          prev.map(l => (l.id === leadId ? { ...l, status: 'replied' as LeadStatus } : l))
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, status: 'replied' as LeadStatus } : null);
        }
      }
    } catch (err) {
      console.error('Send reply error:', err);
    }
  };

  // Regenerate draft
  const handleRegenerateDraft = async (leadId: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        // Refresh the lead data
        await fetchLeads();
        // Refresh selected lead
        const leadRes = await fetch(`/api/leads/${leadId}`);
        if (leadRes.ok) {
          const updatedLead = await leadRes.json();
          setSelectedLead(updatedLead);
        }
      }
    } catch (err) {
      console.error('Regenerate error:', err);
    }
  };

  const needsReviewCount = leads.filter(l => l.needs_review).length;

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header userEmail={userEmail} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Top bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">Pipeline</h1>
            <p className="text-sm text-zinc-500">
              {leads.length === 0
                ? 'No leads yet — sync your Gmail to get started'
                : `${leads.length} lead${leads.length !== 1 ? 's' : ''} in your pipeline`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ConnectGmail
              userId={userId || ''}
              isConnected={!!account}
              connectedEmail={account?.email}
            />
            {account && (
              <button
                onClick={handleSync}
                disabled={syncing || processing}
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${syncing || processing ? 'animate-spin' : ''}`} />
                {processing ? 'Processing...' : syncing ? 'Syncing...' : 'Sync Inbox'}
              </button>
            )}
          </div>
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
                ? 'bg-zinc-900 text-white'
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-2 text-zinc-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading pipeline...</span>
            </div>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white py-20">
            <Inbox className="h-10 w-10 text-zinc-300 mb-3" />
            <p className="text-sm font-medium text-zinc-600">No leads yet</p>
            <p className="mt-1 text-xs text-zinc-400">
              {account
                ? 'Click "Sync Inbox" to fetch and process your recent emails'
                : 'Connect your Gmail to get started'}
            </p>
          </div>
        ) : (
          <KanbanBoard
            leads={leads}
            onLeadClick={setSelectedLead}
            filter={filter}
          />
        )}
      </main>

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
          onSendReply={handleSendReply}
          onRegenerateDraft={handleRegenerateDraft}
          userId={userId || ''}
        />
      )}
    </div>
  );
}
