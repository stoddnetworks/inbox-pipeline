'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building, DollarSign, MapPin, Clock, Phone, CheckCircle2,
  Sparkles, Mail,
} from 'lucide-react';

interface Lead {
  name: string;
  role: string;
  initials: string;
  avatarGradient: string;
  service: string;
  urgencyLabel: string;
  urgencyColor: string;
  budget: string;
  location: string;
  meeting: boolean;
  confidence: number;
  replyPreview: string;
}

const leads: Lead[] = [
  {
    name: 'Marcus Wright',
    role: 'CEO at West Bay Ventures',
    initials: 'MW',
    avatarGradient: 'from-indigo-500 to-indigo-700',
    service: 'Full brand and identity rebrand',
    urgencyLabel: 'urgent',
    urgencyColor: 'bg-red-50 text-red-700',
    budget: 'Premium',
    location: 'London',
    meeting: true,
    confidence: 98,
    replyPreview:
      'Hi Marcus, thanks for reaching out, and please pass my thanks to Alex. 8 weeks is tight but doable for a focused engagement...',
  },
  {
    name: 'Sarah Chen',
    role: 'Getting married in Cornwall',
    initials: 'SC',
    avatarGradient: 'from-pink-500 to-rose-600',
    service: 'Wedding photography, full day',
    urgencyLabel: 'medium',
    urgencyColor: 'bg-indigo-50 text-indigo-700',
    budget: '£3,500',
    location: 'Cornwall',
    meeting: true,
    confidence: 95,
    replyPreview:
      'Hi Sarah, congratulations. Carnglaze is a beautiful venue, you’re going to have an incredible day. I’ve just checked my diary and 15 June is still open...',
  },
  {
    name: 'Omar Khalil',
    role: 'Head of People at Northstar',
    initials: 'OK',
    avatarGradient: 'from-teal-500 to-emerald-600',
    service: 'Executive coaching for 4 VPs',
    urgencyLabel: 'medium',
    urgencyColor: 'bg-indigo-50 text-indigo-700',
    budget: 'Flexible',
    location: 'Remote',
    meeting: true,
    confidence: 92,
    replyPreview:
      'Hi Omar, thanks for reaching out, and I’ll take two independent referrals as a good omen. A 6-month programme for four VPs is right in my wheelhouse...',
  },
  {
    name: 'David Okonkwo',
    role: 'Founder, Okonkwo Law',
    initials: 'DO',
    avatarGradient: 'from-amber-500 to-orange-600',
    service: 'Logo + brand identity package',
    urgencyLabel: 'high',
    urgencyColor: 'bg-orange-50 text-orange-700',
    budget: '£4,500',
    location: 'Manchester',
    meeting: true,
    confidence: 96,
    replyPreview:
      'Hi David, congratulations on the launch. “Modern but trustworthy, serious but not stuffy” is a brief I genuinely enjoy. £4,500 works for that scope...',
  },
];

export default function LeadShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % leads.length), 4200);
    return () => clearInterval(t);
  }, []);

  const lead = leads[index];

  return (
    <section className="relative overflow-hidden border-y border-zinc-100 bg-white py-20 sm:py-28">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/40 via-transparent to-transparent blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
        {/* LEFT: copy */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600">
            Extracted in seconds
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Every enquiry, <br />
            <span className="bg-gradient-to-br from-indigo-700 via-indigo-500 to-zinc-900 bg-clip-text text-transparent">
              scored and structured.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-zinc-600">
            Name, role, service, urgency, budget, location, and meeting intent pulled straight from the
            email. Every lead gets a confidence score so you know what to trust.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-zinc-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
              <span>Real, human-written enquiries. Not lookalikes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
              <span>Draft reply in your tone, ready before you read the email.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
              <span>Low-confidence leads flagged for review, not silently misclassified.</span>
            </li>
          </ul>

          {/* dots */}
          <div className="mt-8 flex items-center gap-1.5">
            {leads.map((l, i) => (
              <button
                key={l.name}
                onClick={() => setIndex(i)}
                aria-label={`Show ${l.name}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-8 bg-indigo-600' : 'w-1.5 bg-zinc-300 hover:bg-zinc-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: animated lead card */}
        <div className="relative h-[440px] sm:h-[460px]">
          {/* Radar backdrop */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-72 w-72 sm:h-80 sm:w-80">
              <span className="absolute inset-0 animate-ping rounded-full bg-indigo-500/10" />
              <span className="absolute inset-4 rounded-full border border-indigo-200/60" />
              <span className="absolute inset-10 rounded-full border border-indigo-200/70" />
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-indigo-100 to-white" />
            </div>
          </div>

          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={lead.name}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-4 bottom-4 sm:inset-x-8 sm:bottom-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl shadow-indigo-900/10"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${lead.avatarGradient} text-sm font-semibold text-white shadow-sm`}
                  >
                    {lead.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{lead.name}</p>
                    <p className="text-xs text-zinc-500">{lead.role}</p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${lead.urgencyColor}`}>
                  {lead.urgencyLabel}
                </span>
              </div>

              {/* Service */}
              <p className="mt-3 text-xs font-medium text-zinc-800">{lead.service}</p>

              {/* Extracted tags */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Tag icon={Building}>{lead.role.split(' at ')[1] || 'Personal'}</Tag>
                <Tag icon={DollarSign}>{lead.budget}</Tag>
                <Tag icon={MapPin}>{lead.location}</Tag>
                {lead.meeting && <Tag icon={Phone}>Wants a call</Tag>}
              </div>

              {/* Drafted reply */}
              <div className="mt-3 rounded-md border border-indigo-100 bg-indigo-50/60 p-2.5">
                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-indigo-700">
                  <Sparkles className="h-2.5 w-2.5" />
                  Drafted reply
                </div>
                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-zinc-700">
                  {lead.replyPreview}
                </p>
              </div>

              {/* Confidence row */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="font-medium uppercase tracking-wide">AI confidence</span>
                    <span className="font-semibold text-zinc-900 tabular-nums">
                      {lead.confidence}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <motion.div
                      key={lead.name + 'bar'}
                      initial={{ width: 0 }}
                      animate={{ width: `${lead.confidence}%` }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                    />
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-semibold text-white">
                  <Mail className="h-2.5 w-2.5" />
                  In pipeline
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Tag({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
      <Icon className="h-2.5 w-2.5" />
      {children}
    </span>
  );
}

// Silence unused import warning (Clock icon reserved for future urgency chip)
void Clock;
