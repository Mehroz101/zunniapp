'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  BookOpen,
  Newspaper,
  Bookmark,
  Scale,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { TableOfContents, type TocItem } from '@/components/blog/TableOfContents';

export type ArticleFormatType = 'blog' | 'guide' | 'news' | 'glossary' | 'compare';

export interface PublicArticleData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  type: ArticleFormatType;
  category: string;
  featuredImage?: string;
  tags?: string[];
  authorName?: string;
  seo?: {
    title?: string;
    description?: string;
  };
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface RelatedArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  readingTime: number;
  type: ArticleFormatType;
  createdAt: string;
  featuredImage?: string;
}

interface PublicArticleViewProps {
  article: PublicArticleData;
  relatedArticles?: RelatedArticleItem[];
  tocItems?: TocItem[];
}

const FORMAT_META: Record<
  ArticleFormatType,
  { path: string; shortLabel: string; sectionLabel: string }
> = {
  blog: { path: '/blog', shortLabel: 'Blog', sectionLabel: 'Editorial Blog' },
  guide: { path: '/guides', shortLabel: 'Guides', sectionLabel: 'Technical Guides' },
  news: { path: '/news', shortLabel: 'News', sectionLabel: 'News & Updates' },
  glossary: { path: '/glossary', shortLabel: 'Glossary', sectionLabel: 'AI Glossary' },
  compare: { path: '/compare', shortLabel: 'Compare', sectionLabel: 'Tool Comparisons' },
};

function FormatIcon({ type }: { type: ArticleFormatType }) {
  if (type === 'news') return <Newspaper className="w-3.5 h-3.5" />;
  if (type === 'guide') return <BookOpen className="w-3.5 h-3.5" />;
  if (type === 'glossary') return <Bookmark className="w-3.5 h-3.5" />;
  if (type === 'compare') return <Scale className="w-3.5 h-3.5" />;
  return <FileText className="w-3.5 h-3.5" />;
}

export function PublicArticleView({
  article,
  relatedArticles = [],
  tocItems = [],
}: PublicArticleViewProps) {
  const [copied, setCopied] = useState(false);

  const meta = FORMAT_META[article.type] || FORMAT_META.blog;

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-[#FF8A00]/30 selection:text-slate-950">
      <Navbar />

      <main className="pt-28 sm:pt-36 pb-20">
        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-xs font-mono text-slate-400 dark:text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap"
          >
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
            <Link href={meta.path} className="hover:text-slate-900 dark:hover:text-white transition">
              {meta.shortLabel}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
            <span className="text-[#FF8A00] truncate max-w-[200px] sm:max-w-xs">
              {article.category}
            </span>
          </nav>

          {/* Article Header */}
          <header className="mb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-[#FF8A00] border border-orange-200/80 dark:border-orange-800/60 shadow-xs">
                <FormatIcon type={article.type} />
                <span>{article.category}</span>
              </span>

              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readingTime || 3} min read</span>
              </span>

              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.18] sm:leading-[1.15]">
              {article.title}
            </h1>

            {article.excerpt && article.excerpt !== article.title && (
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Author Lockup & Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 font-bold text-xs text-[#FF8A00]">
                  TY
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {article.authorName || 'TOOLty Editorial Engineering'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Verified Publication
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer shadow-xs"
                  title="Copy link to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Featured Image Banner */}
          {article.featuredImage && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800/90 shadow-xl shadow-slate-200/40 dark:shadow-black/50 bg-slate-100 dark:bg-slate-900 aspect-video relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Body + Optional Table of Contents */}
          <div className={tocItems.length > 0 ? 'grid gap-10 lg:grid-cols-12 mb-16' : 'mb-16'}>
            <div className={tocItems.length > 0 ? 'lg:col-span-8 min-w-0' : 'min-w-0'}>
              <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#070b14] p-6 sm:p-10 shadow-xs">
                <ArticleContent contentMd={article.content} />
              </div>

              {Array.isArray(article.tags) && article.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {tocItems.length > 0 && (
              <aside className="lg:col-span-4">
                <div className="sticky top-28 space-y-6">
                  <TableOfContents items={tocItems} />
                </div>
              </aside>
            )}
          </div>

          {/* Post-Article Callout Banner */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-r from-slate-50 via-orange-500/[0.03] to-slate-50 dark:from-slate-900/60 dark:via-orange-500/[0.05] dark:to-slate-900/60 p-6 sm:p-8 mb-16 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF8A00]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TOOLTY WORKBENCH</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Explore Developer Utilities &amp; Calculators
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
                100% free, zero-latency browser tools for format conversions, syntax analysis, and finance.
              </p>
            </div>
            <Link
              href="/tools"
              className="px-5 py-2.5 rounded-xl bg-[#FF8A00] hover:bg-[#ff9e2e] text-slate-950 text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition shrink-0 cursor-pointer"
            >
              Explore All 50+ Tools
            </Link>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="pt-10 border-t border-slate-200 dark:border-slate-800/80 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  More in {meta.sectionLabel}
                </h3>
                <Link
                  href={meta.path}
                  className="text-xs font-mono text-[#FF8A00] hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((rel) => {
                  const relMeta = FORMAT_META[rel.type] || FORMAT_META.blog;
                  return (
                    <Link
                      key={rel.id}
                      href={`${relMeta.path}/${rel.slug}`}
                      className="group rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 p-4 shadow-2xs hover:border-[#FF8A00]/50 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10.5px] font-mono font-bold text-[#FF8A00] block mb-1.5 uppercase">
                          {rel.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#FF8A00] transition line-clamp-2 leading-snug">
                          {rel.title}
                        </h4>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>{rel.readingTime || 3} min read</span>
                        <span className="text-[#FF8A00] group-hover:translate-x-1 transition-transform">
                          Read →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Link
              href={meta.path}
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to {meta.sectionLabel}</span>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

export default PublicArticleView;
