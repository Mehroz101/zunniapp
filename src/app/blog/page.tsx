import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Sparkles, Newspaper } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import {
  buildCollectionPageSchema,
  buildBreadcrumbSchema,
  buildGeoMetaTags,
} from '@/lib/seo';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import {
  BlogFilterGrid,
  type DirectoryPost,
  type DirectoryContentCategory,
} from '@/components/blog/BlogFilterGrid';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

export const metadata: Metadata = {
  title: 'Latest AI News, Insights & Guides | AIIsEverything',
  description:
    'Stay ahead with breaking artificial intelligence news, deep technical guides, in-depth tutorials, and frontier LLM reviews. Updated daily for engineers, founders, and creators.',
  alternates: {
    canonical: 'https://aiiseverything.com/blog',
  },
  openGraph: {
    title: 'Latest AI News, Insights & Guides | AIIsEverything',
    description:
      'Daily AI intelligence, machine learning breakdowns, tutorials, and model comparisons.',
    url: 'https://aiiseverything.com/blog',
    siteName: 'AIIsEverything',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest AI News, Insights & Guides | AIIsEverything',
    description: 'Explore the definitive publication for artificial intelligence news and guides.',
    images: ['/og-default.png'],
  },
  other: buildGeoMetaTags({
    summary:
      'The authoritative knowledge base for artificial intelligence developments, model benchmarks, and production workflows.',
    entities: ['AIIsEverything', 'AI News', 'Machine Learning', 'Artificial Intelligence', 'LLM'],
  }),
};

export const revalidate = 60; // 60s ISR refresh

export default async function BlogArchivePage() {
  let rawPosts: Array<any> = [];
  let rawCategories: Array<any> = [];

  try {
    // 1. Fetch published posts and categories
    [rawPosts, rawCategories] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
          author: true,
          tags: true,
        },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.contentCategory.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              posts: {
                where: { status: 'PUBLISHED' },
              },
            },
          },
        },
        orderBy: { displayOrder: 'asc' },
      }),
    ]);
  } catch (error) {
    console.warn('[BlogArchivePage] Prisma DB query fallback during build:', (error as Error).message);
  }

  // 3. Serialize posts
  const posts: DirectoryPost[] = rawPosts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    readingTimeMins: p.readingTimeMins,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    viewCount: p.viewCount,
    category: {
      id: p.category.id,
      name: p.category.name,
      slug: p.category.slug,
    },
    author: p.author
      ? {
          id: p.author.id,
          name: p.author.name,
        }
      : null,
    tags: p.tags.map((tag: any) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
  }));

  // 4. Serialize categories
  const categories: DirectoryContentCategory[] = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    count: c._count.posts,
  }));

  // 5. Schema.org JSON-LD
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://aiiseverything.com' },
    { name: 'Blog', item: 'https://aiiseverything.com/blog' },
  ]);

  const collectionSchema = buildCollectionPageSchema({
    name: 'Latest AI News, Insights & Guides',
    description:
      'Curated intelligence covering artificial intelligence breakthroughs, foundational models, workflows, and machine learning tutorials.',
    url: 'https://aiiseverything.com/blog',
    items: posts.slice(0, 15).map((p) => ({
      name: p.title,
      description: p.excerpt,
      url: `https://aiiseverything.com/blog/${p.slug}`,
    })),
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#00D2FF]/30 selection:text-slate-950 font-sans">
      {/* ── Schema.org JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* ── Fixed Navigation ── */}
      <Navbar />

      <main className="relative pt-28 pb-20">
        {/* ── Ambient Background Glows ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 -top-20 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#00D2FF]/10 to-violet-500/5 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ── Breadcrumb Navigation ── */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-xs font-medium text-slate-500"
          >
            <Link href="/" className="hover:text-slate-900 transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-900 font-semibold">Blog Archive</span>
          </nav>

          {/* ── Hero Archive Header ── */}
          <div className="mb-12 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold text-violet-800 shadow-xs">
              <Newspaper className="h-3.5 w-3.5 text-violet-600" />
              <span>AI Intelligence & Editorial</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl text-slate-950">
              Latest AI{' '}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-[#0092c7] bg-clip-text text-transparent">
                News, Insights & Guides
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Explore breaking reports, frontier model comparisons, and technical tutorials designed to keep you at the cutting edge of artificial intelligence.
            </p>
          </div>

          {/* ── Blog Filter, Search & Card Grid ── */}
          <BlogFilterGrid initialPosts={posts} categories={categories} />

          {/* ── Newsletter Section ── */}
          <section className="mt-24 rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-8 sm:p-12 text-center shadow-xs">
            <div className="mx-auto max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs mb-4">
                <Sparkles className="h-3.5 w-3.5 text-[#0092c7]" />
                <span>Stay Ahead in AI</span>
              </span>
              <h2 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">
                Get Weekly AI Intelligence Directly
              </h2>
              <p className="mt-2 mb-6 text-xs sm:text-sm text-slate-600">
                Join our Sunday briefing featuring curated research papers, open-source models, and actionable implementation guides.
              </p>
              <NewsletterForm />
            </div>
          </section>
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
