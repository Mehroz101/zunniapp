import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Sparkles, Newspaper } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogArchivePage() {
  let rawPosts: Array<any> = [];
  let rawCategories: Array<any> = [];

  try {
    // 1. Fetch published posts and active categories directly via Prisma
    [rawPosts, rawCategories] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          contentCategory: true,
          author: true,
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
    console.warn('[BlogArchivePage] Prisma DB query fallback:', (error as Error).message);
  }

  // Fallback to backend API if Prisma was empty or offline
  if (rawPosts.length === 0) {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'https://aiiseverythingback.vercel.app/api';
      const res = await fetch(`${apiUrl}/posts?status=PUBLISHED`, {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          rawPosts = json.data;
        }
      }
    } catch (e) {
      console.warn('[BlogArchivePage] Backend API fallback error:', (e as Error).message);
    }
  }

  // 2. Serialize posts
  const posts: DirectoryPost[] = rawPosts.map((p) => {
    const catName =
      p.category ||
      p.contentCategory?.name ||
      (Array.isArray(p.categories) && p.categories.length > 0 ? p.categories[0] : 'AI News');
    const catSlug = slugify(catName);

    const postTags = Array.isArray(p.tags)
      ? p.tags.map((t: any) =>
          typeof t === 'string'
            ? { id: t, name: t, slug: slugify(t) }
            : { id: t.id || t.name, name: t.name, slug: t.slug || slugify(t.name) }
        )
      : [];

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || '',
      coverImage: p.coverImage || p.ogImage || null,
      contentMd: p.content || p.contentMd || '',
      readingTimeMins: p.readingTimeMins || 3,
      publishedAt: p.publishedAt
        ? typeof p.publishedAt === 'string'
          ? p.publishedAt
          : p.publishedAt.toISOString()
        : p.createdAt
        ? typeof p.createdAt === 'string'
          ? p.createdAt
          : p.createdAt.toISOString()
        : null,
      viewCount: p.viewCount || 0,
      category: {
        id: p.categoryId || catSlug,
        name: catName,
        slug: catSlug,
      },
      author: p.author
        ? {
            id: p.author.id,
            name: p.author.name,
          }
        : {
            id: 'editorial',
            name: 'AIIsEverything Editorial',
          },
      tags: postTags,
    };
  });

  // 3. Serialize categories (derive from DB categories or active posts)
  const categoryMap = new Map<string, DirectoryContentCategory>();

  rawCategories.forEach((c) => {
    categoryMap.set(c.slug, {
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c._count?.posts || 0,
    });
  });

  // Ensure all categories present on published posts exist in filters
  posts.forEach((p) => {
    const existing = categoryMap.get(p.category.slug);
    if (existing) {
      existing.count = Math.max(existing.count, 1);
    } else {
      categoryMap.set(p.category.slug, {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
        count: 1,
      });
    }
  });

  const categories: DirectoryContentCategory[] = Array.from(categoryMap.values());

  // 4. Schema.org JSON-LD
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
      url: `https://aiiseverything.com/blog/${p.slug}`,
      description: p.excerpt,
    })),
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[#FF8A00]/30 selection:text-slate-950">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Navbar />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-28 pb-20">
        {/* Breadcrumb Header */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-6"
        >
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600" />
          <span className="text-slate-900 dark:text-slate-200 font-medium">Blog & Insights</span>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-mono text-slate-700 dark:text-slate-300">
              <Newspaper className="h-3.5 w-3.5 text-[#FF8A00]" />
              AIIsEverything Intelligence Dispatches
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              AI News, Guides &{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
                Technical Insights
              </span>
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Curated intelligence covering frontier artificial intelligence releases, architectural
              breakdowns, production prompt engineering, and deep machine learning tutorials.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{posts.length} Live Articles</span>
            </div>
          </div>
        </div>

        {/* Filter and Article Grid */}
        <section className="pt-10">
          <BlogFilterGrid initialPosts={posts} categories={categories} />
        </section>

        {/* Newsletter CTA Section */}
        <section className="mt-20 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-xs font-mono text-orange-600 dark:text-[#FF8A00] mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#FF8A00]" />
            Direct To Your Inbox
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Stay Ahead of Frontier AI Developments
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
            Join thousands of developers and AI leaders receiving our weekly deep-dive into models,
            tools, and production workflows.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
