'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  Sparkles,
  Command,
  Zap,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  Terminal,
  Code2,
  Binary,
  FileText,
  Boxes,
  Database,
  ShieldCheck,
  Calculator,
  TrendingUp,
  Key,
  FileCode,
  Layers,
} from 'lucide-react';
import { getAllTools } from '@/lib/tools/registry';
import type { ToolDefinition } from '@/lib/tools/types';
import type { LivePlatformStats } from '@/lib/data';

interface HeroProps {
  stats?: LivePlatformStats;
}

// Dynamic rotating niches matching the enterprise directory aesthetic
const ROTATING_NICHES = [
  'AI & Developer Tools',
  'Code Converters',
  'Financial Calculators',
  'SEO Diagnostics',
  'AST Transpilers',
  'Developer Utilities',
];

// Quick filter chips as specified in system directive
const POPULAR_CHIPS = [
  { label: 'Code Converters', query: 'converter', href: '/tools' },
  { label: 'SEO Diagnostics', query: 'seo', href: '/tools?category=seo' },
  { label: 'AST Parsers', query: 'ast', href: '/tools?category=dev' },
  { label: 'Financial Calculators', query: 'calculator', href: '/calculators?category=financial' },
  { label: 'Regex', query: 'regex', href: '/tools/regex-tester' },
];

// 12 Native Platform Tools for Ambient Tool Wall Grid
const CATALOG_WALL_CARDS = [
  {
    name: 'JSON ➔ YAML',
    cat: 'Code Converter',
    badge: 'STABLE',
    rating: '4.9',
    runs: '28.4k',
    icon: FileText,
    color: 'text-[#00D2FF]',
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/10',
  },
  {
    name: 'HTML ➔ Python AST',
    cat: 'AST Transpiler',
    badge: 'v2.4',
    rating: '4.8',
    runs: '16.2k',
    icon: Binary,
    color: 'text-sky-500 dark:text-sky-400',
    bg: 'bg-sky-500/10 dark:bg-sky-500/10',
  },
  {
    name: 'CSS ➔ HTML',
    cat: 'Code Scaffolder',
    badge: 'FAST',
    rating: '4.9',
    runs: '34.1k',
    icon: Code2,
    color: 'text-indigo-500 dark:text-indigo-400',
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/10',
  },
  {
    name: 'SVG ➔ JSX',
    cat: 'React Engine',
    badge: 'POPULAR',
    rating: '4.9',
    runs: '42.8k',
    icon: Boxes,
    color: 'text-[#00D2FF]',
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/10',
  },
  {
    name: 'SQL ➔ Prisma',
    cat: 'ORM Generator',
    badge: 'PRO',
    rating: '4.8',
    runs: '19.7k',
    icon: Database,
    color: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-500/10 dark:bg-blue-500/10',
  },
  {
    name: 'Robots.txt Validator',
    cat: 'SEO Diagnostic',
    badge: 'VERIFIED',
    rating: '4.9',
    runs: '51.3k',
    icon: ShieldCheck,
    color: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/10',
  },
  {
    name: 'Loan Calculator',
    cat: 'Financial Engine',
    badge: 'ACCURATE',
    rating: '4.9',
    runs: '63.0k',
    icon: Calculator,
    color: 'text-[#00D2FF]',
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/10',
  },
  {
    name: 'Investment Calculator',
    cat: 'Compound ROI',
    badge: 'LIVE',
    rating: '4.8',
    runs: '39.5k',
    icon: TrendingUp,
    color: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/10',
  },
  {
    name: 'Regex Tester',
    cat: 'Developer Utility',
    badge: 'FAST',
    rating: '4.9',
    runs: '47.1k',
    icon: Terminal,
    color: 'text-purple-500 dark:text-purple-400',
    bg: 'bg-purple-500/10 dark:bg-purple-500/10',
  },
  {
    name: 'JWT Inspector',
    cat: 'Security Diagnostic',
    badge: 'CLIENT-SIDE',
    rating: '4.9',
    runs: '38.2k',
    icon: Key,
    color: 'text-sky-500 dark:text-sky-400',
    bg: 'bg-sky-500/10 dark:bg-sky-500/10',
  },
  {
    name: 'Base64 Studio',
    cat: 'Transcoder',
    badge: 'WASM',
    rating: '4.8',
    runs: '29.4k',
    icon: FileCode,
    color: 'text-indigo-500 dark:text-indigo-400',
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/10',
  },
  {
    name: 'XML ➔ JSON',
    cat: 'Data Parser',
    badge: 'INSTANT',
    rating: '4.7',
    runs: '22.6k',
    icon: Layers,
    color: 'text-[#00D2FF]',
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/10',
  },
];

