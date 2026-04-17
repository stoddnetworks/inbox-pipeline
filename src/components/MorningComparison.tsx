'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Clock, Sparkles, Check } from 'lucide-react';

interface Step {
  title: string;
  note?: string;
}

const manualSteps: Step[] = [
  { title: 'Open Gmail. 127 unread.', note: 'You scroll. You sigh.' },
  { title: 'Skim subject lines', note: 'Was the good one from Marcus or Mark?' },
  { title: 'Miss the one from a hot lead', note: 'It’s buried on page 3 under Stripe receipts.' },
  { title: 'Context-switch to client work', note: 'You’ll come back to it. Promise.' },
  { title: 'Come back at 4pm', note: 'Tired brain. Tired reply.' },
  { title: 'Draft a reply. Second-guess tone.', note: 'Is “looking forward to it” too keen?' },
  { title: 'Hit send. Cross fingers.', note: 'Still haven’t written to Sarah or Omar.' },
];

const productSteps: Step[] = [
  { title: 'Open your pipeline', note: '3 new leads already classified.' },
  { title: 'Marcus is tagged urgent', note: 'Budget, company, timeline all extracted.' },
  { title: 'Review the draft', note: 'Warm, specific, in your voice.' },
  { title: 'Tweak one word', note: 'Change “scope” to “approach.”' },
  { title: 'Click Send', note: 'The kanban moves Marcus to Replied.' },
  { title: 'Done. Coffee still warm.', note: 'You have 47 minutes back in your morning.' },
];

export default function MorningComparison() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Drive the counters and visible-step count from scroll progress
  const manualCounter = useTransform(scrollYProgress, [0.05, 0.7], [0, 47]);
  const productCounter = useTransform(scrollYProgress, [0.05, 0.7], [0, 0]);
  const manualStepFloat = useTransform(scrollYProgress, [0.1, 0.75], [0, manualSteps.length]);
  const productStepFloat = useTransform(scrollYProgress, [0.15, 0.8], [0, productSteps.length]);

  const [manualDisplay, setManualDisplay] = useState(0);
  const [productDisplay, setProductDisplay] = useState(0);
  const [manualVisible, setManualVisible] = useState(0);
  const [productVisible, setProductVisible] = useState(0);

  useMotionValueEvent(manualCounter, 'change', v => setManualDisplay(Math.round(v)));
  useMotionValueEvent(productCounter, 'change', v => setProductDisplay(Math.round(v)));
  useMotionValueEvent(manualStepFloat, 'change', v => setManualVisible(Math.floor(v)));
  useMotionValueEvent(productStepFloat, 'change', v => setProductVisible(Math.floor(v)));

  return (
    <section
      ref={ref}
      className="relative border-y border-zinc-100 bg-gradient-to-b from-white via-indigo-50/30 to-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600">
            A solo operator’s morning
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Same inbox. Two very different mornings.
          </h2>
          <p className="mt-3 text-zinc-600">
            Scroll to watch how the first hour of your day plays out with and without Inbox Pipeline.
          </p>
        </div>

        {/* Sticky side-by-side */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          {/* Manual column */}
          <Column
            label="Without Inbox Pipeline"
            counter={manualDisplay}
            unit="min lost"
            tone="dark"
            steps={manualSteps}
            visibleCount={manualVisible}
          />
          {/* Product column */}
          <Column
            label="With Inbox Pipeline"
            counter={productDisplay}
            unit="min lost"
            tone="brand"
            steps={productSteps}
            visibleCount={productVisible}
          />
        </div>

        {/* Final stat card */}
        <FinalStat progress={scrollYProgress} />
      </div>
    </section>
  );
}

// ─── Column ────────────────────────────────────────────────────

function Column({
  label,
  counter,
  unit,
  tone,
  steps,
  visibleCount,
}: {
  label: string;
  counter: number;
  unit: string;
  tone: 'dark' | 'brand';
  steps: Step[];
  visibleCount: number;
}) {
  const isBrand = tone === 'brand';
  return (
    <div className="sticky top-24 self-start">
      {/* Header */}
      <div
        className={`relative overflow-hidden rounded-2xl border px-5 py-4 shadow-sm ${
          isBrand
            ? 'border-indigo-500 bg-indigo-600 text-white'
            : 'border-zinc-800 bg-zinc-900 text-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isBrand ? (
              <Sparkles className="h-4 w-4 text-indigo-200" />
            ) : (
              <Clock className="h-4 w-4 text-zinc-400" />
            )}
            <span className="text-sm font-semibold tracking-tight">{label}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`flex min-w-[48px] items-center justify-center rounded-full px-3 py-1 text-sm font-semibold tabular-nums ${
                isBrand ? 'bg-white text-indigo-700' : 'bg-white text-zinc-900'
              }`}
            >
              {counter}
            </div>
            <span className={`text-xs font-medium ${isBrand ? 'text-indigo-100' : 'text-zinc-400'}`}>
              {unit}
            </span>
          </div>
        </div>
      </div>

      {/* Steps list */}
      <div className="mt-4 flex flex-col gap-2">
        {steps.map((step, i) => {
          const isVisible = i < visibleCount;
          const isCurrent = i === visibleCount - 1;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={
                isVisible
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 12, scale: 0.98 }
              }
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-xl border bg-white p-4 shadow-sm transition-shadow ${
                isCurrent
                  ? isBrand
                    ? 'border-indigo-300 shadow-md shadow-indigo-600/10'
                    : 'border-zinc-300 shadow-md shadow-zinc-900/10'
                  : 'border-zinc-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      isBrand ? 'bg-indigo-600' : 'bg-zinc-900'
                    }`}
                  >
                    {isBrand ? (
                      <Sparkles className="h-3 w-3 text-white" />
                    ) : (
                      <Clock className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {i + 1}. {step.title}
                    </p>
                    {step.note && (
                      <p className="mt-0.5 text-xs text-zinc-500">{step.note}</p>
                    )}
                  </div>
                </div>
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    isBrand ? 'bg-indigo-600' : 'bg-zinc-900'
                  }`}
                >
                  <Check className="h-3 w-3 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Final pinned stat ────────────────────────────────────────

function FinalStat({ progress }: { progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const opacity = useTransform(progress, [0.85, 1], [0, 1]);
  const y = useTransform(progress, [0.85, 1], [30, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="mx-auto mt-14 max-w-2xl rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 text-center text-white shadow-xl shadow-indigo-600/20"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-200">
        The difference
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        You just saved 47 minutes <br className="hidden sm:block" />
        before 9am.
      </p>
      <p className="mt-3 text-sm text-indigo-100">
        That’s more billable time, less inbox guilt, and a shot at the client you would’ve missed.
      </p>
    </motion.div>
  );
}
