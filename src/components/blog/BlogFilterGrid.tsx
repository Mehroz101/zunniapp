'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  User,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/utils';

export interface DirectoryPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  readingTimeMins: number;
  publishedAt: string | null;
  viewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface DirectoryContentCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface BlogFilterGridProps {
  initialPosts: DirectoryPost[];
  categories: DirectoryContentCategory[];
  defaultCategory?: string;
}

const ITEMS_PER_PAGE = 9;

export function BlogFilterGrid({
  initialPosts,
  categories,
  defaultCategory,
}: BlogFilterGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory || 'all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Sort Logic
  const filteredPosts = useMemo(() => {
    let result = [...initialPosts];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.category.name.toLowerCase().includes(q) ||
          (post.author?.name && post.author.name.toLowerCase().includes(q)) ||
          post.tags.some((t) => t.name.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((post) => post.category.slug === selectedCategory);
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'popular') {
        return b.viewCount - a.viewCount;
      }
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });

    return result;
  }, [initialPosts, searchQuery, selectedCategory, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
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

  return (
    <div className="space-y-8">
      {/* ── Search & Filter Controls Bar ── */}
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-6 shadow-xs space-y-4">
        {/* Top: Instant Search Input + Sort Dropdown */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search articles by title, topic, author, or keyword..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular')}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-950 focus:outline-none cursor-pointer"
            >
              <option value="newest">Recently Published</option>
              <option value="popular">Most Read / Popular</option>
            </select>
          </div>
        </div>

        {/* Bottom: Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              selectedCategory === 'all'
                ? 'border border-slate-950 bg-slate-950 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
            }`}
          >
            <span>All Articles</span>
            <span className="rounded-full bg-slate-100 text-slate-700 px-1.5 py-0.2 text-[10px] font-mono">
              {initialPosts.length}
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                selectedCategory === cat.slug
                  ? 'border border-slate-950 bg-slate-950 text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
              }`}
            >
              <span>{cat.name}</span>
              <span className="rounded-full bg-slate-100 text-slate-700 px-1.5 py-0.2 text-[10px] font-mono">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Active Results Counter & Reset ── */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-900">{filteredPosts.length}</span> articles
          {selectedCategory !== 'all' && (
            <span>
              {' '}
              in{' '}
              <span className="text-orange-600 font-semibold">
                {categories.find((c) => c.slug === selectedCategory)?.name}
              </span>
            </span>
          )}
        </div>

        {(searchQuery || selectedCategory !== 'all') && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold transition cursor-pointer"
          >
            <X className="h-3 w-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* ── Articles Card Grid ── */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              prefetch={true}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
            >
              <div>
                {/* Top Badges */}
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {post.category.name}
                  </span>

                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{post.readingTimeMins} min read</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-orange-600 transition">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-2.5 text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Topic Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 font-medium"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Author + Date + CTA */}
              <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-orange-600" />
                    <span className="truncate max-w-[130px] font-medium text-slate-700">
                      {post.author?.name || 'TOOLty'}
                    </span>
                  </div>

                  {post.publishedAt && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Eye className="h-3 w-3" />
                    <span>{formatNumber(post.viewCount)} views</span>
                  </div>

                  <span className="flex items-center gap-1 font-semibold text-slate-700 group-hover:text-orange-600 transition">
                    <span>Read article</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* ── Zero-State Message ── */
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-100">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Articles Found</h3>
          <p className="mt-2 mx-auto max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed">
            We couldn't find any articles matching your search query. Try adjusting your search term or exploring another category.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-slate-800"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* ── Pagination Controls ── */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <div className="text-xs text-slate-500">
            Page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-30 disabled:pointer-events-none"
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
                  className={`h-8 w-8 rounded-lg text-xs font-medium transition ${
                    currentPage === page
                      ? 'bg-slate-950 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
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
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-30 disabled:pointer-events-none"
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
