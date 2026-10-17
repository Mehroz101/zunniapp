'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  ArrowRight,
  Code2,
  Binary,
  Boxes,
  Database,
  Terminal,
  FileText,
  CheckCircle2,
  Palette,
  Zap,
  Cpu,
  FileEdit,
} from 'lucide-react';
import { ToolDefinition } from '@/lib/tools/types';

interface ToolsDirectoryViewProps {
  tools: ToolDefinition[];
}

const CATEGORY_TABS: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'All Utilities' },
  { id: 'code-converters', label: 'Code Converters' },
  { id: 'ai-utilities', label: 'AI Utilities' },
  { id: 'text-web', label: 'Text & Web' },
];

export const SUITE_TOOLS_ORDER = [
  'css-to-html',
  'html-to-python-ast',
  'json-to-yaml',
  'js-to-ts',
  'svg-to-jsx',
  'sql-to-schema-orm',
  'ai-syntax-debugger',
  'prompt-optimizer',
  'regex-neural-generator',
  'unit-test-builder',
  'markdown-live-editor',
  'tailwind-converter',
  'minifier-pro',
];

interface ToolBadgeInfo {
  tag: string;
  sub: string;
  speed: string;
  title: string;
  desc: string;
  group: 'code-converters' | 'ai-utilities' | 'text-web';
}

const SUITE_TOOL_METADATA: Record<string, ToolBadgeInfo> = {
  'css-to-html': {
    tag: 'CODE TRANSCODER',
    sub: 'AST Engine',
    speed: '< 0.8ms',
    title: 'CSS ➔ HTML Scaffolder',
    desc: 'Translates CSS selectors, grid definitions, and flex rules into semantic HTML5 markup.',
    group: 'code-converters',
  },
  'html-to-python-ast': {
    tag: 'SCRAPER ENGINE',
    sub: 'Python Parser',
    speed: '< 1.1ms',
    title: 'HTML ➔ Python AST',
    desc: 'Transforms markup into clean BeautifulSoup & Playwright scrapers with typed extraction rules.',
    group: 'code-converters',
  },
  'json-to-yaml': {
    tag: 'CONFIG PARSER',
    sub: 'WASM Streamer',
    speed: '< 0.4ms',
    title: 'JSON ➔ YAML Stream',
    desc: 'Bi-directional zero-loss configuration converter with schema validator for K8s & Docker compose.',
    group: 'code-converters',
  },
  'js-to-ts': {
    tag: 'TYPE SYNTHESIZER',
    sub: 'TypeScript AST',
    speed: '< 1.4ms',
    title: 'JS ➔ TypeScript Strict',
    desc: 'Infers runtime shapes from JavaScript objects and generates strict interfaces with type safety.',
    group: 'code-converters',
  },
  'svg-to-jsx': {
    tag: 'VECTOR ENGINE',
    sub: 'SVGO Client',
    speed: '< 0.6ms',
    title: 'SVG ➔ JSX Component',
    desc: 'Cleans and minifies vector SVGs into tree-shakable React 19 / Next.js components with Tailwind props.',
    group: 'code-converters',
  },
  'sql-to-schema-orm': {
    tag: 'ORM COMPILER',
    sub: 'DDL Lexer',
    speed: '< 1.2ms',
    title: 'SQL ➔ Schema ORM',
    desc: 'Extracts SQL DDL table statements and creates Prisma, Drizzle, and TypeScript model schemas.',
    group: 'code-converters',
  },
  'ai-syntax-debugger': {
    tag: 'DIAGNOSTICS',
    sub: 'Neural Heuristics',
    speed: '< 2.1ms',
    title: 'AI Syntax Debugger',
    desc: 'Neural heuristic diagnostic engine that pins down runtime stacktraces and outputs clean inline diffs.',
    group: 'ai-utilities',
  },
  'prompt-optimizer': {
    tag: 'TOKEN COMPRESSION',
    sub: 'BPE Tokenizer',
    speed: '< 0.9ms',
    title: 'Prompt Optimizer Pro',
    desc: 'Compresses verbose prompts, eliminates token bloat, and structures few-shot instructions for LLMs.',
    group: 'ai-utilities',
  },
  'regex-neural-generator': {
    tag: 'REGEX OPTIMIZER',
    sub: 'Regex VM',
    speed: '< 0.5ms',
    title: 'RegEx Neural Generator',
    desc: 'Turns plain English match criteria into efficient, catastrophic-backtracking-proof regular expressions.',
    group: 'ai-utilities',
  },
  'unit-test-builder': {
    tag: 'VITEST / JEST',
    sub: 'Test Matrix AST',
    speed: '< 1.8ms',
    title: 'Unit Test Builder',
    desc: 'Analyzes function signatures and edge case branches to synthesize ready-to-run Vitest & Jest suites.',
    group: 'ai-utilities',
  },
  'markdown-live-editor': {
    tag: 'LIVE PARSER',
    sub: 'GFM + KaTeX',
    speed: '< 0.3ms',
    title: 'Markdown Live Editor',
    desc: 'Real-time GFM canvas with instant KaTeX math equations, Mermaid diagrams, and one-click HTML copy.',
    group: 'text-web',
  },
  'tailwind-converter': {
    tag: 'CSS TRANSPILER',
    sub: 'Tailwind JIT',
    speed: '< 0.7ms',
    title: 'Tailwind Class Converter',
    desc: 'Parses standard CSS rules and outputs corresponding modern Tailwind utility classes with JIT syntax.',
    group: 'text-web',
  },
  'minifier-pro': {
    tag: 'BYTE COMPRESSOR',
    sub: 'Rust WASM',
    speed: '< 0.4ms',
    title: 'Minifier Pro WASM',
    desc: 'Instant bytecode minifier for HTML, CSS, and JS. Zero payload leaks to any server.',
    group: 'text-web',
  },
};

