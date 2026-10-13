'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Code2,
  Table,
  Shield,
  FileCode2,
  Share2,
  Languages,
  ScanEye,
  Network,
  BarChart2,
  Link2,
  Image,
  ExternalLink,
  Terminal,
  Clock,
  CheckSquare,
  Key,
  FileText,
  Palette,
  FileCode,
  Code,
  BookOpen,
  Filter,
} from 'lucide-react';
import { ToolDefinition, ToolCategory } from '@/lib/tools/types';

interface ToolsDirectoryViewProps {
  tools: ToolDefinition[];
}

const CATEGORY_TABS: Array<{ id: string; label: string; count?: number }> = [
  { id: 'all', label: 'All Utilities' },
  { id: 'seo', label: 'SEO Diagnostics' },
  { id: 'dev', label: 'Code & Syntax' },
  { id: 'data', label: 'Data Converters' },
  { id: 'security', label: 'Security & Encoding' },
  { id: 'text', label: 'Content & Writing' },
];

export function ToolsDirectoryView({ tools }: ToolsDirectoryViewProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;

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
    <div className="space-y-10">
      {/* ── Search & Filter Controls ── */}
      <div className="space-y-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 26+ developer compilers, AST parsers, SEO diagnostic engines..."
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07090f] py-4 pl-12 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            const count =
              tab.id === 'all'
                ? tools.length
                : tools.filter((t) => t.category === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tools Card Grid ── */}
      {filteredTools.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center text-slate-500">
          <p className="text-sm">No tools found matching your query "{query}".</p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs font-semibold text-cyan-500 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#07090f] p-6 shadow-sm transition hover:border-cyan-500/50 hover:shadow-md hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-cyan-500/10 dark:bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-400 uppercase tracking-wider font-mono">
                    {tool.categoryName}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                    100% Free
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                  {tool.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                  {tool.tagline}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                <span>Launch Tool</span>
                <ArrowRight className="h-4 w-4 transition transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
