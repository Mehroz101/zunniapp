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

export const revalidate = 60; // ISR 60s background refresh

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
  let post: any = null;

  try {
    post = await prisma.post.findUnique({
      where: { slug },
      include: { category: true, author: true, tags: true },
    });
  } catch (err) {
    console.warn('[Blog Metadata] DB fallback:', (err as Error).message);
  }

  if (!post || post.status !== 'PUBLISHED') {
    const fallbackTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${fallbackTitle} | AIIsEverything`,
      description: `Read technical guides and AI intelligence on AIIsEverything.`,
    };
  }

  const seoMeta = (post.seoMeta as {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    keywords?: string[];
    ogImage?: string;
  }) || {};

  const pageTitle = seoMeta.metaTitle || `${post.title} | AIIsEverything`;
  const pageDescription = seoMeta.metaDescription || post.excerpt;
  const canonicalUrl = seoMeta.canonicalUrl || `https://aiiseverything.com/blog/${slug}`;
  const ogImageUrl = post.ogImage || seoMeta.ogImage || '/og-default.png';

  const geoTags = buildGeoMetaTags({
    summary: `${post.title}. ${post.excerpt}`,
    entities: [
      post.title,
      post.category.name,
      'AIIsEverything',
      'Artificial Intelligence',
      ...(seoMeta.keywords || []),
      ...(post.tags || []).map((t: any) => t.name),
    ],
  });

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
      publishedTime: (post.publishedAt || post.createdAt).toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author?.name || 'AIIsEverything Editorial'],
      section: post.category.name,
      tags: (post.tags || []).map((t: any) => t.name),
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

  let post: any = null;
  let relatedPosts: Array<any> = [];

  try {
    // 1. Fetch post from database
    post = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        author: true,
        tags: true,
      },
    });

    if (post && post.status === 'PUBLISHED') {
      // 3. Atomically increment viewCount (fire-and-forget, non-blocking)
      prisma.post
        .update({
          where: { id: post.id },
          data: { viewCount: { increment: 1 } },
        })
        .catch((err) => {
          console.warn('[Post View Increment Error]:', (err as Error).message);
        });

      // 4. Fetch 3 related articles from same category
      relatedPosts = await prisma.post.findMany({
        where: {
          categoryId: post.categoryId,
          id: { not: post.id },
          status: 'PUBLISHED',
        },
        include: {
          category: true,
        },
        orderBy: [{ publishedAt: 'desc' }, { viewCount: 'desc' }],
        take: 3,
      });
    }
  } catch (err) {
    console.warn('[Blog Post Page] DB fallback during build:', (err as Error).message);
  }

  // 2. 404 Not Found handling
  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  // 5. Word count & reading time calculation
  const wordCount = post.contentMd.trim().split(/\s+/).filter(Boolean).length;
  const readingTime =
    post.readingTimeMins > 0 ? post.readingTimeMins : Math.max(1, Math.ceil(wordCount / 200));

  // 6. Extract Table of Contents
  const tocItems = extractHeadings(post.contentMd);

  // 7. Schema.org JSON-LD Generation
  const canonicalUrl = `https://aiiseverything.com/blog/${post.slug}`;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://aiiseverything.com' },
    { name: 'Blog', item: 'https://aiiseverything.com/blog' },
    { name: post.title, item: canonicalUrl },
  ]);

  const articleSchema = buildTechArticleSchema({
    headline: post.title,
    description: post.excerpt,
    url: canonicalUrl,
    imageUrl: post.ogImage || undefined,
    authorName: post.author?.name || 'AIIsEverything Editorial Team',
    publishedAt: (post.publishedAt || post.createdAt).toISOString(),
    modifiedAt: post.updatedAt.toISOString(),
    wordCount,
    articleSection: post.category.name,
    keywords: (post.tags || []).map((t: any) => t.name),
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#00D2FF]/30 selection:text-slate-950 font-sans">
      {/* ── Schema.org JSON-LD Injection ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* ── Fixed Navigation ── */}
      <Navbar />

      <main className="relative pt-28 pb-20">
        {/* ── Ambient Background Glows ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 -top-20 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#00D2FF]/10 to-violet-500/5 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* ── Breadcrumb Navigation ── */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-xs font-medium text-slate-500"
          >
            <Link href="/" className="hover:text-slate-900 transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <Link href="/blog" className="hover:text-slate-900 transition">
              Blog
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-900 font-semibold truncate max-w-[240px] sm:max-w-none">
              {post.title}
            </span>
          </nav>

          {/* ── Article Header Section ── */}
          <header className="mb-12 max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold text-violet-800 shadow-xs">
                <BookOpen className="h-3.5 w-3.5 text-violet-600" />
                <span>{post.category.name}</span>
              </span>

              <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{readingTime} min read</span>
              </span>

              <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </span>

              <span className="flex items-center gap-1 text-xs text-slate-500 font-mono ml-auto">
                <Eye className="h-3.5 w-3.5 text-slate-400" />
                <span>{formatNumber(post.viewCount + 1)} views</span>
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl leading-tight text-slate-950">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-600 font-normal">
              {post.excerpt}
            </p>

            {/* Author Byline & Social Share Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white shadow-md">
                  <User className="h-5 w-5 text-[#00D2FF]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {post.author?.name || 'AIIsEverything Editorial'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {post.author ? 'Staff Researcher & Author' : 'AI Research Desk'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
                  Share:
                </span>
                <ShareButtons title={post.title} url={canonicalUrl} />
              </div>
            </div>
          </header>

          {/* ── Cover Image (if available) ── */}
          {post.ogImage && (
            <div className="mb-12 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl">
              <img
                src={post.ogImage}
                alt={post.title}
                className="h-auto max-h-[500px] w-full object-cover"
              />
            </div>
          )}

          {/* ── Two-Column Layout (Content + Sticky Sidebar) ── */}
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Main Content Area (8 Cols) */}
            <article className="lg:col-span-8 space-y-8">
              {/* Rendered Markdown Body */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs">
                <ArticleContent contentMd={post.contentMd} />
              </div>

              {/* Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <TagIcon className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Topics Covered</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(post.tags || []).map((tag: any) => (
                      <span
                        key={tag.id}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 font-medium hover:border-slate-300 transition"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Post-Article Social Share */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Found this valuable?</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Share this breakdown with your engineering and AI network.
                  </p>
                </div>
                <ShareButtons title={post.title} url={canonicalUrl} />
              </div>
            </article>

            {/* Sticky Sidebar (4 Cols) */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="sticky top-28 space-y-6">
                {/* Table of Contents */}
                {tocItems.length > 0 && <TableOfContents items={tocItems} />}

                {/* Newsletter Card in Sidebar */}
                <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-6 text-center space-y-4 shadow-xs">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white mx-auto shadow-sm">
                    <Sparkles className="h-4 w-4 text-[#00D2FF]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Weekly AI Digest</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Stay ahead of the curve with our curated Sunday intelligence report.
                    </p>
                  </div>
                  <NewsletterForm />
                </div>
              </div>
            </aside>
          </div>

          {/* ── Related Articles Section ── */}
          {relatedPosts.length > 0 && (
            <section className="mt-24 border-t border-slate-200 pt-16">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-700">
                    Read Next
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                    Related in {post.category.name}
                  </h2>
                </div>

                <Link
                  href="/blog"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 transition"
                >
                  <span>All Articles</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <span className="rounded-md border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-800">
                          {rel.category.name}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                          <Clock className="h-3 w-3" /> {rel.readingTimeMins} min read
                        </span>
                      </div>

                      <h3 className="text-base font-bold leading-snug text-slate-900 group-hover:text-indigo-600 transition">
                        {rel.title}
                      </h3>

                      <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700 group-hover:text-indigo-600">
                      <span>Read article</span>
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* ── Semantic Site Footer ── */}
      <Footer />
    </div>
  );
}
