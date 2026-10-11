import Link from 'next/link';
import { Sparkles, ShieldCheck, Lock, Cpu, ArrowUpRight } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/90 bg-slate-50 text-slate-600">
      {/* ── Top Footer: Newsletter Digest Callout ── */}
      <div className="border-b border-slate-200/70 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-800 shadow-xs mb-3">
                <Sparkles className="h-3.5 w-3.5 text-[#0092c7]" />
                <span>Weekly AI Digest</span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Stay Ahead of Artificial Intelligence
              </h3>
              <p className="mt-2 text-sm text-slate-600 max-w-md">
                Get a curated briefing of breakthrough models, newly published utilities, and production AI blueprints every week.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="max-w-md lg:ml-auto">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Columns ── */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="mb-4 inline-flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-md">
                  <span className="text-sm font-black tracking-tight text-[#00D2FF]">AI</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black tracking-tight text-slate-950">
                    AIIsEverything
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
                    aiiseverything.com
                  </span>
                </div>
              </Link>
              <p className="max-w-sm text-xs leading-relaxed text-slate-500 mt-2">
                The definitive open directory and intelligence hub for artificial intelligence — curated zero-latency tools, breaking news, deep tutorials, and an exhaustive glossary.
              </p>

              {/* Trust & Security Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-500">
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-2xs">
                  <Lock className="h-3 w-3 text-emerald-600" />
                  <span>256-Bit SSL</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-2xs">
                  <ShieldCheck className="h-3 w-3 text-indigo-600" />
                  <span>SOC2 Aligned</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-2xs">
                  <Cpu className="h-3 w-3 text-[#0092c7]" />
                  <span>Edge Executable</span>
                </div>
              </div>
            </div>

            {/* Links 1: AI Tools */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900">
                AI Tools
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-slate-950">
                    Coding Tools
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/writing" className="transition hover:text-slate-950">
                    AI Writing
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/image" className="transition hover:text-slate-950">
                    Image Generators
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/text" className="transition hover:text-slate-950">
                    Text Analyzers
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/seo" className="transition hover:text-slate-950">
                    SEO & Meta Tools
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools" className="font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 pt-1">
                    All 50+ Tools →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Links 2: Knowledge */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900">
                Knowledge Base
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/blog" className="transition hover:text-slate-950">
                    Latest AI News
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="transition hover:text-slate-950">
                    Step-by-Step Guides
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="transition hover:text-slate-950">
                    Model Reviews & Benchmarks
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools" className="transition hover:text-slate-950">
                    Prompt Engineering Hub
                  </Link>
                </li>
              </ul>
            </div>

            {/* Links 3: Platform & Admin */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900">
                Platform
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a
                    href="http://localhost:3001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-semibold text-slate-900 hover:text-indigo-600 transition"
                  >
                    <span>Admin Control Center</span>
                    <ArrowUpRight className="h-3 w-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="transition hover:text-slate-950">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition hover:text-slate-950">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span>All AI Engines Operational</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} AIIsEverything. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Crafted for creators & builders in the AI era.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
