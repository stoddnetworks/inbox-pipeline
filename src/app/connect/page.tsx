'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import { Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function ConnectPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
        return;
      }
      setUserId(session.user.id);
      setUserEmail(session.user.email || '');
    });

    // Check for error in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      setError('Failed to connect Gmail. Please try again.');
    }
  }, [router]);

  const handleConnect = () => {
    if (!userId) return;
    window.location.href = `/api/auth/gmail?state=${userId}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header userEmail={userEmail} />
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <Mail className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900">Connect your Gmail</h1>
          <p className="mt-2 text-sm text-zinc-500 max-w-sm mx-auto">
            We&apos;ll scan your recent inbox for business enquiries and turn them into pipeline leads automatically.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-zinc-900">Read-only inbox access</p>
                <p className="text-xs text-zinc-500">We fetch recent emails to find business enquiries</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-zinc-900">Send replies on your behalf</p>
                <p className="text-xs text-zinc-500">Only when you review and click Send</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-zinc-900">AI-powered classification</p>
                <p className="text-xs text-zinc-500">Automatically identifies real business enquiries</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={!userId}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            Connect Gmail
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="flex w-full items-center justify-center text-sm text-zinc-500 hover:text-zinc-700"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
