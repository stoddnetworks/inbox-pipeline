'use client';

import { useEffect } from 'react';
import { CheckCircle, Info } from 'lucide-react';

interface Props {
  message: string;
  type?: 'success' | 'info';
  onDismiss: () => void;
}

export default function Toast({ message, type = 'success', onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const Icon = type === 'success' ? CheckCircle : Info;
  const colors =
    type === 'success'
      ? 'bg-green-50 border-green-200 text-green-800'
      : 'bg-blue-50 border-blue-200 text-blue-800';
  const iconColor = type === 'success' ? 'text-green-600' : 'text-blue-600';

  return (
    <div className="pointer-events-none fixed top-4 left-1/2 z-[60] -translate-x-1/2">
      <div
        className={`pointer-events-auto flex items-center gap-2 rounded-lg border px-4 py-2.5 shadow-lg ${colors} animate-in fade-in slide-in-from-top-2 duration-200`}
      >
        <Icon className={`h-4 w-4 shrink-0 ${iconColor}`} />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
