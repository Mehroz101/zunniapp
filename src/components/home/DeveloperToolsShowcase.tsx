'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Code2,
  Terminal,
  FileCode,
  Binary,
  Layers,
  Database,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Cpu,
  FileText,
  Search,
} from 'lucide-react';

type ToolCategory = 'all' | 'converters' | 'ai' | 'web';

interface ToolItem {
  id: string;
  name: string;
  category: 'converters' | 'ai' | 'web';
  tagline: string;
  engine: string;
  speed: string;
  href: string;
  slug: string;
  badge: string;
  icon: React.ElementType;
}

const TOOLS_SHOWCASE: ToolItem[] = [
  // ── Code Converters ──
  {
    id: 'css-to-html',
    name: 'CSS → HTML Scaffolder',
    category: 'converters',
    tagline: 'Translates CSS selectors, grid definitions, and flex rules into semantic HTML5 markup.',
    engine: 'AST Engine',
    speed: '< 0.8ms',
    href: '/tools/css-to-html',
    slug: 'css-to-html',
    badge: 'Code Transcoder',
    icon: Code2,
  },
  {
    id: 'html-to-python',
    name: 'HTML → Python AST',
    category: 'converters',
    tagline: 'Transforms markup into clean BeautifulSoup & Playwright scrapers with typed extraction rules.',
    engine: 'Python Parser',
    speed: '< 1.1ms',
    href: '/tools/html-to-python-ast',
    slug: 'html-to-python-ast',
    badge: 'Scraper Engine',
    icon: Binary,
  },
  {
    id: 'json-to-yaml',
    name: 'JSON ↔ YAML Stream',
    category: 'converters',
    tagline: 'Bi-directional zero-loss configuration converter with schema validator for K8s & Docker compose.',
    engine: 'WASM Streamer',
    speed: '< 0.4ms',
    href: '/tools/json-to-yaml',
    slug: 'json-to-yaml',
    badge: 'Config Parser',
    icon: FileText,
  },
  {
    id: 'js-to-ts',
    name: 'JS → TypeScript Strict',
    category: 'converters',
    tagline: 'Infers runtime shapes from JavaScript objects and generates strict interfaces with type safety.',
    engine: 'TypeScript AST',
    speed: '< 1.4ms',
    href: '/tools/js-to-ts',
    slug: 'js-to-ts',
    badge: 'Type Synthesizer',
    icon: Terminal,
  },
  {
    id: 'svg-to-jsx',
    name: 'SVG → JSX Component',
    category: 'converters',
    tagline: 'Cleans and minifies vector SVGs into tree-shakable React 19 / Next.js components with Tailwind props.',
    engine: 'SVGO Client',
    speed: '< 0.6ms',
    href: '/tools/svg-to-jsx',
    slug: 'svg-to-jsx',
    badge: 'Vector Engine',
    icon: Layers,
  },
  {
    id: 'sql-to-schema',
    name: 'SQL → Schema ORM',
    category: 'converters',
    tagline: 'Extracts SQL DDL table statements and creates Prisma, Drizzle, and TypeScript model schemas.',
    engine: 'DDL Lexer',
    speed: '< 1.2ms',
    href: '/tools/sql-to-schema-orm',
    slug: 'sql-to-schema-orm',
    badge: 'ORM Compiler',
    icon: Database,
  },

  // ── AI Utilities ──
  {
    id: 'ai-syntax-debugger',
    name: 'AI Syntax Debugger',
    category: 'ai',
    tagline: 'Neural heuristic diagnostic engine that pins down runtime stacktraces and outputs clean inline diffs.',
    engine: 'Neural Heuristics',
    speed: '< 2.1ms',
    href: '/tools/ai-syntax-debugger',
    slug: 'ai-syntax-debugger',
    badge: 'Diagnostics',
    icon: Sparkles,
  },
  {
    id: 'prompt-optimizer',
    name: 'Prompt Optimizer Pro',
    category: 'ai',
    tagline: 'Compresses verbose prompts, eliminates token bloat, and structures few-shot instructions for LLMs.',
    engine: 'BPE Tokenizer',
    speed: '< 0.9ms',
    href: '/tools/prompt-optimizer',
    slug: 'prompt-optimizer',
    badge: 'Token Compression',
    icon: Cpu,
  },
  {
    id: 'regex-neural-generator',
    name: 'RegEx Neural Generator',
    category: 'ai',
    tagline: 'Turns plain English match criteria into efficient, catastrophic-backtracking-proof regular expressions.',
    engine: 'Regex VM',
    speed: '< 0.5ms',
    href: '/tools/regex-neural-generator',
    slug: 'regex-neural-generator',
    badge: 'Regex Optimizer',
    icon: Terminal,
  },
  {
    id: 'unit-test-builder',
    name: 'Unit Test Builder',
    category: 'ai',
    tagline: 'Analyzes function signatures and edge case branches to synthesize ready-to-run Vitest & Jest suites.',
    engine: 'Test Matrix AST',
    speed: '< 1.8ms',
    href: '/tools/unit-test-builder',
    slug: 'unit-test-builder',
    badge: 'Vitest / Jest',
    icon: CheckCircle2,
  },

  // ── Text & Web Utilities ──
  {
    id: 'markdown-live-editor',
    name: 'Markdown Live Editor',
    category: 'web',
    tagline: 'Real-time GFM canvas with instant KaTeX math equations, Mermaid diagrams, and one-click HTML copy.',
    engine: 'GFM + KaTeX',
    speed: '< 0.3ms',
    href: '/tools/markdown-live-editor',
    slug: 'markdown-live-editor',
    badge: 'Live Parser',
    icon: FileCode,
  },
  {
    id: 'tailwind-class-converter',
    name: 'Tailwind Class Converter',
    category: 'web',
    tagline: 'Parses standard CSS rules and outputs corresponding modern Tailwind utility classes with JIT syntax.',
    engine: 'Tailwind JIT',
    speed: '< 0.7ms',
    href: '/tools/tailwind-converter',
    slug: 'tailwind-converter',
    badge: 'CSS Transpiler',
    icon: Layers,
  },
  {
    id: 'minifier-pro-wasm',
    name: 'Minifier Pro WASM',
    category: 'web',
    tagline: 'Instant bytecode minifier for HTML, CSS, and JS. Zero payload leaks to any server.',
    engine: 'Rust WASM',
    speed: '< 0.4ms',
    href: '/tools/minifier-pro',
    slug: 'minifier-pro',
    badge: 'Byte Compressor',
    icon: Zap,
  },
];

