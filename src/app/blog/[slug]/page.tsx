import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  User,
  ArrowRight,
  Sparkles,
  Tag as TagIcon,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatDate, slugify, formatNumber } from '@/lib/utils';
import {
  buildTechArticleSchema,
  buildBreadcrumbSchema,
  buildGeoMetaTags,
} from '@/lib/seo';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { TableOfContents, type TocItem } from '@/components/blog/TableOfContents';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper to fetch post by slug via Prisma with backend API fallback
async function fetchPostBySlug(slug: string) {
  let post: any = null;

  try {
    post = await prisma.post.findUnique({
      where: { slug },
      include: {
        contentCategory: true,
        author: true,
      },
    });

    if (!post) {
      post = await prisma.post
        .findUnique({
          where: { id: slug },
          include: {
            contentCategory: true,
            author: true,
          },
        })
        .catch(() => null);
    }
  } catch (err) {
    console.warn('[fetchPostBySlug] Prisma DB fetch failed:', (err as Error).message);
  }

  // Fallback to backend API
  if (!post) {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'https://aiiseverythingback.vercel.app/api';
      const res = await fetch(`${apiUrl}/posts/${slug}`, {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          post = json.data;
        }
      }
    } catch (e) {
      console.warn('[fetchPostBySlug] Backend API fallback failed:', (e as Error).message);
    }
  }

  return post;
}

// ── Extract headings for the Table of Contents ──
function extractHeadings(markdown: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const text = rawText.replace(/[*_`]/g, '');
    const id = slugify(text);
    if (id) {
      items.push({ id, text, level });
    }
  }
  return items;
}

// ─────────────────────────────────────────────
// Dynamic SEO, AEO & OpenGraph Generation
// ─────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post || post.status !== 'PUBLISHED') {
    const fallbackTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${fallbackTitle} | AIIsEverything`,
      description: `Read technical guides and AI intelligence on AIIsEverything.`,
    };
  }

  const seoMeta = (post.seoMeta as {
    metaTitle?: string;
    title?: string;
    metaDescription?: string;
    description?: string;
    canonicalUrl?: string;
    canonical?: string;
    keywords?: string[];
    ogImage?: string;
  }) || {};

  const pageTitle =
    seoMeta.metaTitle || seoMeta.title || `${post.title} | AIIsEverything`;
  const pageDescription =
    seoMeta.metaDescription || seoMeta.description || post.excerpt;
  const canonicalUrl =
    seoMeta.canonicalUrl || seoMeta.canonical || `https://aiiseverything.com/blog/${slug}`;
  const ogImageUrl =
    post.coverImage || post.ogImage || seoMeta.ogImage || '/og-default.png';

  const categoryName =
    typeof post.category === 'string'
      ? post.category
      : post.category?.name || post.contentCategory?.name || 'AI News';

  const tagsList: string[] = Array.isArray(post.tags)
    ? post.tags.map((t: any) => (typeof t === 'string' ? t : t.name || ''))
    : [];

  const geoTags = buildGeoMetaTags({
    summary: `${post.title}. ${post.excerpt || ''}`,
    entities: [
      post.title,
      categoryName,
      'AIIsEverything',
      'Artificial Intelligence',
      ...(seoMeta.keywords || []),
      ...tagsList,
    ],
  });

  const pubDate = post.publishedAt
    ? typeof post.publishedAt === 'string'
      ? new Date(post.publishedAt)
      : post.publishedAt
    : post.createdAt
    ? typeof post.createdAt === 'string'
      ? new Date(post.createdAt)
      : post.createdAt
    : new Date();

  const modDate = post.updatedAt
    ? typeof post.updatedAt === 'string'
      ? new Date(post.updatedAt)
      : post.updatedAt
    : pubDate;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: 'AIIsEverything',
      type: 'article',
      publishedTime: pubDate.toISOString(),
      modifiedTime: modDate.toISOString(),
      authors: [post.author?.name || 'AIIsEverything Editorial'],
      section: categoryName,
      tags: tagsList,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
    },
    other: geoTags,
  };
}

