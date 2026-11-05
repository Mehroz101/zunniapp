import React from 'react';
import Link from 'next/link';
import { Sparkles, Lock, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { FooterNewsletter } from './FooterNewsletter';

export function Footer() {
  return (
    <footer className="relative bg-white dark:bg-[#05070c] text-slate-600 dark:text-slate-400 transition-colors duration-200">
      {/* ── Subtle Top Gradient Divider ── */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20">
        {/* ── Upper Newsletter / Community CTA Card ── */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-b from-slate-50/90 via-white to-slate-50/50 dark:from-slate-900/50 dark:via-[#090e18] dark:to-[#05070c] p-6 sm:p-12 mb-16 shadow-xl shadow-slate-200/40 dark:shadow-black/40">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl dark:bg-orange-500/15" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-500/10" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/60 text-[#FF8A00] text-xs font-mono font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WEEKLY DISPATCHES</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
                Stay ahead of the AI curve.
              </h3>
              <p className="mt-2.5 max-w-xl text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Curated benchmarks, developer breakdowns, and zero-latency tool releases delivered to your inbox every Tuesday.
              </p>
              <p className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                Join 14,000+ engineers, creators, and analysts. No spam, ever.
              </p>
            </div>

            {/* Right Form Component (Isolated Client Island) */}
            <div className="lg:col-span-5">
              <FooterNewsletter />
            </div>
          </div>
        </div>

        {/* ── 6-Column Enterprise Navigation Matrix ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-16">
          {/* Column 1-2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center">
              <BrandLogo size={32} />
            </Link>
            <p className="max-w-sm text-xs sm:text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 font-normal">
              TOOLty is your modern zero-latency utility workbench. We build high-performance online developer utilities, financial engines, and AI discovery tools — completely free, private, and browser-native.
            </p>

            {/* Status Pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>System Operational · 99.99%</span>
              </div>
            </div>
          </div>

          {/* Column 3: Utilities & Converters */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
              Utilities &amp; Converters
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link href="/tools/html-to-python-ast" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  HTML → Python AST
                </Link>
              </li>
              <li>
                <Link href="/tools/json-to-yaml" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  JSON ↔ YAML Stream
                </Link>
              </li>
              <li>
                <Link href="/tools/sql-to-schema-orm" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  SQL → Schema ORM
                </Link>
              </li>
              <li>
                <Link href="/tools/js-to-ts" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  JS → TypeScript Strict
                </Link>
              </li>
              <li>
                <Link href="/tools/css-to-html" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  CSS → HTML Scaffolder
                </Link>
              </li>
              <li>
                <Link href="/tools/base64-to-text" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Base64 ↔ Text Decoder
                </Link>
              </li>
              <li>
                <Link href="/tools/ascii-to-hex" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  ASCII ↔ Hex Converter
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Calculators & Hubs */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
              Calculators &amp; Hubs
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link href="/calculators/finance" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Financial Calculators
                </Link>
              </li>
              <li>
                <Link href="/calculators/scientific" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Scientific Engines
                </Link>
              </li>
              <li>
                <Link href="/ai-tools" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  AI Tools Directory
                </Link>
              </li>
              <li>
                <Link href="/toolkits" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Curated Toolkits
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Developer Diagnostics
                </Link>
              </li>
              <li>
                <Link href="/tools" className="font-semibold text-[#FF8A00] hover:underline flex items-center gap-1 pt-1">
                  Browse All Tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Resources & Guides */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
              Resources &amp; Guides
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link href="/blog" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Engineering Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  AI Integration Guides
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  AI News &amp; Dispatches
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Neural Terms Glossary
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  XML Sitemap
                </Link>
              </li>
              <li>
                <Link href="/api/health" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  API Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 6: Company & Governance */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
              Company &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link href="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@toolty.online"
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Contact &amp; Support
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://aiiseverythingdashboard.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition text-[11px] font-mono font-medium"
                >
                  <Lock className="w-3 h-3 text-[#FF8A00]" />
                  <span>Admin Panel</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Enterprise Bar ── */}
        <div className="border-t border-slate-200/90 dark:border-slate-800/90 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} TOOLty Inc. Engineered for maximum developer velocity.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>

          {/* Social Buttons */}
          <div className="flex items-center gap-3">
            {/* X / Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TOOLty on X (Twitter)"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TOOLty on GitHub"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TOOLty on LinkedIn"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 1 0 1.63 1.63c0-.9-.73-1.63-1.63-1.63z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
