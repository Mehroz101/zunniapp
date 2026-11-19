import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Terminal,
  Calculator,
} from 'lucide-react';
import { HeroSearchConsole } from './HeroSearchConsole';
import { AmbientHeroBackground } from './AmbientHeroBackground';
import { SantaHat } from '@/components/effects/SantaHat';
import type { LivePlatformStats } from '@/lib/data';

interface HeroProps {
  stats?: LivePlatformStats;
}

// Quick filter chips
const POPULAR_CHIPS = [
  { label: 'Code Converters', href: '/tools' },
  { label: 'SEO Diagnostics', href: '/tools?category=seo' },
  { label: 'AST Parsers', href: '/tools?category=dev' },
  { label: 'Financial Calculators', href: '/calculators/finance' },
  { label: 'Scientific Math', href: '/calculators/scientific' },
  { label: 'Regex Studio', href: '/tools/regex-tester' },
];

export function Hero({ stats: _stats }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] sm:min-h-[92vh] flex items-center justify-center bg-white dark:bg-[#05070c] pt-24 sm:pt-36 lg:pt-40 pb-16 lg:pb-24 overflow-hidden transition-colors duration-200">
      {/* 🚀 1. AMBIENT BACKGROUND INFINITE SCROLL SYSTEM (Idle-Scheduled on Desktop, 0 DOM overhead on Mobile) 🚀 */}
      <AmbientHeroBackground />

      {/* 🚀 2. CENTERED ENTERPRISE HERO CONTENT (Locked geometry with 0.000 CLS) 🚀 */}
      <div className="relative z-10 mx-auto max-w-5xl w-full px-4 sm:px-8 lg:px-12 text-center flex flex-col items-center">
        {/* Top Modern Kicker Festive Badge */}
        <div className="mb-4 sm:mb-7 inline-flex items-center gap-2 rounded-full border border-red-200 dark:border-red-900/50 bg-red-50/90 dark:bg-red-950/40 px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 shadow-xs backdrop-blur-xs min-h-[32px] max-w-[94vw] sm:max-w-none">
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="tracking-wide text-[11px] sm:text-xs truncate sm:whitespace-normal">
            🎅 Christmas &amp; Holiday Edition — Free Developer Tools &amp; Utilities ❄️
          </span>
        </div>

        {/* Primary Headline (H1) with fixed baseline & line-height to guarantee 0.000 CLS */}
        <div className="w-full max-w-4xl text-center min-h-[116px] sm:min-h-[120px] lg:min-h-[144px]">
          <h1 className="text-[28px] xs:text-[30px] sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.2] sm:leading-[1.12] text-slate-950 dark:text-white">
            Best Way to Find the Right{' '}
            <span className="relative inline-block">
              {/* Santa Hat perched on the headline */}
              <span className="pointer-events-none absolute -left-3.5 -top-5 sm:-top-7 sm:-left-4 z-20 -rotate-12 transition-transform hover:scale-110">
                <SantaHat className="h-8 w-8 sm:h-11 sm:w-11 drop-shadow-md" />
              </span>
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
                AI Tools &amp; Utilities
              </span>
            </span>
          </h1>
        </div>

        {/* Value Proposition Sub-Headline with static text flow */}
        <div className="w-full max-w-3xl text-center min-h-[88px] sm:min-h-[64px] mt-3 sm:mt-6">
          <p className="text-xs sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            TOOLty is the premier free online directory and utility workbench helping developers, professionals, and creators explore, calculate, and convert with 100% free online tools, converters, and financial calculators.
          </p>
        </div>

        {/* Global Search Console Container (Modular Client Component Island) */}
        <HeroSearchConsole />

        {/* Quick Filter Chips with single-row scroll on mobile to eliminate wrapping shifts */}
        <div className="mt-5 flex items-center gap-1.5 sm:gap-2 text-xs overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap sm:justify-center min-h-[38px] max-w-full px-2 py-0.5">
          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono mr-1 shrink-0">
            Popular:
          </span>
          {POPULAR_CHIPS.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className="rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 px-2.5 sm:px-3 py-1 text-slate-700 dark:text-slate-300 transition hover:border-orange-500/50 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 shadow-2xs font-medium text-[11px] sm:text-xs min-h-[28px] inline-flex items-center shrink-0"
            >
              {chip.label}
            </Link>
          ))}
        </div>

        {/* Dual Primary Call-to-Actions with explicit mobile min-height to prevent shift */}
        <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 min-h-[104px] sm:min-h-[48px] w-full max-w-sm sm:max-w-none">
          <Link
            href="/tools"
            className="w-full sm:w-auto rounded-full bg-[#FF8A00] hover:bg-[#ff9e2e] text-slate-950 px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(255,138,0,0.3)] transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
          >
            <Zap className="h-4 w-4 fill-slate-950 text-slate-950 shrink-0" />
            <span>Explore All 50+ Tools</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>

          <Link
            href="/calculators/finance"
            className="w-full sm:w-auto rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-xs transition active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Calculator className="h-4 w-4 text-[#FF8A00] shrink-0" />
            <span>19+ Universal Calculators</span>
          </Link>
        </div>

        {/* Live Directory Metrics Badges with explicit min-height */}
        <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-3.5 sm:gap-10 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium min-h-[28px] sm:min-h-[24px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
            <span>Instant Execution</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FF8A00] shrink-0" />
            <span>No Signup Required</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Terminal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500 shrink-0" />
            <span>Production Precision</span>
          </div>
        </div>
      </div>
    </section>
  );
}