export function Hero({ stats: _stats }: HeroProps) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Rotating keyword index
  const [nicheIndex, setNicheIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  // Search input and state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Tools registry cache for instant autocomplete
  const allTools = useMemo<ToolDefinition[]>(() => {
    try {
      return getAllTools();
    } catch {
      return [];
    }
  }, []);

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allTools
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q) ||
          t.categoryName.toLowerCase().includes(q) ||
          t.seoKeywords.some((k) => k.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [searchQuery, allTools]);

  // Rotate headline niche every 3 seconds with smooth fade
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setNicheIndex((prev) => (prev + 1) % ROTATING_NICHES.length);
        setFadeState('in');
      }, 250);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Search Submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (filteredTools.length > 0 && selectedIndex >= 0 && selectedIndex < filteredTools.length) {
      router.push(`/tools/${filteredTools[selectedIndex].slug}`);
      setIsFocused(false);
      return;
    }
    if (filteredTools.length > 0) {
      router.push(`/tools/${filteredTools[0].slug}`);
      setIsFocused(false);
      return;
    }
    if (searchQuery.trim()) {
      router.push(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsFocused(false);
    } else {
      router.push('/tools');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-white dark:bg-[#05070c] pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-24 overflow-hidden transition-colors duration-200">
      {/* ── Ambient Tool Wall Background (Multi-Column Staggered Grid) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      >
        {/* Multi-column grid across background */}
        <div className="absolute -inset-x-8 -top-12 bottom-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5 sm:gap-4 p-4 transform -skew-y-2 scale-[1.03] opacity-25 dark:opacity-20 blur-[0.5px]">
          {CATALOG_WALL_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.name}
                className={`rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-3.5 sm:p-4 shadow-xs flex flex-col justify-between transition-transform ${
                  idx % 2 === 1 ? 'translate-y-4 sm:translate-y-6' : ''
                }`}
              >
                <div className="flex items-center justify-between text-xs gap-1.5">
                  <span className="font-mono text-[9.5px] text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                    {card.cat}
                  </span>
                  <span className="shrink-0 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {card.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 my-3">
                  <div className={`p-2 rounded-xl ${card.bg} ${card.color} shadow-xs shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate block">
                      {card.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {card.runs} runs/mo
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{card.rating}</span>
                  </span>
                  <span className="font-mono text-[9px] text-[#00D2FF]">Client WASM</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Radial Mask with opacity falloff ensuring 100% legibility */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#ffffff_75%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_20%,#05070c_75%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white dark:from-[#05070c]/70 dark:via-transparent dark:to-[#05070c]" />
      </div>

      {/* ── Centered Enterprise Hero Content ── */}
      <div className="relative z-10 mx-auto max-w-5xl w-full px-6 sm:px-8 lg:px-12 text-center flex flex-col items-center">
        {/* 1. Top Modern Kicker Badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-md transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <span className="flex h-2 w-2 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF] animate-pulse" />
          <span className="tracking-wide">
            ⚡ The Ultimate Directory for Modern Developers & Builders
          </span>
        </div>

        {/* 2. Primary Headline (H1) with Signature Electric-Cyan Accent */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1] max-w-4xl">
          Best Way to Find the Right{' '}
          <span className="inline-block mt-1 sm:mt-0">
            <span
              className={`bg-gradient-to-r from-[#00D2FF] via-cyan-400 to-sky-400 bg-clip-text text-transparent transition-opacity duration-200 ${
                fadeState === 'in' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {ROTATING_NICHES[nicheIndex]}
            </span>
            <span className="inline-block w-[3px] h-9 sm:h-12 ml-1 bg-[#00D2FF] animate-pulse align-middle" />
          </span>
        </h1>

        {/* 3. Authoritative Value Proposition Sub-Headline */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl font-normal leading-relaxed">
          AiTools Studio is the premier discovery directory and utility workbench helping developers, engineers, and creators explore, test, and adopt production-ready AI tools, code compilers, and developer utilities.
        </p>

        {/* 4. Advanced Global Search Console Container */}
        <div className="mt-9 w-full max-w-2xl mx-auto relative z-30">
          <form
            onSubmit={handleSearchSubmit}
            className={`relative flex items-center rounded-2xl border transition-all duration-200 shadow-lg ${
              isFocused
                ? 'border-cyan-500/80 dark:border-[#00D2FF]/80 ring-4 ring-cyan-500/10 dark:ring-[#00D2FF]/10 bg-white dark:bg-slate-900 shadow-cyan-500/10'
                : 'border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-slate-200/50 dark:shadow-black/40'
            }`}
          >
            <div className="pl-4 sm:pl-5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search className="h-5 w-5" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setSelectedIndex((prev) => Math.min(prev + 1, filteredTools.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setSelectedIndex((prev) => Math.max(prev - 1, -1));
                }
              }}
              placeholder="I need a tool to convert CSS, parse AST, calculate finance..."
              className="w-full py-4 pl-3.5 pr-28 text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-transparent outline-none focus:ring-0"
            />

            <div className="absolute right-3 flex items-center gap-2">
              <Link
                href="/tools"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <SlidersHorizontal className="h-3 w-3" />
                <span>Filters</span>
              </Link>
              <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 shadow-2xs">
                <Command className="h-3 w-3" />
                <span>K</span>
              </kbd>
            </div>
          </form>

          {/* Autocomplete Dropdown Panel */}
          {isFocused && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 z-50 text-left overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {filteredTools.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 flex justify-between">
                    <span>Matching Diagnostic Engines</span>
                    <span>{filteredTools.length} found</span>
                  </div>
                  {filteredTools.map((tool, idx) => (
                    <button
                      key={tool.slug}
                      type="button"
                      onMouseDown={() => {
                        router.push(`/tools/${tool.slug}`);
                        setIsFocused(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition ${
                        selectedIndex === idx
                          ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-950 dark:text-[#00D2FF]'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-[#00D2FF] font-mono text-xs font-bold">
                          &gt;_
                        </div>
                        <div>
                          <div className="font-semibold text-xs sm:text-sm text-slate-950 dark:text-white">
                            {tool.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-sm sm:max-w-md">
                            {tool.tagline}
                          </div>
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {tool.categoryName}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  No exact engine match for &quot;{searchQuery}&quot;. Press Enter to browse directory.
                </div>
              )}
            </div>
          )}

          {/* 5. Trending / Quick-Filter Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Quick Filters:</span>
            {POPULAR_CHIPS.map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className="rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-1 font-medium text-slate-700 dark:text-slate-300 hover:border-cyan-500/60 dark:hover:border-[#00D2FF]/60 hover:text-cyan-600 dark:hover:text-[#00D2FF] hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 6. High-Conversion Tip & Verification Strip */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200/60 dark:border-cyan-800/40 text-cyan-900 dark:text-cyan-300 px-3.5 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-[#00D2FF]" />
            <span>TIP: Filter as you type, or press <kbd className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-cyan-200 dark:border-cyan-800 text-[10px]">⌘K</kbd> anywhere</span>
          </div>
        </div>

        {/* 7. Trust Checkpoints Row */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>100% Client-Side WASM</span>
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Zero Telemetry Retention</span>
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>26 Production Compilers</span>
          </span>
        </div>

        {/* 8. Primary Directory CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/tools"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00D2FF] hover:bg-[#38bdf8] text-slate-950 font-bold px-8 py-3.5 text-sm shadow-[0_0_20px_rgba(0,210,255,0.25)] transition-all duration-200 active:scale-[0.98]"
          >
            <span>Browse 500+ Tools</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/calculators"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 px-7 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-xs transition-all duration-200 active:scale-[0.98]"
          >
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            <span>Explore Workbenches</span>
          </Link>
        </div>

        {/* ── 9. Realistic Developer Social Proof Ribbon ── */}
        <div className="mt-14 pt-10 border-t border-slate-200/80 dark:border-slate-800/80 w-full max-w-4xl flex flex-col items-center">
          <p className="text-[11px] font-mono font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-6">
            TRUSTED &amp; USED BY BUILDERS FROM
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-500 dark:text-slate-400">
            {/* Product Hunt */}
            <div className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm1.2 13.8H9.6v3.6H7.2V6.6h5.88c2.4 0 4.08 1.56 4.08 3.6 0 2.04-1.68 3.6-3.96 3.6zm-.24-4.8H9.6v2.4h2.16c1.08 0 1.8-.72 1.8-1.2 0-.48-.72-1.2-1.8-1.2z" />
              </svg>
              <span className="text-xs font-semibold tracking-tight">Product Hunt</span>
            </div>

            {/* Indie Hackers */}
            <div className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0V0zm3.6 4.8h3.6v14.4H3.6V4.8zm6 0h3.6v6h4.8v-6h3.6v14.4H18v-6h-4.8v6H9.6V4.8z" />
              </svg>
              <span className="text-xs font-semibold tracking-tight">Indie Hackers</span>
            </div>

            {/* GitHub Trending */}
            <div className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="text-xs font-semibold tracking-tight">GitHub Trending</span>
            </div>

            {/* Dev.to */}
            <div className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M7.42 10.05c-.18-.1-.44-.16-.76-.16h-.99v4.22h.98c.34 0 .61-.06.79-.17.19-.12.33-.29.41-.53.08-.24.12-.57.12-.98 0-.42-.04-.76-.12-1-.07-.24-.22-.41-.43-.53v.15zm8.56 0c-.23-.11-.53-.16-.91-.16h-.97v4.22h.96c.39 0 .69-.05.92-.16.23-.11.39-.28.48-.52.09-.23.14-.56.14-.98 0-.42-.05-.75-.14-.99-.09-.23-.25-.4-.48-.51v.1zm6.02-8.05H2c-.55 0-1 .45-1 1v18c0 .55.45 1 1 1h20c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-13.4 13.91H6.18V8.09h2.42c.86 0 1.54.14 2.05.42.5.28.87.69 1.1 1.24.23.54.34 1.21.34 2 0 .8-.11 1.48-.34 2.03-.23.55-.6 1-.1.1.28-.51.57-1.19.86-2.05.86zm6.36 0h-2.18V8.09h2.18v7.82zm5.42 0h-2.42V8.09h2.42c.86 0 1.54.14 2.05.42.5.28.87.69 1.1 1.24.23.54.34 1.21.34 2 0 .8-.11 1.48-.34 2.03-.23.55-.6.96-1.1 1.24-.51.28-1.19.42-2.05.42z" />
              </svg>
              <span className="text-xs font-semibold tracking-tight">Dev.to</span>
            </div>

            {/* Hacker News */}
            <div className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0V0zm12.3 12.8L16.4 5h-2.4l-2.6 5.4L8.8 5H6.4l4.1 7.8V19h1.8v-6.2z" />
              </svg>
              <span className="text-xs font-semibold tracking-tight">Hacker News</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