export function DeveloperToolsShowcase() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOLS_SHOWCASE.filter((tool) => {
    const matchesCat = activeCategory === 'all' || tool.category === activeCategory;
    const matchesQuery =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.engine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <section className="bg-white dark:bg-[#05070c] border-t border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 lg:px-12 py-16 sm:py-24 transition-colors duration-200 min-h-[520px]" id="tools">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1 text-xs font-mono text-orange-600 dark:text-[#FF8A00] shadow-xs">
              <Zap className="h-3 w-3" />
              <span>DEVELOPER UTILITIES SUITE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-slate-900 dark:text-slate-50">
              AI Tools for{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
                Every Workflow
              </span>
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 font-normal leading-relaxed text-[15px] sm:text-base max-w-xl">
              High-throughput deterministic code transducers, formatters, and AI debuggers. Zero cloud telemetry.
            </p>
          </div>

          {/* Quick Filter Pill Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Utilities' },
              { id: 'converters', label: 'Code Converters' },
              { id: 'ai', label: 'AI Utilities' },
              { id: 'web', label: 'Text & Web' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as ToolCategory)}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-[#FF8A00] text-slate-950 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tools by name, AST engine, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-full pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20 transition-all font-mono shadow-xs"
          />
        </div>

        {/* Clean Light Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 shadow-xs transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-500/40 hover:shadow-xl hover:-translate-y-0.5"
              >
                <div>
                  {/* Top Bar with Icon and Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/50 flex items-center justify-center text-orange-500 dark:text-orange-400 group-hover:border-orange-400/60 group-hover:bg-orange-500/10 transition">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                          {tool.badge}
                        </span>
                        <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 font-semibold">
                          {tool.engine}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                      {tool.speed}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-semibold tracking-[-0.01em] text-slate-900 dark:text-slate-100 transition group-hover:text-orange-600 dark:group-hover:text-orange-400">
                    {tool.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                    {tool.tagline}
                  </p>
                </div>

                {/* Footer Bar */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {tool.badge}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono font-semibold text-orange-600 dark:text-orange-400 transition group-hover:text-orange-700 dark:group-hover:text-orange-300">
                    Launch Tool <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
