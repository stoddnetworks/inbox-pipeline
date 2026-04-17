'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-indigo-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-indigo-100 p-1">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <p className="text-sm text-zinc-700">
            <span className="font-semibold text-zinc-900">Demo mode.</span>
            <span className="hidden text-zinc-500 sm:inline">
              {' '}
              Every interaction works. Nothing actually gets sent.
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <a
            href="https://github.com/stoddnetworks/inbox-pipeline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-700 transition-colors"
          >
            View code
          </a>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Set up with my Gmail
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
