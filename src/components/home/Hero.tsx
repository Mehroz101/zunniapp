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
  Car,
  Home,
  Briefcase,
  Receipt,
  Globe,
  Atom,
  Box,
  FlaskConical,
  Activity,
  Clock,
  Dumbbell,
  BarChart2,
  PiggyBank,
  Percent,
  DollarSign,
} from 'lucide-react';
import { getAllTools } from '@/lib/tools/registry';
import type { ToolDefinition } from '@/lib/tools/types';
import type { LivePlatformStats } from '@/lib/data';

interface HeroProps {
  stats?: LivePlatformStats;
}

// Quick filter chips as specified in system directive
const POPULAR_CHIPS = [
  { label: 'Code Converters', query: 'converter', href: '/tools' },
  { label: 'SEO Diagnostics', query: 'seo', href: '/tools?category=seo' },
  { label: 'AST Parsers', query: 'ast', href: '/tools?category=dev' },
  { label: 'Financial Calculators', query: 'calculator', href: '/calculators/finance' },
  { label: 'Scientific Math', query: 'math', href: '/calculators/scientific' },
  { label: 'Regex Studio', query: 'regex', href: '/tools/regex-tester' },
];

/* ==============================================================================
   7 DISTINCT SKELETON CARD CATALOGS FOR AMBIENT INFINITE SCROLL COLUMNS (AI CHIEF STYLE)
   ============================================================================== */
