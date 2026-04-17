'use client';

import { Mail, CheckCircle } from 'lucide-react';

interface Props {
  userId: string;
  isConnected: boolean;
  connectedEmail?: string;
}

export default function ConnectGmail({ userId, isConnected, connectedEmail }: Props) {
  const handleConnect = () => {
    // Pass userId as state parameter for the OAuth callback
    window.location.href = `/api/auth/gmail?state=${userId}`;
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <div>
          <p className="text-sm font-medium text-green-800">Gmail connected</p>
          {connectedEmail && <p className="text-xs text-green-600">{connectedEmail}</p>}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 hover:border-zinc-400 transition-colors"
    >
      <Mail className="h-5 w-5 text-red-500" />
      Connect Gmail
    </button>
  );
}
