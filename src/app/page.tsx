'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  Inbox, Sparkles, ArrowRight, Mail, Zap, CheckCircle2, Clock,
  Filter, Send, Eye, LayoutGrid, AlertTriangle,
  Building, DollarSign, MapPin, Code,
} from 'lucide-react';
import MorningComparison from '@/components/MorningComparison';
import LeadShowcase from '@/components/LeadShowcase';

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/dashboard');
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-zinc-400">
          <Inbox className="h-5 w-5 animate-pulse" />
          <span className="text-sm">Loading</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
              <Inbox className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Inbox Pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Try the demo
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[960px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-300/30 via-transparent to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Open source. Self-hosted. Runs on your own Gmail.
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Your inbox is killing <br className="hidden sm:block" />
              <span className="bg-gradient-to-br from-indigo-700 via-indigo-500 to-zinc-900 bg-clip-text text-transparent">
                your pipeline.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              Real enquiries get buried under newsletters and noise. By the time you reply,
              they&apos;ve hired someone else. Inbox Pipeline fixes that in about ten minutes.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
              <Link
                href="/demo"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                See it in action
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Set up with my Gmail
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-4 text-xs text-zinc-400">
              Bring your own Supabase, Claude, and Gmail keys. You approve every reply.
            </p>
          </div>

          {/* Hero visual */}
          <div className="mx-auto mt-12 max-w-5xl">
            <HeroVisual />
          </div>

          {/* Proof strip */}
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
            <Proof label="Setup time" value="~10 min" />
            <Proof label="You approve every send" value="100%" />
            <Proof label="Your data stays with you" value="Self-hosted" />
          </div>
        </div>
      </section>

      {/* ICP / WHO THIS IS FOR */}
      <section className="border-t border-zinc-100 bg-zinc-50/60 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600">
              If you recognise yourself
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              You freelance. Enquiries pay the bills.
            </h2>
            <p className="mt-3 text-zinc-600">
              You&apos;re a photographer, consultant, designer, coach, or small-agency owner.
              You don&apos;t have a sales team. You have a laptop, a client list, and an inbox
              that&apos;s slowly eating your week.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <PainCard
              icon={Mail}
              title="Enquiries get buried"
              body="Real leads sit next to invoices, newsletters, and cold outreach. You&apos;ll get to them. Eventually."
            />
            <PainCard
              icon={Clock}
              title="Good leads go cold"
              body="The email you meant to reply to on Tuesday is still sitting there on Friday. By Monday they&apos;ve hired someone else."
            />
            <PainCard
              icon={LayoutGrid}
              title="Most tools are overkill"
              body="You tried HubSpot for a week. Pipedrive for a day. You&apos;re a team of one. You need less, not more."
            />
          </div>
        </div>
      </section>

      {/* MORNING COMPARISON (scroll-driven) */}
      <MorningComparison />

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              From inbox to pipeline in three steps.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <StepCard
              number="01"
              title="Connect Gmail"
              body="One OAuth click. Read your inbox, send your replies. Ten minutes and you&apos;re running."
              icon={Mail}
            />
            <StepCard
              number="02"
              title="AI does the sorting"
              body="Every email gets classified. Real enquiries get name, company, budget, urgency, and location pulled out. A reply gets drafted in your voice."
              icon={Zap}
              highlight
            />
            <StepCard
              number="03"
              title="You hit send"
              body="Drafts land in a clean kanban. Edit, ignore, or send in one click. Nothing goes out without you."
              icon={Send}
            />
          </div>
        </div>
      </section>

      {/* LEAD SHOWCASE (rotating ICP cards) */}
      <LeadShowcase />

      {/* FEATURES */}
      <section className="border-y border-zinc-100 bg-zinc-50/60 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Built for solo operators.
            </h2>
            <p className="mt-3 text-zinc-600">
              No team settings. No custom pipelines. No billing dashboard you&apos;ll never open.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={Filter}
              title="Classification that works"
              body="Tells a genuine sales enquiry apart from newsletters, client ops, and cold pitches."
            />
            <Feature
              icon={CheckCircle2}
              title="Structured lead details"
              body="Name, company, service, urgency, budget, location. Pulled out of the email for you."
            />
            <Feature
              icon={Send}
              title="Replies you&apos;d actually send"
              body="Warm, specific, and in your tone. Edit anything before sending."
            />
            <Feature
              icon={LayoutGrid}
              title="Four columns, that&apos;s it"
              body="New, Replied, Booked, Lost. Your whole pipeline at a glance. That&apos;s the CRM."
            />
            <Feature
              icon={AlertTriangle}
              title="Cautious when it should be"
              body="Ambiguous emails get flagged for review instead of being misclassified."
            />
            <Feature
              icon={Eye}
              title="You stay in control"
              body="AI never hits send. Every reply passes through you first."
            />
          </div>
        </div>
      </section>

      {/* PRICING / HOW IT WORKS FINANCIALLY */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600">
              Pricing
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Open source. You pay nothing to us.
            </h2>
            <p className="mt-3 text-zinc-600">
              There&apos;s no subscription because there&apos;s no service company. You host it. You run it.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                <Code className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">Self-hosted. Bring your own keys.</h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Clone the repo, plug in three API keys, and you&apos;re running. Your data stays in your accounts.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <CostRow label="Vercel (hosting)" cost="Free tier" note="Hobby plan covers solo use" />
              <CostRow label="Supabase (database)" cost="Free tier" note="500MB + 50k users" />
              <CostRow label="Claude API (the brain)" cost="~£2 to £8/mo" note="Based on your inbox volume" />
            </div>

            <p className="mt-6 text-sm leading-relaxed text-zinc-500">
              Real math: if you get 20 business enquiries a month, Claude classification and drafting
              costs you under a pound. Heavy inboxes with 200+ enquiries land around £8. You only pay
              for what you actually use, directly to the provider.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/demo"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Try the demo first
              </Link>
              <a
                href="https://github.com/stoddnetworks/inbox-pipeline"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <Code className="h-3.5 w-3.5" />
                Setup instructions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t border-zinc-100 bg-zinc-900 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(129,140,248,0.2),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
            Your next client is already in your inbox.
          </h2>
          <p className="mt-4 text-zinc-300">
            Don&apos;t make them wait. Try the demo with sample data, then hook up Gmail and watch it
            work on your real enquiries.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Link
              href="/demo"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              See it in action
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Set up with my Gmail
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-sm text-zinc-500 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-600">
              <Inbox className="h-3 w-3 text-white" />
            </div>
            <span className="font-medium text-zinc-700">Inbox Pipeline</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-zinc-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-900 transition-colors">Terms</Link>
            <a
              href="https://github.com/stoddnetworks/inbox-pipeline"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-zinc-900 transition-colors"
            >
              <Code className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function HeroVisual() {
  return (
    <div className="relative rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl shadow-indigo-900/5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
        {/* Left: raw email */}
        <div className="flex flex-col rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 text-xs text-zinc-500">
            <Mail className="h-3.5 w-3.5" />
            <span className="font-medium">Inbox</span>
            <span className="ml-auto">2 hours ago</span>
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <p className="font-medium text-zinc-900">Marcus Wright &lt;marcus@westbayventures.com&gt;</p>
            <p className="font-semibold text-zinc-800">Rebrand engagement, need to move quickly</p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-zinc-600">
            Hi there, we were introduced by Alex from Meridian. She spoke very highly of your work.
            I&apos;m the CEO at West Bay Ventures (Series B fintech, 60 people). We&apos;ve outgrown our
            current identity and are launching a new product in 8 weeks. We need a full rebrand...
          </p>
          <p className="mt-auto pt-3 text-[10px] text-zinc-400">
            Buried under 47 other emails.
          </p>
        </div>

        {/* Divider / AI badge */}
        <div className="flex items-center justify-center sm:flex-col sm:justify-center">
          <div className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-700">Claude</span>
          </div>
        </div>

        {/* Right: extracted lead card */}
        <div className="flex flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">Marcus Wright</p>
              <p className="text-xs text-zinc-500">CEO, West Bay Ventures</p>
            </div>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
              urgent
            </span>
          </div>

          <p className="mt-2.5 text-xs font-medium text-zinc-800">
            Brand strategy and full rebrand
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <Tag icon={Building}>Series B fintech</Tag>
            <Tag icon={DollarSign}>Premium</Tag>
            <Tag icon={MapPin}>London</Tag>
            <Tag icon={Clock}>8-week launch</Tag>
          </div>

          <div className="mt-3 rounded-md border border-indigo-100 bg-indigo-50/60 p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-indigo-700">
              <Sparkles className="h-2.5 w-2.5" />
              Drafted reply
            </div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-700">
              Hi Marcus, thanks for reaching out, and please pass my thanks to Alex. 8 weeks is tight
              but doable for a focused engagement...
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button className="pointer-events-none inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-semibold text-white">
              <Send className="h-2.5 w-2.5" />
              Send reply
            </button>
            <span className="text-[10px] text-zinc-400">98% confidence</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Proof({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-center shadow-sm">
      <p className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">{value}</p>
      <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
    </div>
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

function PainCard({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
        <Icon className="h-4 w-4 text-zinc-700" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{body}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  body,
  icon: Icon,
  highlight,
}: {
  number: string;
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-6 transition-colors ${
        highlight
          ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
          : 'border-zinc-200 bg-white text-zinc-900'
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-semibold ${
            highlight ? 'text-indigo-200' : 'text-zinc-400'
          }`}
        >
          {number}
        </span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            highlight ? 'bg-white/15' : 'bg-indigo-50'
          }`}
        >
          <Icon className={`h-4 w-4 ${highlight ? 'text-white' : 'text-indigo-600'}`} />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p
        className={`mt-2 text-sm leading-relaxed ${
          highlight ? 'text-indigo-50' : 'text-zinc-600'
        }`}
      >
        {body}
      </p>
    </div>
  );
}

function Feature({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
        <Icon className="h-4 w-4 text-indigo-600" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-zinc-600">{body}</p>
    </div>
  );
}

function CostRow({ label, cost, note }: { label: string; cost: string; note: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-900">{cost}</p>
      <p className="mt-0.5 text-[11px] text-zinc-500">{note}</p>
    </div>
  );
}