interface AmbientCard {
  name: string;
  cat: string;
  badge: string;
  runs: string;
  rating: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const AMBIENT_COLUMNS: { duration: number; cards: AmbientCard[] }[] = [
  // Column 1 (Odd: Scrolls UPWARDS - 72s cycle) - Code Compilers & AST
  {
    duration: 72,
    cards: [
      { name: 'JSON ➔ YAML Stream', cat: 'Converter', badge: 'STABLE', runs: '28.4k', rating: '4.9', icon: FileText, color: 'text-[#00D2FF]', bg: 'bg-cyan-500/10' },
      { name: 'HTML ➔ Python AST', cat: 'Scraper', badge: 'v2.4', runs: '16.2k', rating: '4.8', icon: Binary, color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-500/10' },
      { name: 'CSS ➔ HTML Scaffolder', cat: 'Scaffolder', badge: 'FAST', runs: '34.1k', rating: '4.9', icon: Code2, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-500/10' },
      { name: 'SVG ➔ JSX React', cat: 'React', badge: 'POPULAR', runs: '42.8k', rating: '4.9', icon: Boxes, color: 'text-[#00D2FF]', bg: 'bg-cyan-500/10' },
      { name: 'JS ➔ TypeScript Strict', cat: 'Typing', badge: 'STRICT', runs: '31.5k', rating: '4.9', icon: Terminal, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10' },
      { name: 'SQL ➔ Prisma Schema', cat: 'ORM', badge: 'PRO', runs: '19.7k', rating: '4.8', icon: Database, color: 'text-violet-500 dark:text-violet-400', bg: 'bg-violet-500/10' },
    ],
  },
  // Column 2 (Even: Scrolls DOWNWARDS - 84s cycle) - Financial Engines
  {
    duration: 84,
    cards: [
      { name: 'Auto Loan Trade-In', cat: 'Finance', badge: 'HOT', runs: '74.2k', rating: '4.9', icon: Car, color: 'text-[#00D2FF]', bg: 'bg-cyan-500/10' },
      { name: 'Compound Interest ROI', cat: 'Wealth', badge: 'LIVE', runs: '39.5k', rating: '4.8', icon: TrendingUp, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
      { name: 'Loan EMI Amortization', cat: 'Lending', badge: 'ACCURATE', runs: '63.0k', rating: '4.9', icon: Calculator, color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-500/10' },
      { name: 'Mortgage Refinance', cat: 'Real Estate', badge: '30-YR', runs: '27.9k', rating: '4.9', icon: Home, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'Business Margin & Markup', cat: 'Enterprise', badge: 'B2B', runs: '21.4k', rating: '4.7', icon: Briefcase, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-500/10' },
      { name: 'Federal Tax Bracket', cat: 'IRS 2026', badge: 'TAX', runs: '45.1k', rating: '4.9', icon: Receipt, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-500/10' },
    ],
  },
  // Column 3 (Odd: Scrolls UPWARDS - 66s cycle) - SEO & Crawl Diagnostics
  {
    duration: 66,
    cards: [
      { name: 'Robots.txt Validator', cat: 'SEO', badge: 'VERIFIED', runs: '51.3k', rating: '4.9', icon: ShieldCheck, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
      { name: 'OpenGraph Meta Tag', cat: 'Social', badge: 'INSTANT', runs: '33.2k', rating: '4.8', icon: Globe, color: 'text-[#00D2FF]', bg: 'bg-cyan-500/10' },
      { name: 'XML Sitemap Auditor', cat: 'Crawl', badge: 'FAST', runs: '29.7k', rating: '4.9', icon: Layers, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-500/10' },
      { name: 'JSON-LD Schema Builder', cat: 'Rich Snippet', badge: 'SEO', runs: '36.8k', rating: '4.9', icon: Code2, color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-500/10' },
      { name: 'SERP Title Simulator', cat: 'CTR Tool', badge: 'PIXEL', runs: '18.4k', rating: '4.7', icon: Search, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'Headings Hierarchy H1-H6', cat: 'Audit', badge: 'CLEAN', runs: '22.1k', rating: '4.8', icon: FileText, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10' },
    ],
  },
  // Column 4 (Even: Scrolls DOWNWARDS - 90s cycle) - Scientific & Physics
  {
    duration: 90,
    cards: [
      { name: 'Scientific Notation', cat: 'Math', badge: 'FLOAT', runs: '19.4k', rating: '4.8', icon: Atom, color: 'text-[#00D2FF]', bg: 'bg-cyan-500/10' },
      { name: 'Projectile Kinematics', cat: 'Physics', badge: '2D/3D', runs: '15.6k', rating: '4.9', icon: Zap, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: "Ohm's Law & Resistance", cat: 'Electronics', badge: 'DC/AC', runs: '24.8k', rating: '4.8', icon: SlidersHorizontal, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
      { name: 'Cylinder & 3D Geometry', cat: 'Geometry', badge: 'CALC', runs: '17.2k', rating: '4.7', icon: Box, color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-500/10' },
      { name: 'Chemical Molar Mass', cat: 'Chemistry', badge: 'P-TABLE', runs: '14.3k', rating: '4.9', icon: FlaskConical, color: 'text-violet-500 dark:text-violet-400', bg: 'bg-violet-500/10' },
      { name: 'Velocity SI Unit Transcoder', cat: 'Units', badge: 'SI', runs: '20.5k', rating: '4.8', icon: Activity, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-500/10' },
    ],
  },
  // Column 5 (Odd: Scrolls UPWARDS - 76s cycle) - Security & Utilities
  {
    duration: 76,
    cards: [
      { name: 'JWT Secret Inspector', cat: 'Security', badge: 'CLIENT', runs: '38.2k', rating: '4.9', icon: Key, color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-500/10' },
      { name: 'Regex Pattern Tester', cat: 'Developer', badge: 'PCRE', runs: '47.1k', rating: '4.9', icon: Terminal, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-500/10' },
      { name: 'Base64 Studio WASM', cat: 'Transcoder', badge: 'WASM', runs: '29.4k', rating: '4.8', icon: FileCode, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-500/10' },
      { name: 'UUID v4 Generator', cat: 'Generator', badge: 'RFC4122', runs: '56.3k', rating: '4.9', icon: Binary, color: 'text-[#00D2FF]', bg: 'bg-cyan-500/10' },
      { name: 'SHA-256 Hash Digest', cat: 'Crypto', badge: 'ZERO-LOG', runs: '31.1k', rating: '4.9', icon: ShieldCheck, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
      { name: 'Cron Schedule Parser', cat: 'Unix', badge: 'POSIX', runs: '26.8k', rating: '4.8', icon: Clock, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
    ],
  },
  // Column 6 (Even: Scrolls DOWNWARDS - 82s cycle) - Health & Business
  {
    duration: 82,
    cards: [
      { name: 'BMI Health Calculator', cat: 'Health', badge: 'WHO STD', runs: '48.9k', rating: '4.9', icon: Dumbbell, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-500/10' },
      { name: 'Daily TDEE Calorie Calc', cat: 'Nutrition', badge: 'KCAL', runs: '35.4k', rating: '4.8', icon: Activity, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'Break-Even Sales Analyzer', cat: 'Business', badge: 'MARGIN', runs: '18.7k', rating: '4.7', icon: BarChart2, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
      { name: 'High-Yield APY Savings', cat: 'Banking', badge: 'COMPOUND', runs: '29.1k', rating: '4.9', icon: PiggyBank, color: 'text-[#00D2FF]', bg: 'bg-cyan-500/10' },
      { name: 'Inflation Purchasing Power', cat: 'Macro', badge: 'CPI', runs: '22.3k', rating: '4.8', icon: Percent, color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-500/10' },
      { name: 'Discount & Sale Savings', cat: 'Retail', badge: 'OFF', runs: '19.8k', rating: '4.7', icon: DollarSign, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-500/10' },
    ],
  },
  // Column 7 (Odd: Scrolls UPWARDS - 74s cycle) - AI Toolkits & Web Utilities
  {
    duration: 74,
    cards: [
      { name: 'AI Text Summarizer', cat: 'NLP', badge: 'AI', runs: '52.1k', rating: '4.9', icon: Sparkles, color: 'text-[#00D2FF]', bg: 'bg-cyan-500/10' },
      { name: 'Markdown to HTML Live', cat: 'Markup', badge: 'FAST', runs: '33.8k', rating: '4.8', icon: FileText, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-500/10' },
      { name: 'CSS Flexbox Generator', cat: 'Layout', badge: 'VISUAL', runs: '41.2k', rating: '4.9', icon: Layers, color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-500/10' },
      { name: 'Color Palette & Contrast', cat: 'Design', badge: 'WCAG', runs: '27.6k', rating: '4.8', icon: Activity, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
      { name: 'Timestamp Epoch Tool', cat: 'Time', badge: 'UNIX', runs: '38.9k', rating: '4.9', icon: Clock, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'URL Slug & URI Encoder', cat: 'SEO', badge: 'CLEAN', runs: '24.5k', rating: '4.7', icon: Globe, color: 'text-violet-500 dark:text-violet-400', bg: 'bg-violet-500/10' },
    ],
  },
];

/* Single ambient tool card matching AI Chief's clean aesthetic */
function AmbientToolCardItem({ card }: { card: AmbientCard }) {
  const Icon = card.icon;
  return (
    <div className="w-full h-[62px] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0c1220]/90 p-2.5 shadow-xs flex items-center justify-between gap-2.5 mb-3 backdrop-blur-xs transition-colors hover:border-slate-300 dark:hover:border-slate-700">
      {/* Left Icon */}
      <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0 shadow-2xs`}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Center Details */}
      <div className="min-w-0 flex-1">
        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate block">
          {card.name}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate block mt-0.5">
          {card.cat} · <span className="font-mono">{card.runs} runs/mo</span>
        </span>
      </div>

      {/* Right Badge / Rating */}
      <div className="shrink-0 flex items-center gap-1 text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
        <span>{card.rating}</span>
      </div>
    </div>
  );
}

export function Hero({ stats: _stats }: HeroProps) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    <section className="relative min-h-[92vh] flex items-center justify-center bg-white dark:bg-[#05070c] pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-24 overflow-hidden transition-colors duration-200">
      {/* ── 1. AMBIENT BACKGROUND INFINITE SCROLL SYSTEM (Pure CSS Hardware Accelerated - AI Chief Style) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      >
        {/* 7 Vertical Columns Grid (Straight vertical matching AI Chief, NO skew) */}
        <div className="absolute -inset-x-4 -top-28 -bottom-28 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-3.5 p-4 opacity-75 dark:opacity-65">
          {AMBIENT_COLUMNS.map((colConfig, colIdx) => {
            const isOdd = colIdx % 2 === 0;
            const animationClass = isOdd ? 'animate-scroll-up' : 'animate-scroll-down';
            // Quad-duplicate cards to form seamless infinite loop across all resolutions
            const duplicatedCards = [
              ...colConfig.cards,
              ...colConfig.cards,
              ...colConfig.cards,
              ...colConfig.cards,
            ];

            return (
              <div
                key={`ambient-col-${colIdx}`}
                className="relative overflow-hidden h-full flex flex-col"
              >
                <div
                  className={`flex flex-col ${animationClass}`}
                  style={{ '--scroll-duration': `${colConfig.duration}s` } as React.CSSProperties}
                >
                  {duplicatedCards.map((card, cardIdx) => (
                    <AmbientToolCardItem
                      key={`card-${colIdx}-${card.name}-${cardIdx}`}
                      card={card}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Soft Center Vignette Overlay for Search Console & Text Legibility */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_48%,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.75)_55%,rgba(255,255,255,0.2)_85%,transparent_100%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_48%,rgba(5,7,12,0.96)_0%,rgba(5,7,12,0.78)_55%,rgba(5,7,12,0.25)_85%,transparent_100%)] pointer-events-none" />

        {/* Top & Bottom Linear Edge Fades */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-[#05070c] dark:via-transparent dark:to-[#05070c] pointer-events-none" />
      </div>

      {/* ── 2. CENTERED ENTERPRISE HERO CONTENT (100% UNCLUTTERED OVER RADIAL MASK) ── */}
      <div className="relative z-10 mx-auto max-w-5xl w-full px-6 sm:px-8 lg:px-12 text-center flex flex-col items-center">
        {/* Top Modern Kicker Badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-md transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <span className="flex h-2 w-2 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]" />
          <span className="tracking-wide">
            ⚡ The Ultimate Directory for Modern Developers &amp; Builders
          </span>
        </div>

        {/* Primary Headline (H1) with Signature Electric-Cyan Accent — Rock-Solid, ZERO BLINKING */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.08] max-w-4xl">
          Best Way to Find the Right{' '}
          <span className="block sm:inline bg-gradient-to-r from-[#00D2FF] via-cyan-400 to-sky-400 bg-clip-text text-transparent">
            AI Tools &amp; Utilities
          </span>
        </h1>

        {/* Value Proposition Sub-Headline */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl font-normal leading-relaxed">
          AiTools Studio is the premier discovery directory and utility workbench helping developers, engineers, and creators explore, test, and adopt production-ready AI tools, code compilers, and developer utilities.
        </p>

        {/* Global Search Console Container */}
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
                } else if (e.key === 'Enter') {
                  if (selectedIndex >= 0 && selectedIndex < filteredTools.length) {
                    e.preventDefault();
                    router.push(`/tools/${filteredTools[selectedIndex].slug}`);
                    setIsFocused(false);
                  }
                }
              }}
              placeholder="Search 50+ tools, compilers, calculators (e.g. 'css to html', 'loan', 'ast')..."
              className="w-full py-4 pl-3.5 pr-28 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-transparent outline-none focus:ring-0"
            />

            <div className="absolute right-3.5 flex items-center gap-1.5">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 shadow-2xs">
                <Command className="h-3 w-3" />K
              </kbd>
              <button
                type="submit"
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#00D2FF] hover:bg-[#38bdf8] text-slate-950 font-bold text-xs transition active:scale-95 shadow-xs cursor-pointer flex items-center gap-1"
                aria-label="Submit search"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Go</span>
              </button>
            </div>
          </form>

          {/* Instant Autocomplete Flyout */}
          {isFocused && filteredTools.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] shadow-2xl p-2 z-50 text-left animate-fadeIn">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Matching Tools ({filteredTools.length})
              </div>
              <div className="space-y-1">
                {filteredTools.map((t, idx) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    onMouseDown={() => router.push(`/tools/${t.slug}`)}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition ${
                      selectedIndex === idx
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{t.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{t.tagline}</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#00D2FF] bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded">
                      {t.categoryName}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Filter Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono mr-1">
            Popular:
          </span>
          {POPULAR_CHIPS.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className="rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 px-3 py-1 text-slate-700 dark:text-slate-300 transition hover:border-cyan-500/50 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 shadow-2xs font-medium"
            >
              {chip.label}
            </Link>
          ))}
        </div>

        {/* Dual Primary Call-to-Actions */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/tools"
            className="rounded-full bg-[#00D2FF] hover:bg-[#38bdf8] text-slate-950 px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(0,210,255,0.3)] transition active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Zap className="h-4 w-4 fill-slate-950 text-slate-950" />
            <span>Explore All 50+ Tools</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/calculators/finance"
            className="rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-xs transition active:scale-95 flex items-center gap-2"
          >
            <Calculator className="h-4 w-4 text-[#00D2FF]" />
            <span>19+ Universal Calculators</span>
          </Link>
        </div>

        {/* Live Directory Metrics Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>100% Client-Side Execution</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#00D2FF]" />
            <span>Zero Sign-up Required</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-sky-500" />
            <span>Deterministic AST Output</span>
          </div>
        </div>
      </div>
    </section>
  );
}
