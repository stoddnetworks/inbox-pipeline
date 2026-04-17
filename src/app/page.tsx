'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  Inbox, Sparkles, ArrowRight, Mail, Zap, CheckCircle2, Clock,
  Filter, Send, Eye, LayoutGrid, AlertTriangle, MoveRight,
  Building, DollarSign, MapPin,
} from 'lucide-react';

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
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* ───── NAV ───── */}
      <nav className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900">
              <Inbox className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Inbox Pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              Try the demo
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden">
        {/* Soft background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-50/40 via-white to-white" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/30 via-transparent to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-500" />
              Free · Open source · Works with your Gmail
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Your inbox is <span className="bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 bg-clip-text text-transparent">killing your pipeline.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              Real enquiries get buried. Replies drag on for days. Leads go cold.
              Inbox Pipeline reads every new email, spots the real ones, pulls out the
              details, and drafts your reply — before you&apos;ve finished your coffee.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
              <Link
                href="/demo"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Try the live demo
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
              No credit card. No monthly fee. You stay in control of every reply.
            </p>
          </div>

          {/* Hero visual: email → lead card transformation */}
          <div className="mx-auto mt-12 max-w-5xl">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ───── THE PROBLEM ───── */}
      <section className="border-t border-zinc-100 bg-zinc-50/60 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              You didn&apos;t start freelancing to triage email.
            </h2>
            <p className="mt-3 text-zinc-600">
              If you run a solo service business, your pipeline lives in your inbox —
              and that&apos;s the problem.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <PainCard
              icon={Mail}
              title="Enquiries get buried"
              body="Real leads sit next to newsletters, invoices, and cold outreach. You'll get to them. Eventually."
            />
            <PainCard
              icon={Clock}
              title="Good leads go cold"
              body="By the time you draft a proper reply three days later, they've booked someone else."
            />
            <PainCard
              icon={LayoutGrid}
              title="CRMs feel like overkill"
              body="You tried HubSpot for a week. Pipedrive for a day. You're a team of one — you need less, not more."
            />
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              From inbox to pipeline in three steps.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <StepCard
              number="01"
              title="Connect your Gmail"
              body="One OAuth click. Read-only for your inbox, send-access for your replies. That's it."
              icon={Mail}
            />
            <StepCard
              number="02"
              title="AI sorts the signal from the noise"
              body="Classifies every email. Spots real enquiries. Extracts name, company, budget, urgency, location. Drafts a reply in your tone."
              icon={Zap}
              highlight
            />
            <StepCard
              number="03"
              title="Review and send"
              body="Every draft lands in a clean kanban board. Edit if you want. Send in one click. Move cards through New → Replied → Booked."
              icon={Send}
            />
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="border-y border-zinc-100 bg-zinc-50/60 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="mt-3 text-zinc-600">
              This isn&apos;t a CRM. It&apos;s your inbox, with an AI that actually helps.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={Filter}
              title="Real classification"
              body="Tells a genuine sales enquiry apart from newsletters, client ops, and noise."
            />
            <Feature
              icon={CheckCircle2}
              title="Structured leads"
              body="Auto-extracts name, company, service, urgency, budget hints, and location."
            />
            <Feature
              icon={Send}
              title="AI-drafted replies"
              body="Warm, specific, and in your tone. You edit and send — never auto-sent."
            />
            <Feature
              icon={LayoutGrid}
              title="Simple kanban"
              body="New, Replied, Booked, Lost. Four columns. Your whole pipeline at a glance."
            />
            <Feature
              icon={AlertTriangle}
              title="Conservative AI"
              body="Ambiguous emails get flagged as 'Needs Review' instead of miscategorised."
            />
            <Feature
              icon={Eye}
              title="You stay in control"
              body="Review every draft. Edit every reply. AI never clicks Send for you."
            />
          </div>
        </div>
      </section>

      {/* ───── WHO IT'S FOR ───── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Built for people like you.
            </h2>
            <p className="mt-3 text-zinc-600">
              Solo operators who make their living from inbound enquiries. If you see yourself here, Inbox Pipeline was made for you.
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2">
            {[
              'Freelance designers',
              'Independent consultants',
              'Wedding photographers',
              'Executive coaches',
              'Brand strategists',
              'Small agency owners',
              'Copywriters',
              'Web developers',
              'Videographers',
              'Architects',
            ].map(label => (
              <span
                key={label}
                className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-sm text-zinc-700 shadow-sm"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="relative overflow-hidden border-t border-zinc-100 bg-zinc-900 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(96,165,250,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
            Your next client is already in your inbox.
          </h2>
          <p className="mt-4 text-zinc-300">
            Don&apos;t let them wait. Try the live demo — no signup, no credit card — and see exactly what Inbox Pipeline will do for your real Gmail.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Link
              href="/demo"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-blue-600" />
              Try the live demo
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

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-zinc-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-sm text-zinc-500 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-1.5">
            <Inbox className="h-4 w-4 text-zinc-400" />
            <span>Inbox Pipeline</span>
          </div>
          <p>
            Built for solo operators who have better things to do than triage email.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function HeroVisual() {
  return (
    <div className="relative rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-900/5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        {/* Left: raw email */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 text-xs text-zinc-500">
            <Mail className="h-3.5 w-3.5" />
            <span className="font-medium">Inbox</span>
            <span className="ml-auto">2 hours ago</span>
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <p className="font-medium text-zinc-900">Marcus Wright &lt;marcus@westbayventures.com&gt;</p>
            <p className="font-semibold text-zinc-800">Rebrand engagement — need to move quickly</p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-zinc-600">
            Hi there, we were introduced by Alex from Meridian — she spoke very highly of your work. I&apos;m the CEO at West Bay Ventures (Series B fintech, 60 people). We&apos;ve outgrown our current identity and are launching a new product in 8 weeks. We need a full rebrand...
          </p>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center sm:flex-col">
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-medium text-zinc-700">AI</span>
          </div>
          <MoveRight className="mx-2 h-5 w-5 text-zinc-300 sm:mx-0 sm:my-2 sm:rotate-90" />
        </div>

        {/* Right: extracted lead card */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">Marcus Wright</p>
              <p className="text-xs text-zinc-500">CEO, West Bay Ventures</p>
            </div>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
              urgent
            </span>
          </div>

          <p className="mt-2.5 text-xs font-medium text-zinc-800">Brand strategy + full rebrand</p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <Tag icon={Building}>Series B fintech</Tag>
            <Tag icon={DollarSign}>premium</Tag>
            <Tag icon={MapPin}>London</Tag>
            <Tag icon={Clock}>8-week launch</Tag>
          </div>

          <div className="mt-3 rounded-md border border-blue-100 bg-blue-50/50 p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-blue-700">
              <Sparkles className="h-2.5 w-2.5" />
              Drafted reply
            </div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-700">
              Hi Marcus, thanks for reaching out — and please pass my thanks to Alex. 8 weeks is tight but doable...
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button className="pointer-events-none inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-medium text-white">
              <Send className="h-2.5 w-2.5" />
              Send
            </button>
            <span className="text-[10px] text-zinc-400">98% confidence</span>
          </div>
        </div>
      </div>
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
          ? 'border-zinc-900 bg-zinc-900 text-white'
          : 'border-zinc-200 bg-white text-zinc-900'
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium ${
            highlight ? 'text-blue-300' : 'text-zinc-400'
          }`}
        >
          {number}
        </span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            highlight ? 'bg-white/10' : 'bg-zinc-100'
          }`}
        >
          <Icon className={`h-4 w-4 ${highlight ? 'text-white' : 'text-zinc-700'}`} />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p
        className={`mt-2 text-sm leading-relaxed ${
          highlight ? 'text-zinc-300' : 'text-zinc-600'
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
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-zinc-600">{body}</p>
    </div>
  );
}
