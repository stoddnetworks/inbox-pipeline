'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Inbox, LogOut } from 'lucide-react';

export default function Header({ userEmail }: { userEmail?: string }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600">
            <Inbox className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-base font-semibold text-zinc-900">Inbox Pipeline</span>
        </div>
        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="text-sm text-zinc-500">{userEmail}</span>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
