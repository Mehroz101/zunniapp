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
  Filter,
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
    href: '/ai-tools/coding/html-to-css-converter',
    slug: 'coding',
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
    href: '/ai-tools/coding',
    slug: 'coding',
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
    href: '/ai-tools/coding',
    slug: 'coding',
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
    href: '/ai-tools/coding',
    slug: 'coding',
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
    href: '/ai-tools/coding',
    slug: 'coding',
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
    href: '/ai-tools/coding',
    slug: 'coding',
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
    href: '/ai-tools/coding',
    slug: 'coding',
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
    href: '/ai-tools/writing',
    slug: 'writing',
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
    href: '/ai-tools/coding',
    slug: 'coding',
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
    href: '/ai-tools/coding',
    slug: 'coding',
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
    href: '/ai-tools/text',
    slug: 'text',
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
    href: '/ai-tools/coding',
    slug: 'coding',
    badge: 'CSS Transpiler',
    icon: Layers,
  },
  {
    id: 'minifier-pro-wasm',
    name: 'Minifier Pro WASM',
    category: 'web',
    tagline: 'Client-side bytecode minifier for HTML, CSS, and JS. Zero payload leaks to any server.',
    engine: 'Rust WASM',
    speed: '< 0.4ms',
    href: '/ai-tools/coding',
    slug: 'coding',
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
    <section className="bg-[#07090e] border-t border-white/[0.06] px-4 sm:px-6 lg:px-10 py-24 sm:py-28" id="tools">
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-mono text-[#00D2FF]">
              <Zap className="h-3 w-3" />
              <span>DEVELOPER UTILITIES SUITE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              AI Tools for{' '}
              <span className="bg-gradient-to-r from-[#00D2FF] via-[#38bdf8] to-indigo-400 bg-clip-text text-transparent">
                Every Workflow
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl">
              High-throughput client-side code transducers, formatters, and AI debuggers. Zero cloud telemetry.
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
                    ? 'bg-[#00D2FF] text-black font-semibold shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                    : 'bg-white/[0.03] text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar Bar */}
        <div className="relative mb-10 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tools by name, AST engine, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF]/50 transition-colors font-mono"
          />
        </div>

        {/* Minimalist Glassmorphic Cards Grid (Eliminating Boxy Design) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#00D2FF]/40 hover:bg-white/[0.04] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div>
                  {/* Top Bar with Icon and Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#00D2FF] group-hover:border-[#00D2FF]/50 group-hover:bg-[#00D2FF]/10 transition">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                          {tool.badge}
                        </span>
                        <span className="text-[10px] font-mono text-[#00D2FF]">
                          {tool.engine}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                      {tool.speed}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white transition group-hover:text-[#00D2FF]">
                    {tool.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-400 line-clamp-2">
                    {tool.tagline}
                  </p>
                </div>

                {/* Footer Bar */}
                <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="text-[11px] font-mono text-slate-500">
                    Client Sandbox
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-300 transition group-hover:text-[#00D2FF]">
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
