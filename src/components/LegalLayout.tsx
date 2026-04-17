import Link from 'next/link';
import { Inbox } from 'lucide-react';

interface Props {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, lastUpdated, children }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Nav */}
      <nav className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
              <Inbox className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Inbox Pipeline</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: {lastUpdated}</p>

        <article className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-700 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-900 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-indigo-600 [&_a]:underline [&_a:hover]:text-indigo-700">
          {children}
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 px-4 text-xs text-zinc-500 sm:flex-row sm:justify-between">
          <Link href="/" className="hover:text-zinc-700 transition-colors">
            Inbox Pipeline
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-zinc-700 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-700 transition-colors">Terms</Link>
            <a
              href="https://github.com/stoddnetworks/inbox-pipeline"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-700 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
