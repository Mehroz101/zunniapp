'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Command,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Receipt,
  Target,
  PiggyBank,
  Briefcase,
  Home,
  Hammer,
  Activity,
  Dumbbell,
  GraduationCap,
  Box,
  Percent,
  BarChart2,
  Atom,
  Zap,
  FlaskConical,
  Car,
  Sprout,
  Calculator,
  SlidersHorizontal,
} from 'lucide-react';
import { getAllCalculators, type CalculatorDefinition, type CalculatorCategory } from '@/lib/config/calculators';

// Icon map for dynamically rendering Lucide icons
const ICON_MAP: Record<string, React.ElementType> = {
  DollarSign,
  TrendingUp,
  Receipt,
  Target,
  PiggyBank,
  Briefcase,
  Home,
  Hammer,
  Activity,
  Dumbbell,
  GraduationCap,
  Box,
  Percent,
  BarChart2,
  Atom,
  Zap,
  FlaskConical,
  Car,
  Sprout,
};

interface CalculatorsDirectoryViewProps {
  calculators?: CalculatorDefinition[];
  initialCategory?: 'all' | CalculatorCategory;
  badgeText?: string;
  headingTitle?: string;
  headingAccent?: string;
  headingSubtitle?: string;
}

export function CalculatorsDirectoryView({
  calculators: propCalculators,
  initialCategory = 'all',
  badgeText = 'UNIVERSAL 19+ CALCULATION SUITE',
  headingTitle = 'Precision Calculators for',
  headingAccent = 'Finance & Science',
  headingSubtitle = 'Explore our collection of 19 high-precision financial, mathematical, engineering, and scientific calculation engines. Zero telemetry logging, 100% free and client-side.',
}: CalculatorsDirectoryViewProps = {}) {
  const calculators = useMemo(() => propCalculators || getAllCalculators(), [propCalculators]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'all' | CalculatorCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered calculators based on tab and debounced query
  const filteredCalculators = useMemo(() => {
    let list = calculators;
    if (activeTab !== 'all') {
      list = list.filter((c) => c.category === activeTab);
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;

    return list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.categoryLabel.toLowerCase().includes(q) ||
        c.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [calculators, activeTab, searchQuery]);

  // Counts
  const totalCount = calculators.length;
  const financialCount = calculators.filter((c) => c.category === 'financial').length;
  const specializedCount = calculators.filter((c) => c.category === 'specialized').length;

  return (
    <div className="w-full">
      {/* ── Directory Header / Kicker & Search ── */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-md">
          <Calculator className="h-3.5 w-3.5 text-[#00D2FF]" />
          <span>{badgeText}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
          {headingTitle}{' '}
          <span className="bg-gradient-to-r from-[#00D2FF] via-cyan-400 to-sky-400 dark:from-[#00D2FF] dark:via-cyan-400 dark:to-sky-500 bg-clip-text text-transparent">
            {headingAccent}
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {headingSubtitle}
        </p>

        {/* Global Instant Search Bar */}
        <div className="mt-8 relative max-w-xl mx-auto">
          <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md transition-all focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10">
            <div className="pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search className="h-5 w-5" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 19 calculators (e.g. loan, bmr, investment, dilution)..."
              className="w-full py-3.5 pl-3 pr-20 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-transparent outline-none focus:ring-0"
            />

            <div className="absolute right-3 flex items-center gap-1.5">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <Command className="h-3 w-3" />
                <span>K</span>
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* ── Segmented Pill Filter Tabs ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span>All Calculators</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
            activeTab === 'all'
              ? 'bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('financial')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'financial'
              ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          <span>Financial & Commercial</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
            activeTab === 'financial'
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            {financialCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('specialized')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'specialized'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Atom className="h-4 w-4" />
          <span>Scientific & Specialized</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
            activeTab === 'specialized'
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            {specializedCount}
          </span>
        </button>
      </div>

      {/* ── Active Result Count Indicator ── */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <span>Showing {filteredCalculators.length} of {totalCount} tools</span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-amber-600 dark:text-amber-400 hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* ── 19 Calculators Responsive Grid ── */}
      {filteredCalculators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCalculators.map((calc) => {
            const Icon = ICON_MAP[calc.icon] || Calculator;
            const isFinancial = calc.category === 'financial';

            return (
              <Link
                key={calc.slug}
                href={`/calculators/${calc.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-xs hover:shadow-xl hover:border-amber-500/50 dark:hover:border-amber-400/50 transition-all duration-200 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                      isFinancial
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white'
                        : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {calc.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {calc.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {calc.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {calc.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    <span>Launch</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <Calculator className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">No calculators found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            No tools matched &quot;{searchQuery}&quot;. Try adjusting your keywords or category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveTab('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
