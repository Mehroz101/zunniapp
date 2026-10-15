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
  CheckSquare,
  Palette,
  Zap,
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

function getPrimaryGroup(tool: ToolDefinition): string {
  if (tool.primaryGroup) return tool.primaryGroup;
  const s = tool.slug.toLowerCase();
  if (
    s.includes('syntax-debugger') ||
    s.includes('prompt-optimizer') ||
    s.includes('regex-neural') ||
    s.includes('unit-test')
  ) {
    return 'ai-utilities';
  }
  if (
    s.includes('markdown') ||
    s.includes('minifier') ||
    s.includes('json-patch')
  ) {
    return 'text-web';
  }
  return 'code-converters';
}

function getToolIcon(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes('python')) return Binary;
  if (s.includes('svg') || s.includes('patch')) return Boxes;
  if (s.includes('sql') || s.includes('prisma') || s.includes('schema')) return Database;
  if (s.includes('prompt')) return Sparkles;
  if (s.includes('test')) return CheckSquare;
  if (s.includes('tailwind')) return Palette;
  if (s.includes('minifier') || s.includes('zap')) return Zap;
  if (s.includes('yaml') || s.includes('markdown') || s.includes('csv')) return FileText;
  if (s.includes('debugger') || s.includes('ts') || s.includes('terminal')) return Terminal;
  return Code2;
}

function getToolBadges(tool: ToolDefinition) {
  const defaults: Record<string, { tag: string; sub: string; speed: string }> = {
    'css-to-html': { tag: 'CODE TRANSCODER', sub: 'AST Engine', speed: '< 0.8ms' },
    'html-to-python-ast': { tag: 'SCRAPER ENGINE', sub: 'Python Parser', speed: '< 1.1ms' },
    'json-to-yaml': { tag: 'CONFIG PARSER', sub: 'WASM Streamer', speed: '< 0.4ms' },
    'js-to-ts': { tag: 'TYPE SYNTHESIZER', sub: 'TypeScript AST', speed: '< 1.4ms' },
    'js-to-typescript': { tag: 'TYPE SYNTHESIZER', sub: 'TypeScript AST', speed: '< 1.4ms' },
    'svg-to-jsx': { tag: 'VECTOR ENGINE', sub: 'SVGO Client', speed: '< 0.6ms' },
    'svg-to-react': { tag: 'VECTOR ENGINE', sub: 'SVGO Client', speed: '< 0.6ms' },
    'sql-to-schema-orm': { tag: 'ORM COMPILER', sub: 'DDL Lexer', speed: '< 1.2ms' },
    'sql-to-schema': { tag: 'ORM COMPILER', sub: 'DDL Lexer', speed: '< 1.2ms' },
    'sql-to-prisma': { tag: 'ORM COMPILER', sub: 'DDL Lexer', speed: '< 1.2ms' },
    'ai-syntax-debugger': { tag: 'DIAGNOSTICS', sub: 'Neural Heuristics', speed: '< 2.1ms' },
    'prompt-optimizer': { tag: 'TOKEN COMPRESSION', sub: 'BPE Tokenizer', speed: '< 0.9ms' },
    'regex-neural-generator': { tag: 'REGEX OPTIMIZER', sub: 'Regex VM', speed: '< 0.5ms' },
    'unit-test-builder': { tag: 'VITEST / JEST', sub: 'Test Matrix AST', speed: '< 1.8ms' },
    'markdown-live-editor': { tag: 'LIVE PARSER', sub: 'GFM + KaTeX', speed: '< 0.3ms' },
    'tailwind-converter': { tag: 'CSS TRANSPILER', sub: 'Tailwind JIT', speed: '< 0.7ms' },
    'css-to-tailwind': { tag: 'CSS TRANSPILER', sub: 'Tailwind JIT', speed: '< 0.7ms' },
    'json-patch-applier': { tag: 'CONFIG ENGINE', sub: 'JSON Pointer VM', speed: '< 0.4ms' },
    'minifier-pro': { tag: 'BYTE COMPRESSOR', sub: 'Rust WASM', speed: '< 0.4ms' },
  };

  const item = defaults[tool.slug] || {
    tag: (tool.categoryTag || tool.categoryName || 'CODE UTILITY').toUpperCase(),
    sub: tool.engineSubBadge || 'Client Engine',
    speed: tool.speedBadge || '< 0.8ms',
  };

  return {
    tag: tool.categoryTag || item.tag,
    sub: tool.engineSubBadge || item.sub,
    speed: tool.speedBadge || item.speed,
  };
}

export function ToolsDirectoryView({ tools }: ToolsDirectoryViewProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const group = getPrimaryGroup(tool);
      const matchesCategory =
        selectedCategory === 'all' || group === selectedCategory;

      if (!matchesCategory) return false;

      if (!query.trim()) return true;

      const q = query.toLowerCase();
      const inName = tool.name.toLowerCase().includes(q);
      const inTagline = tool.tagline.toLowerCase().includes(q);
      const inKeywords = tool.seoKeywords.some((k) => k.toLowerCase().includes(q));
      const inCategory = tool.categoryName.toLowerCase().includes(q);

      return inName || inTagline || inKeywords || inCategory;
    });
  }, [tools, query, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* ── Search Bar & Filter Tabs Row ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Pill Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools by name, AST engine, or keyword..."
            className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07090f] py-2.5 pl-11 pr-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-2xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#0c1222] text-white shadow-xs dark:bg-white dark:text-slate-950'
                    : 'bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tools Card Grid (Exact Parity with Reference Image) ── */}
      {filteredTools.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center text-slate-500">
          <p className="text-sm">No tools found matching your query &ldquo;{query}&rdquo;.</p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs font-semibold text-blue-600 dark:text-[#00D2FF] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const IconComponent = getToolIcon(tool.slug);
            const badges = getToolBadges(tool);

            return (
              <Link
                key={tool.slug}
                href={`/ai-tools/${tool.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#070b13] p-5 shadow-2xs transition-all duration-200 hover:border-blue-400 dark:hover:border-cyan-400/50 hover:shadow-md hover:-translate-y-0.5"
              >
                <div>
                  {/* Top Row: Icon + Upper Tag/Sub Badge on Left, Speed Badge on Right */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-blue-600 dark:text-[#00D2FF]">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                          {badges.tag}
                        </span>
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-[#00D2FF]">
                          {badges.sub}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-600 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                      {badges.speed}
                    </span>
                  </div>

                  {/* Tool Title */}
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-[#00D2FF] transition-colors leading-snug">
                    {tool.name}
                  </h3>

                  {/* Tagline */}
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                    {tool.tagline || tool.description}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    Client Sandbox
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-[#00D2FF] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
