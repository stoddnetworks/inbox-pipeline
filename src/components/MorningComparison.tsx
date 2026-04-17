'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Clock, Sparkles, Check } from 'lucide-react';

interface Step {
  title: string;
  note: string;
}

// Condensed to fit a single viewport without cropping.
const manualSteps: Step[] = [
  { title: 'Open Gmail. 127 unread.', note: 'You scroll. You sigh.' },
  { title: 'Miss the hot lead.', note: 'Buried on page 3 under Stripe receipts.' },
  { title: 'Context-switch to client work.', note: 'You’ll come back to it.' },
  { title: '4pm. Tired brain. Tired reply.', note: 'Second-guess the tone twice.' },
  { title: 'Send. Cross fingers.', note: 'Sarah and Omar still waiting.' },
];

const productSteps: Step[] = [
  { title: 'Open the pipeline.', note: '3 leads classified.' },
  { title: 'Marcus tagged urgent.', note: 'Budget, company, timeline extracted.' },
  { title: 'Review the draft.', note: 'In your voice. Specific.' },
  { title: 'Send. Coffee still warm.', note: '47 minutes back in your day.' },
];

export default function MorningComparison() {
  const outerRef = useRef<HTMLDivElement>(null);

  // Outer wrapper scroll: when its top hits viewport top, progress = 0; when its bottom hits viewport
  // bottom, progress = 1. The sticky inner pane stays pinned for that whole range.
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // Reveal budget: 0.10 → 0.85 for the main reveals, leaving 0.85–1.0 for the final stat.
  const manualCounter = useTransform(scrollYProgress, [0.10, 0.85], [0, 47]);
  const manualFloat = useTransform(scrollYProgress, [0.10, 0.80], [0, manualSteps.length]);
  const productFloat = useTransform(scrollYProgress, [0.18, 0.85], [0, productSteps.length]);

  // Final stat fades in over the last 15% of scroll progress.
  const statOpacity = useTransform(scrollYProgress, [0.85, 0.97], [0, 1]);
  const statY = useTransform(scrollYProgress, [0.85, 0.97], [24, 0]);

  const [manualDisplay, setManualDisplay] = useState(0);
  const [manualVisible, setManualVisible] = useState(0);
  const [productVisible, setProductVisible] = useState(0);

  useMotionValueEvent(manualCounter, 'change', v => setManualDisplay(Math.round(v)));
  useMotionValueEvent(manualFloat, 'change', v => setManualVisible(Math.floor(v)));
  useMotionValueEvent(productFloat, 'change', v => setProductVisible(Math.floor(v)));

  return (
    // Outer section is ~3 viewports tall to give us scroll room for the reveals.
    <section
      ref={outerRef}
      className="relative isolate border-y border-zinc-100 bg-gradient-to-b from-white via-indigo-50/30 to-white"
      style={{ height: '320vh' }}
    >
      {/* Pinned inner pane: stays locked to the viewport while scrollYProgress runs 0 → 1. */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-4">
          {/* Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600">
              A solo operator’s morning
            </p>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Same inbox. Two different mornings.
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              The first hour of your day, with and without Inbox Pipeline.
            </p>
          </div>

          {/* Two columns */}
          <div className="relative mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
            <Column
              label="Without Inbox Pipeline"
              counter={manualDisplay}
              unit="min lost"
              tone="dark"
              steps={manualSteps}
              visibleCount={manualVisible}
            />
            <Column
              label="With Inbox Pipeline"
              counter={0}
              unit="min lost"
              tone="brand"
              steps={productSteps}
              visibleCount={productVisible}
            />

            {/* Final stat: overlays centered over the columns once animation is complete. */}
            <motion.div
              style={{ opacity: statOpacity, y: statY }}
              className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-4"
            >
              <div className="mx-auto max-w-xl rounded-2xl border border-indigo-300/80 bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-center text-white shadow-2xl shadow-indigo-600/30 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-200">
                  The difference
                </p>
                <p className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">
                  47 minutes back <br className="hidden sm:block" />
                  before 9am.
                </p>
                <p className="mt-2 text-sm text-indigo-100">
                  More billable time. Less inbox guilt. One more client that didn’t slip away.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
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
    <div className="flex flex-col">
      {/* Header */}
      <div
        className={`relative overflow-hidden rounded-xl border px-4 py-3 shadow-sm ${
          isBrand
            ? 'border-indigo-500 bg-indigo-600 text-white'
            : 'border-zinc-800 bg-zinc-900 text-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isBrand ? (
              <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
            ) : (
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
            )}
            <span className="text-xs font-semibold tracking-tight sm:text-sm">{label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={`flex min-w-[42px] items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums sm:text-sm ${
                isBrand ? 'bg-white text-indigo-700' : 'bg-white text-zinc-900'
              }`}
            >
              {counter}
            </div>
            <span className={`text-[10px] font-medium ${isBrand ? 'text-indigo-100' : 'text-zinc-400'}`}>
              {unit}
            </span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="mt-3 flex flex-col gap-1.5">
        {steps.map((step, i) => {
          const isVisible = i < visibleCount;
          const isCurrent = i === visibleCount - 1;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={
                isVisible
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 10, scale: 0.98 }
              }
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-lg border bg-white px-3 py-2 shadow-sm ${
                isCurrent
                  ? isBrand
                    ? 'border-indigo-300 shadow-md shadow-indigo-600/10'
                    : 'border-zinc-300 shadow-md shadow-zinc-900/10'
                  : 'border-zinc-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                      isBrand ? 'bg-indigo-600' : 'bg-zinc-900'
                    }`}
                  >
                    {isBrand ? (
                      <Sparkles className="h-2.5 w-2.5 text-white" />
                    ) : (
                      <Clock className="h-2.5 w-2.5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 sm:text-sm">
                      {i + 1}. {step.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500 sm:text-xs">{step.note}</p>
                  </div>
                </div>
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                    isBrand ? 'bg-indigo-600' : 'bg-zinc-900'
                  }`}
                >
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
