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
  Cpu,
  FileCode,
  Shield,
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
  'SEO Diagnostics',
  'Schema Builders',
  'AST Transpilers',
  'MCP Servers',
];

// Popular quick filter chips as specified
const POPULAR_CHIPS = [
  { label: 'Code Converters', query: 'converter', slug: 'coding' },
  { label: 'SEO Diagnostics', query: 'seo', slug: 'seo' },
  { label: 'AST Parsers', query: 'ast', slug: 'coding' },
  { label: 'JSON Tools', query: 'json', slug: 'coding' },
  { label: 'Schema Builders', query: 'schema', slug: 'seo' },
  { label: 'Regex Engines', query: 'regex', slug: 'coding' },
];

// Ambient mock social proof cards for background directory atmosphere
const AMBIENT_CARDS = [
  { name: 'JSON → TypeScript', cat: 'Developer Utilities', rating: '4.9', runs: '18.4k', icon: Code2, color: 'text-indigo-500' },
  { name: 'Robots.txt Validator', cat: 'SEO Diagnostics', rating: '4.8', runs: '24.1k', icon: Shield, color: 'text-amber-500' },
  { name: 'Schema Markup Builder', cat: 'SEO Diagnostics', rating: '4.9', runs: '15.2k', icon: Layers, color: 'text-cyan-500' },
  { name: 'CSS → Tailwind Engine', cat: 'Code Transpiler', rating: '4.7', runs: '11.8k', icon: Terminal, color: 'text-emerald-500' },
  { name: 'JWT Claims Inspector', cat: 'Security Tools', rating: '4.9', runs: '32.6k', icon: Zap, color: 'text-purple-500' },
  { name: 'Regex Match Evaluator', cat: 'Developer Utilities', rating: '4.8', runs: '21.0k', icon: FileCode, color: 'text-rose-500' },
  { name: 'Cron Schedule Parser', cat: 'DevOps Tools', rating: '4.9', runs: '14.5k', icon: Cpu, color: 'text-blue-500' },
  { name: 'Flesch-Kincaid Engine', cat: 'Content & Text', rating: '4.8', runs: '19.3k', icon: Sparkles, color: 'text-violet-500' },
];

export function Hero({ stats }: HeroProps) {
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
    <section className="relative min-h-[88vh] flex items-center justify-center bg-white dark:bg-[#05070c] pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-24 overflow-hidden transition-colors duration-200">
      {/* ── Ambient Matrix of Directory Cards (Visual Depth & Rich Social Proof) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none opacity-40 dark:opacity-25"
      >
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 transform -skew-y-3 scale-105 filter blur-[1px]">
          {AMBIENT_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 p-4 shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {card.cat}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 text-[11px] font-bold">
                    <Star className="h-3 w-3 fill-amber-400" /> {card.rating}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 my-3">
                  <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs ${card.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                    {card.name}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {card.runs} monthly compilations
                </div>
              </div>
            );
          })}
        </div>

        {/* Soft Radial Vignette Mask so the Center Typography is Clean & Sharp */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/85 to-white dark:from-[#05070c] dark:via-[#05070c]/85 dark:to-[#05070c]" />
      </div>

      {/* ── Centered Enterprise Hero Content ── */}
      <div className="relative z-10 mx-auto max-w-5xl w-full px-6 sm:px-8 lg:px-12 text-center flex flex-col items-center">
        {/* 1. Top Modern Kicker Badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-md transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="tracking-wide">
            ⚡ The Ultimate Directory for Modern Developers & Builders
          </span>
        </div>

        {/* 2. Primary Headline (H1) with High-Impact Dual-Tone & Dynamic Typing */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1] max-w-4xl">
          Best Way to Find the Right{' '}
          <span className="inline-block mt-1 sm:mt-0">
            <span
              className={`bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 bg-clip-text text-transparent transition-opacity duration-200 ${
                fadeState === 'in' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {ROTATING_NICHES[nicheIndex]}
            </span>
            <span className="inline-block w-[3px] h-9 sm:h-12 ml-1 bg-amber-500 animate-pulse align-middle" />
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
                ? 'border-amber-500/80 dark:border-amber-400/80 ring-4 ring-amber-500/10 dark:ring-amber-400/10 bg-white dark:bg-slate-900 shadow-amber-500/10'
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
              placeholder="Search 500+ AI tools, code converters, SEO diagnostics..."
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
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold">
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
            <span className="text-slate-400 dark:text-slate-500 font-medium">Popular:</span>
            {POPULAR_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setSearchQuery(chip.query);
                  searchInputRef.current?.focus();
                }}
                className="rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-1 font-medium text-slate-700 dark:text-slate-300 hover:border-amber-500/60 dark:hover:border-amber-400/60 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6. High-Conversion Tip & Verification Strip (Matching AIChief Aesthetic) */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>TIP: Filter as you type, or press <kbd className="font-mono">⌘K</kbd> anywhere</span>
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all duration-200 active:scale-[0.98]"
          >
            <span>Browse 500+ Tools</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/ai-tools"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 px-7 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-xs transition-all duration-200 active:scale-[0.98]"
          >
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            <span>Explore Workbenches</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
