'use client';

import Link from 'next/link';
import { Sparkles, Code, ArrowRight } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="border-b border-zinc-200 bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-blue-100 p-1">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <p className="text-sm text-zinc-700">
            <span className="font-medium text-zinc-900">Demo mode.</span>
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
            className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <Code className="h-3.5 w-3.5" />
            View code
          </a>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            Set up with my Gmail
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
