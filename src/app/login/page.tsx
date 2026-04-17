'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Inbox, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Default to sign-up. New visitors are the primary audience.
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setError('Check your email for a confirmation link.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
                <Inbox className="h-6 w-6 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {isSignUp
                ? 'Turn your inbox into a pipeline in about ten minutes.'
                : 'Sign in to your pipeline.'}
            </p>
          </div>

          {/* Setup notice */}
          {!isSupabaseConfigured && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Setup required</p>
                  <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                    Create a <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[11px]">.env.local</code> file
                    from <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[11px]">.env.local.example</code> and
                    add your Supabase, Gmail, and Anthropic credentials. See README for full setup steps.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            {error && (
              <p className={`mt-3 text-sm ${error.includes('Check your email') ? 'text-green-600' : 'text-red-600'}`}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Switch mode */}
          <p className="mt-4 text-center text-sm text-zinc-500">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              {isSignUp ? 'Sign in' : 'Create one'}
            </button>
          </p>

          {/* Try the demo */}
          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Try the demo, no signup
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-xs text-zinc-500 sm:flex-row sm:justify-between">
          <Link href="/" className="hover:text-zinc-700 transition-colors">
            Inbox Pipeline
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-zinc-700 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-700 transition-colors">Terms</Link>
            <a
              href="https://github.com/stoddnetworks/inbox-pipeline"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-700 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