function getToolIcon(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes('python')) return Binary;
  if (s.includes('svg') || s.includes('patch')) return Boxes;
  if (s.includes('sql') || s.includes('prisma') || s.includes('schema')) return Database;
  if (s.includes('prompt')) return Cpu;
  if (s.includes('test')) return CheckCircle2;
  if (s.includes('tailwind')) return Palette;
  if (s.includes('minifier') || s.includes('zap')) return Zap;
  if (s.includes('markdown')) return FileEdit;
  if (s.includes('yaml') || s.includes('csv')) return FileText;
  if (s.includes('regex')) return Terminal;
  if (s.includes('debugger')) return Sparkles;
  if (s.includes('ts') || s.includes('terminal')) return Terminal;
  return Code2;
}

export function ToolsDirectoryView({ tools }: ToolsDirectoryViewProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Build sorted list: 13 primary suite tools in exact reference order, followed by other registered tools
  const allOrderedTools = useMemo(() => {
    const toolsMap = new Map<string, ToolDefinition>();
    tools.forEach((t) => toolsMap.set(t.slug, t));

    const suiteList: ToolDefinition[] = [];
    SUITE_TOOLS_ORDER.forEach((slug) => {
      const tool = toolsMap.get(slug);
      if (tool) {
        suiteList.push(tool);
        toolsMap.delete(slug);
      }
    });

    const otherList = Array.from(toolsMap.values());
    return [...suiteList, ...otherList];
  }, [tools]);

  const filteredTools = useMemo(() => {
    return allOrderedTools.filter((tool) => {
      const meta = SUITE_TOOL_METADATA[tool.slug];
      const group = meta?.group || (tool.category === 'seo' ? 'text-web' : 'code-converters');

      const matchesCategory =
        selectedCategory === 'all' || group === selectedCategory;

      if (!matchesCategory) return false;

      if (!query.trim()) return true;

      const q = query.toLowerCase();
      const inName = tool.name.toLowerCase().includes(q) || (meta?.title && meta.title.toLowerCase().includes(q));
      const inTagline = (tool.tagline || '').toLowerCase().includes(q) || (meta?.desc && meta.desc.toLowerCase().includes(q));
      const inSub = (meta?.sub || '').toLowerCase().includes(q);
      const inTag = (meta?.tag || '').toLowerCase().includes(q);
      const inKeywords = (tool.seoKeywords || []).some((k) => k.toLowerCase().includes(q));

      return inName || inTagline || inSub || inTag || inKeywords;
    });
  }, [allOrderedTools, query, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* ── Top Header Row with Kicker, Title, Subtitle, and Filter Pills ── */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
        <div className="space-y-3 max-w-2xl">
          {/* Kicker Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 dark:border-orange-900/60 bg-orange-50/60 dark:bg-orange-950/30 px-3.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>DEVELOPER UTILITIES SUITE</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
            AI Tools for{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
              Every Workflow
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            High-throughput deterministic code transducers, formatters, and AI debuggers.
            <br className="hidden sm:inline" />
            {' '}Zero cloud telemetry.
          </p>
        </div>

        {/* Filter Pills (Top Right) */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-end">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#FF8A00] text-slate-950 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search Input (Left Aligned Pill) ── */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools by name, AST engine, or keyword..."
          className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-2 pl-9 pr-8 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-2xs outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Tools Card Grid (Exact 3-Column Parity with Reference Image) ── */}
      {filteredTools.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center text-slate-500">
          <p className="text-sm">No tools found matching your query &ldquo;{query}&rdquo;.</p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs font-semibold text-orange-600 dark:text-[#FF8A00] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const meta = SUITE_TOOL_METADATA[tool.slug];
            const IconComponent = getToolIcon(tool.slug);

            const displayTitle = meta?.title || tool.name;
            const displayDesc = meta?.desc || tool.tagline || tool.description;
            const tag = meta?.tag || (tool.categoryTag || tool.categoryName || 'CODE UTILITY').toUpperCase();
            const sub = meta?.sub || tool.engineSubBadge || 'AST Engine';
            const speed = meta?.speed || tool.speedBadge || '< 0.8ms';

            // Split title if it contains arrow for colored highlight
            const arrowParts = displayTitle.split(/➔|→/);

            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-5 shadow-2xs transition-all duration-200 hover:border-orange-300 dark:hover:border-orange-500/40 hover:shadow-md hover:shadow-orange-500/5 hover:-translate-y-0.5"
              >
                <div>
                  {/* Top Row: Icon + Upper Tag/Sub Badge on Left, Speed Badge on Right */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-200/80 dark:border-orange-800/50 bg-orange-50/90 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 group-hover:border-orange-400/60 group-hover:bg-orange-500/10 transition">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                          {tag}
                        </span>
                        <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                          {sub}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/80 dark:bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {speed}
                    </span>
                  </div>

                  {/* Tool Title */}
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                    {arrowParts.length > 1 ? (
                      <>
                        <span>{arrowParts[0].trim()}</span>
                        <span className="text-orange-500 dark:text-orange-400 mx-1.5 font-bold">➔</span>
                        <span>{arrowParts[1].trim()}</span>
                      </>
                    ) : (
                      displayTitle
                    )}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                    {displayDesc}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {tag}
                  </span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Launch Tool</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
