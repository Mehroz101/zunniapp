'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Binary,
  Code2,
  Boxes,
  Terminal,
  Database,
  Car,
  TrendingUp,
  Calculator,
  Home,
  Briefcase,
  Receipt,
  ShieldCheck,
  Globe,
  Layers,
  Atom,
  Zap,
  SlidersHorizontal,
  Box,
  FlaskConical,
  Activity,
  Key,
  FileCode,
  Clock,
  Dumbbell,
  BarChart2,
  PiggyBank,
  Percent,
  DollarSign,
  Sparkles,
  Search,
  Star,
} from 'lucide-react';

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
      { name: 'JSON → YAML Stream', cat: 'Converter', badge: 'STABLE', runs: '28.4k', rating: '4.9', icon: FileText, color: 'text-[#FF8A00]', bg: 'bg-orange-500/10' },
      { name: 'HTML → Python AST', cat: 'Scraper', badge: 'v2.4', runs: '16.2k', rating: '4.8', icon: Binary, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'CSS → HTML Scaffolder', cat: 'Scaffolder', badge: 'FAST', runs: '34.1k', rating: '4.9', icon: Code2, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10' },
      { name: 'SVG → JSX React', cat: 'React', badge: 'POPULAR', runs: '42.8k', rating: '4.9', icon: Boxes, color: 'text-[#FF8A00]', bg: 'bg-orange-500/10' },
      { name: 'JS → TypeScript Strict', cat: 'Typing', badge: 'STRICT', runs: '31.5k', rating: '4.9', icon: Terminal, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'SQL → Prisma Schema', cat: 'ORM', badge: 'PRO', runs: '19.7k', rating: '4.8', icon: Database, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10' },
    ],
  },
  // Column 2 (Even: Scrolls DOWNWARDS - 84s cycle) - Financial Engines
  {
    duration: 84,
    cards: [
      { name: 'Auto Loan Trade-In', cat: 'Finance', badge: 'HOT', runs: '74.2k', rating: '4.9', icon: Car, color: 'text-[#FF8A00]', bg: 'bg-orange-500/10' },
      { name: 'Compound Interest ROI', cat: 'Wealth', badge: 'LIVE', runs: '39.5k', rating: '4.8', icon: TrendingUp, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
      { name: 'Loan EMI Amortization', cat: 'Lending', badge: 'ACCURATE', runs: '63.0k', rating: '4.9', icon: Calculator, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'Mortgage Refinance', cat: 'Real Estate', badge: '30-YR', runs: '27.9k', rating: '4.9', icon: Home, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'Business Margin & Markup', cat: 'Enterprise', badge: 'B2B', runs: '21.4k', rating: '4.7', icon: Briefcase, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10' },
      { name: 'Federal Tax Bracket', cat: 'IRS 2026', badge: 'TAX', runs: '45.1k', rating: '4.9', icon: Receipt, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-500/10' },
    ],
  },
  // Column 3 (Odd: Scrolls UPWARDS - 66s cycle) - SEO & Crawl Diagnostics
  {
    duration: 66,
    cards: [
      { name: 'Robots.txt Validator', cat: 'SEO', badge: 'VERIFIED', runs: '51.3k', rating: '4.9', icon: ShieldCheck, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
      { name: 'OpenGraph Meta Tag', cat: 'Social', badge: 'INSTANT', runs: '33.2k', rating: '4.8', icon: Globe, color: 'text-[#FF8A00]', bg: 'bg-orange-500/10' },
      { name: 'XML Sitemap Auditor', cat: 'Crawl', badge: 'FAST', runs: '29.7k', rating: '4.9', icon: Layers, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'JSON-LD Schema Builder', cat: 'Rich Snippet', badge: 'SEO', runs: '36.8k', rating: '4.9', icon: Code2, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10' },
      { name: 'SERP Title Simulator', cat: 'CTR Tool', badge: 'PIXEL', runs: '18.4k', rating: '4.7', icon: Search, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'Headings Hierarchy H1-H6', cat: 'Audit', badge: 'CLEAN', runs: '22.1k', rating: '4.8', icon: FileText, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10' },
    ],
  },
  // Column 4 (Even: Scrolls DOWNWARDS - 90s cycle) - Scientific & Physics
  {
    duration: 90,
    cards: [
      { name: 'Scientific Notation', cat: 'Math', badge: 'FLOAT', runs: '19.4k', rating: '4.8', icon: Atom, color: 'text-[#FF8A00]', bg: 'bg-orange-500/10' },
      { name: 'Projectile Kinematics', cat: 'Physics', badge: '2D/3D', runs: '15.6k', rating: '4.9', icon: Zap, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: "Ohm's Law & Resistance", cat: 'Electronics', badge: 'DC/AC', runs: '24.8k', rating: '4.8', icon: SlidersHorizontal, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
      { name: 'Cylinder & 3D Geometry', cat: 'Geometry', badge: 'CALC', runs: '17.2k', rating: '4.7', icon: Box, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10' },
      { name: 'Chemical Molar Mass', cat: 'Chemistry', badge: 'P-TABLE', runs: '14.3k', rating: '4.9', icon: FlaskConical, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'Velocity SI Unit Transcoder', cat: 'Units', badge: 'SI', runs: '20.5k', rating: '4.8', icon: Activity, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-500/10' },
    ],
  },
  // Column 5 (Odd: Scrolls UPWARDS - 76s cycle) - Security & Utilities
  {
    duration: 76,
    cards: [
      { name: 'JWT Secret Inspector', cat: 'Security', badge: 'CLIENT', runs: '38.2k', rating: '4.9', icon: Key, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'Regex Pattern Tester', cat: 'Developer', badge: 'PCRE', runs: '47.1k', rating: '4.9', icon: Terminal, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10' },
      { name: 'Base64 Studio WASM', cat: 'Transcoder', badge: 'WASM', runs: '29.4k', rating: '4.8', icon: FileCode, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'UUID v4 Generator', cat: 'Generator', badge: 'RFC4122', runs: '56.3k', rating: '4.9', icon: Binary, color: 'text-[#FF8A00]', bg: 'bg-orange-500/10' },
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
      { name: 'High-Yield APY Savings', cat: 'Banking', badge: 'COMPOUND', runs: '29.1k', rating: '4.9', icon: PiggyBank, color: 'text-[#FF8A00]', bg: 'bg-orange-500/10' },
      { name: 'Inflation Purchasing Power', cat: 'Macro', badge: 'CPI', runs: '22.3k', rating: '4.8', icon: Percent, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'Discount & Sale Savings', cat: 'Retail', badge: 'OFF', runs: '19.8k', rating: '4.7', icon: DollarSign, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10' },
    ],
  },
  // Column 7 (Odd: Scrolls UPWARDS - 74s cycle) - AI Toolkits & Web Utilities
  {
    duration: 74,
    cards: [
      { name: 'AI Text Summarizer', cat: 'NLP', badge: 'AI', runs: '52.1k', rating: '4.9', icon: Sparkles, color: 'text-[#FF8A00]', bg: 'bg-orange-500/10' },
      { name: 'Markdown to HTML Live', cat: 'Markup', badge: 'FAST', runs: '33.8k', rating: '4.8', icon: FileText, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'CSS Flexbox Generator', cat: 'Layout', badge: 'VISUAL', runs: '41.2k', rating: '4.9', icon: Layers, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10' },
      { name: 'SQL Query Formatter', cat: 'Database', badge: 'ANSI', runs: '28.9k', rating: '4.9', icon: Database, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
      { name: 'HTTP Status Codes', cat: 'Reference', badge: 'RFC9110', runs: '37.4k', rating: '4.8', icon: Globe, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
      { name: 'DNS Record Lookup', cat: 'Network', badge: 'DoH', runs: '24.6k', rating: '4.8', icon: ShieldCheck, color: 'text-[#FF8A00]', bg: 'bg-orange-500/10' },
    ],
  },
];

function AmbientToolCardItem({ card }: { card: AmbientCard }) {
  const Icon = card.icon;
  return (
    <div className="relative mb-3.5 flex items-center gap-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0c1222] px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all">
      {/* Icon with Light Orange Accent Glow */}
      <div className={`p-2 rounded-xl ${card.bg} ${card.color} shrink-0`}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Center Details */}
      <div className="min-w-0 flex-1">
        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate block">
          {card.name}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate block mt-0.5">
          {card.cat} • <span className="font-mono">{card.runs} runs/mo</span>
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

export function AmbientHeroBackground() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Schedule after main-thread work finishes to eliminate Desktop TBT & long tasks
    if (typeof window !== 'undefined') {
      const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 120));
      const handle = schedule(() => setIsMounted(true));
      return () => {
        if (window.cancelIdleCallback) {
          window.cancelIdleCallback(handle as number);
        } else {
          clearTimeout(handle as unknown as NodeJS.Timeout);
        }
      };
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {/* Desktop Ambient Columns Grid (hidden on mobile < 768px, mounted when idle on desktop) */}
      {isMounted ? (
        <div className="hidden md:grid absolute -inset-x-4 -top-28 -bottom-28 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-3.5 p-4 opacity-75 dark:opacity-65">
          {AMBIENT_COLUMNS.map((colConfig, colIdx) => {
            const isOdd = colIdx % 2 === 0;
            const animationClass = isOdd ? 'animate-scroll-up' : 'animate-scroll-down';
            const duplicatedCards = [
              ...colConfig.cards,
              ...colConfig.cards,
            ];

            const colVisibilityClass =
              colIdx < 3
                ? 'block'
                : colIdx < 6
                ? 'hidden lg:block'
                : 'hidden xl:block';

            return (
              <div
                key={`ambient-col-${colIdx}`}
                className={`relative overflow-hidden h-full flex-col ${colVisibilityClass}`}
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
      ) : null}

      {/* Soft Center Vignette Overlay for Search Console & Text Legibility */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_48%,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.75)_55%,rgba(255,255,255,0.2)_85%,transparent_100%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_48%,rgba(5,7,12,0.96)_0%,rgba(5,7,12,0.78)_55%,rgba(5,7,12,0.25)_85%,transparent_100%)] pointer-events-none" />

      {/* Top & Bottom Linear Edge Fades */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-[#05070c] dark:via-transparent dark:to-[#05070c] pointer-events-none" />
    </div>
  );
}
