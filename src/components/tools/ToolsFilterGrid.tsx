'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  Eye,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export interface DirectoryTool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  renderType: string;
  isFeatured: boolean;
  isFree: boolean;
  viewCount: number;
  publishedAt: string | null;
  config: Record<string, unknown>;
  category: {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface DirectoryCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface ToolsFilterGridProps {
  initialTools: DirectoryTool[];
  categories: DirectoryCategory[];
  defaultCategory?: string;
}

const ITEMS_PER_PAGE = 12;

export function ToolsFilterGrid({
  initialTools,
  categories,
  defaultCategory,
}: ToolsFilterGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory || 'all');
  const [selectedPricing, setSelectedPricing] = useState<'all' | 'free' | 'freemium' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'featured'>('featured');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Sort Logic
  const filteredTools = useMemo(() => {
    let result = [...initialTools];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.tagline.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.tags.some((t) => t.name.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((tool) => tool.category.slug === selectedCategory);
    }

    // 3. Pricing Filter
    if (selectedPricing !== 'all') {
      if (selectedPricing === 'free') {
        result = result.filter(
          (tool) => tool.isFree || (tool.config?.pricing as string)?.toLowerCase() === 'free'
        );
      } else if (selectedPricing === 'freemium') {
        result = result.filter(
          (tool) => (tool.config?.pricing as string)?.toLowerCase() === 'freemium'
        );
      } else if (selectedPricing === 'paid') {
        result = result.filter(
          (tool) =>
            !tool.isFree &&
            (tool.config?.pricing as string)?.toLowerCase() !== 'free' &&
            (tool.config?.pricing as string)?.toLowerCase() !== 'freemium'
        );
      }
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === 'popular') {
        return b.viewCount - a.viewCount;
      }
      if (sortBy === 'newest') {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === 'featured') {
        if (a.isFeatured !== b.isFeatured) {
          return a.isFeatured ? -1 : 1;
        }
        return b.viewCount - a.viewCount;
      }
      return 0;
    });

    return result;
  }, [initialTools, searchQuery, selectedCategory, selectedPricing, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE) || 1;
  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTools.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTools, currentPage]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPricing('all');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const handlePricingChange = (pricing: 'all' | 'free' | 'freemium' | 'paid') => {
    setSelectedPricing(pricing);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* ── Search & Filter Controls Bar ── */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#070b14] p-4 sm:p-6 shadow-xs space-y-4">
        {/* Top: Search Input + Sorting */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search tools by name, keyword, or capabilities..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-slate-950 dark:focus:border-[#FF8A00] focus:outline-none focus:ring-1 focus:ring-slate-950 dark:focus:ring-[#FF8A00] shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Pricing Tabs + Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Pricing Tabs */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 text-xs shadow-2xs">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'free', label: 'Free' },
                  { id: 'freemium', label: 'Freemium' },
                  { id: 'paid', label: 'Paid' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handlePricingChange(tab.id)}
                  className={`rounded-lg px-2.5 py-1.5 font-medium transition cursor-pointer ${
                    selectedPricing === tab.id
                      ? 'bg-slate-950 text-white dark:bg-[#FF8A00] dark:text-slate-950 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'newest' | 'featured')}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-2xs focus:border-slate-950 dark:focus:border-[#FF8A00] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom: Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'border border-slate-950 bg-slate-950 text-white dark:border-[#FF8A00] dark:bg-[#FF8A00] dark:text-slate-950 font-bold shadow-xs'
                : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white shadow-2xs'
            }`}
          >
            <span>All Tools</span>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 text-[10px] font-mono">
              {initialTools.length}
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'border border-slate-950 bg-slate-950 text-white dark:border-[#FF8A00] dark:bg-[#FF8A00] dark:text-slate-950 font-bold shadow-xs'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white shadow-2xs'
              }`}
            >
              <span>{cat.name}</span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 text-[10px] font-mono">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Active Results Counter & Reset ── */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredTools.length}</span> tools
          {selectedCategory !== 'all' && (
            <span> in <span className="text-[#FF8A00] font-semibold">{categories.find((c) => c.slug === selectedCategory)?.name}</span></span>
          )}
          {selectedPricing !== 'all' && (
            <span> ({selectedPricing})</span>
          )}
        </div>

        {(searchQuery || selectedCategory !== 'all' || selectedPricing !== 'all') && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-orange-600 dark:text-[#FF8A00] hover:underline font-semibold transition cursor-pointer"
          >
            <X className="h-3 w-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* ── Tools Card Grid ── */}
      {filteredTools.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedTools.map((tool) => {
            const isFree = tool.isFree || (tool.config?.pricing as string)?.toLowerCase() === 'free';
            const pricingLabel = (tool.config?.pricing as string) || (isFree ? '100% Free' : 'Freemium');

            return (
              <Link
                key={tool.id}
                href={`/ai-tools/${tool.category.slug}/${tool.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0a0f1d] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl"
              >
                <div>
                  {/* Top Badges */}
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {tool.category.name}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {tool.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-300">
                          <Sparkles className="h-2.5 w-2.5" /> Featured
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
                          isFree
                            ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                            : 'border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {pricingLabel}
                      </span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-[#FF8A00] transition">
                    {tool.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {tool.tagline || tool.description}
                  </p>

                  {/* Tags */}
                  {tool.tags && tool.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {tool.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-400 font-medium font-mono"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    <Eye className="h-3 w-3" />
                    <span>{formatNumber(tool.viewCount)} views</span>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-orange-600 dark:group-hover:text-[#FF8A00] transition">
                    <span>Launch Tool</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* ── Zero-State Message ── */
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0f1d] p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-[#FF8A00] border border-orange-100 dark:border-orange-800/60">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No AI Tools Found</h3>
          <p className="mt-2 mx-auto max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            We couldn't find any tools matching your search criteria. Try adjusting your query or resetting filters.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF8A00] hover:bg-[#ff9e2e] px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* ── Pagination Controls ── */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-8 sm:flex-row">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Page <span className="font-semibold text-slate-900 dark:text-white">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-lg text-xs font-medium transition cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#FF8A00] text-slate-950 font-bold'
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
