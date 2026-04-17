'use client';

import { Lead } from '@/lib/types';
import { Sparkles, MessageSquare, CalendarCheck, XCircle } from 'lucide-react';

interface Props {
  leads: Lead[];
}

export default function DashboardStats({ leads }: Props) {
  const counts = {
    new: leads.filter(l => l.status === 'new').length,
    replied: leads.filter(l => l.status === 'replied').length,
    booked: leads.filter(l => l.status === 'booked').length,
    lost: leads.filter(l => l.status === 'lost').length,
  };

  const stats = [
    { label: 'New', count: counts.new, icon: Sparkles, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Replied', count: counts.replied, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Booked', count: counts.booked, icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Lost', count: counts.lost, icon: XCircle, color: 'text-zinc-400', bg: 'bg-zinc-50' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(s => (
        <div key={s.label} className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <div className={`rounded-md p-1.5 ${s.bg}`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <span className="text-sm font-medium text-zinc-600">{s.label}</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">{s.count}</p>
        </div>
      ))}
    </div>
  );
}