// ─────────────────────────────────────────────
// Dynamic Article Route Page Component
// ─────────────────────────────────────────────
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  // 2. 404 Not Found handling
  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  // Fire-and-forget viewCount increment
  if (post.id) {
    prisma.post
      .update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {});
  }

  const categoryName =
    typeof post.category === 'string'
      ? post.category
      : post.category?.name || post.contentCategory?.name || 'AI News';
  const categorySlug = slugify(categoryName);

  // Fetch related articles from same category
  let relatedPosts: Array<any> = [];
  try {
    relatedPosts = await prisma.post.findMany({
      where: {
        id: { not: post.id },
        status: 'PUBLISHED',
        OR: [
          { category: categoryName },
          { categories: { has: categoryName } },
          ...(post.categoryId ? [{ categoryId: post.categoryId }] : []),
        ],
      },
      include: { contentCategory: true },
      orderBy: [{ publishedAt: 'desc' }, { viewCount: 'desc' }],
      take: 3,
    });
  } catch {}

  const contentText = post.content || post.contentMd || '';
  const wordCount = contentText.trim().split(/\s+/).filter(Boolean).length;
  const readingTime =
    post.readingTimeMins > 0 ? post.readingTimeMins : Math.max(1, Math.ceil(wordCount / 200));

  const tocItems = extractHeadings(contentText);
  const canonicalUrl = `https://aiiseverything.com/blog/${post.slug}`;
  const bannerImage = post.coverImage || post.ogImage || null;

  const pubDate = post.publishedAt
    ? typeof post.publishedAt === 'string'
      ? post.publishedAt
      : post.publishedAt.toISOString()
    : post.createdAt
    ? typeof post.createdAt === 'string'
      ? post.createdAt
      : post.createdAt.toISOString()
    : new Date().toISOString();

  // JSON-LD Schemas
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://aiiseverything.com' },
    { name: 'Blog', item: 'https://aiiseverything.com/blog' },
    { name: categoryName, item: `https://aiiseverything.com/blog?category=${categorySlug}` },
    { name: post.title, item: canonicalUrl },
  ]);

  const articleSchema = buildTechArticleSchema({
    headline: post.title,
    description: post.excerpt || '',
    url: canonicalUrl,
    publishedAt: pubDate,
    modifiedAt: post.updatedAt
      ? typeof post.updatedAt === 'string'
        ? post.updatedAt
        : post.updatedAt.toISOString()
      : pubDate,
    authorName: post.author?.name || 'AIIsEverything Editorial',
    imageUrl: bannerImage || 'https://aiiseverything.com/og-default.png',
    articleSection: categoryName,
    keywords: Array.isArray(post.tags)
      ? post.tags.map((t: any) => (typeof t === 'string' ? t : t.name))
      : [],
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-200">
      {/* ── JSON-LD Structured Data Injection ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Navbar />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-28 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-8 overflow-x-auto whitespace-nowrap"
          >
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600 shrink-0" />
            <Link href="/blog" className="hover:text-slate-900 dark:hover:text-white transition">
              Blog
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600 shrink-0" />
            <Link
              href={`/blog?category=${categorySlug}`}
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              {categoryName}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600 shrink-0" />
            <span className="text-slate-900 dark:text-slate-200 font-medium truncate max-w-[200px] sm:max-w-xs">
              {post.title}
            </span>
          </nav>

          {/* Article Header */}
          <header className="space-y-6 pb-10 border-b border-slate-200 dark:border-slate-800">
            {/* Category & Status Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={`/blog?category=${categorySlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-50 dark:bg-indigo-950/40 text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 transition"
              >
                <BookOpen className="h-3 w-3" />
                {categoryName}
              </Link>

              <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                {readingTime} min read
              </span>

              <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                <Eye className="h-3 w-3" />
                {formatNumber(post.viewCount || 0)} views
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
              {post.title}
            </h1>

            {/* Excerpt / Lead */}
            {post.excerpt && (
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                {post.excerpt}
              </p>
            )}

            {/* Author & Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 dark:bg-slate-800 text-white font-semibold text-xs border border-slate-800">
                  {post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'AI'}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {post.author?.name || 'AIIsEverything Editorial'}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Published {formatDate(pubDate)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ShareButtons title={post.title} url={canonicalUrl} />
              </div>
            </div>
          </header>

          {/* Cover Art Banner (if present) */}
          {bannerImage && (
            <div className="my-10 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-xl">
              <img
                src={bannerImage}
                alt={post.title}
                className="h-auto max-h-[500px] w-full object-cover"
              />
            </div>
          )}

          {/* Article Layout (Content + Sticky Table of Contents) */}
          <div className="pt-10 grid gap-12 lg:grid-cols-12">
            {/* Main Content Body */}
            <article className="lg:col-span-8 space-y-8">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] p-6 sm:p-10 shadow-xs">
                <ArticleContent contentMd={contentText} />
              </div>

              {/* Tags Section */}
              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    <TagIcon className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Topics Covered</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: any) => {
                      const tagName = typeof tag === 'string' ? tag : tag.name;
                      return (
                        <span
                          key={tagName}
                          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 text-xs text-slate-700 dark:text-slate-300 font-medium hover:border-slate-300 transition"
                        >
                          #{tagName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Social Share Callout */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 p-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Found this analysis valuable?
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Share this breakdown with your engineering and AI team.
                  </p>
                </div>
                <ShareButtons title={post.title} url={canonicalUrl} />
              </div>
            </article>

            {/* Sticky Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="sticky top-28 space-y-6">
                {tocItems.length > 0 && <TableOfContents items={tocItems} />}

                {/* Newsletter Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-900/20 p-6 text-center space-y-4 shadow-xs">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 dark:bg-slate-800 text-white mx-auto shadow-sm">
                    <Sparkles className="h-4 w-4 text-[#00D2FF]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Weekly AI Intelligence
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Frontier model evaluations and tools delivered weekly.
                    </p>
                  </div>
                  <NewsletterForm />
                </div>
              </div>
            </aside>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <section className="mt-24 border-t border-slate-200 dark:border-slate-800 pt-16">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-400">
                    Recommended Reading
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">
                    Related Articles in {categoryName}
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition"
                >
                  <span>All Articles</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map((rel) => {
                  const relCatName =
                    rel.category || rel.contentCategory?.name || 'AI News';
                  return (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.slug}`}
                      className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs transition hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700"
                    >
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="rounded-md border border-violet-200 dark:border-violet-900/60 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 text-[11px] font-semibold text-violet-800 dark:text-violet-300">
                            {relCatName}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                            <Clock className="h-3 w-3" /> {rel.readingTimeMins || 3} min
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition line-clamp-2">
                          {rel.title}
                        </h3>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {rel.excerpt}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-500">
                        <span>Read article</span>
                        <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
