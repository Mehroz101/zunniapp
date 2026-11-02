import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, ChevronRight, Layers, Zap } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import {
  buildCollectionPageSchema,
  buildBreadcrumbSchema,
  buildGeoMetaTags,
} from '@/lib/seo';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import {
  ToolsFilterGrid,
  type DirectoryTool,
  type DirectoryCategory,
} from '@/components/tools/ToolsFilterGrid';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { getToolBySlug, getAllTools } from '@/lib/tools/registry';
import { ToolView } from '@/components/tools/ToolView';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;

  // 1. Check if slug matches a tool directly
  const tool = getToolBySlug(slug);
  if (tool) {
    const title = `${tool.name} — Free Online Tool | TOOLty`;
    const description = tool.tagline || tool.description;
    const canonicalUrl = `https://toolty.online/ai-tools/${tool.slug}`;
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'TOOLty',
        images: [{ url: '/og-default.png', width: 1200, height: 630 }],
        type: 'website',
      },
      twitter: { card: 'summary_large_image', title, description, images: ['/og-default.png'] },
    };
  }

  // 2. Otherwise check category
  const category = await prisma.toolCategory.findUnique({
    where: { slug },
  });

  if (!category || !category.isActive) {
    return {
      title: 'Category Not Found | TOOLty',
      description: 'The requested AI tools category could not be found.',
    };
  }

  const title = `${category.name} AI Tools — Free & Interactive Directory | TOOLty`;
  const description =
    category.description ||
    `Browse our complete collection of ${category.name} AI tools and utilities. Interactive, free, and updated daily.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://toolty.online/ai-tools/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://toolty.online/ai-tools/${slug}`,
      siteName: 'TOOLty',
      images: [{ url: '/og-default.png', width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-default.png'],
    },
    other: buildGeoMetaTags({
      summary: `${category.name} AI tools directory on TOOLty. ${description}`,
      entities: [category.name, 'AI Tools', 'TOOLty', 'Artificial Intelligence'],
    }),
  };
}

export default async function CategoryToolsPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  // 1. Check if param is an individual tool slug
  const matchedTool = getToolBySlug(categorySlug);
  if (matchedTool) {
    let dbTool: any = null;
    try {
      dbTool = await prisma.tool.findUnique({
        where: { slug: matchedTool.slug },
        include: { category: true },
      });
    } catch {}

    const allTools = getAllTools();
    const relatedTools = allTools
      .filter((t) => t.slug !== matchedTool.slug)
      .slice(0, 3);

    return (
      <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[#FF8A00]/30 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ToolView
              tool={matchedTool}
              seoContent={dbTool?.seoContent}
              relatedTools={relatedTools}
            />
            <div className="mt-20 text-center max-w-xl mx-auto">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Stay Updated</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Subscribe to get notifications when new developer compilers and SEO diagnostic engines go live.
              </p>
              <div className="mt-6">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. Fetch current category
  const currentCategory = await prisma.toolCategory.findUnique({
    where: { slug: categorySlug },
  });

  if (!currentCategory || !currentCategory.isActive) {
    notFound();
  }

  // 2. Fetch all published tools
  const rawTools = await prisma.tool.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      category: true,
      tags: true,
    },
    orderBy: [{ isFeatured: 'desc' }, { viewCount: 'desc' }],
  });

  // 3. Fetch all active categories with counts
  const rawCategories = await prisma.toolCategory.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          tools: {
            where: { status: 'PUBLISHED' },
          },
        },
      },
    },
    orderBy: { displayOrder: 'asc' },
  });

  // 4. Serialize tools for client component
  const tools: DirectoryTool[] = rawTools.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    tagline: t.tagline,
    description: t.description,
    renderType: t.renderType,
    isFeatured: t.isFeatured,
    isFree: t.isFree,
    viewCount: t.viewCount,
    publishedAt: t.publishedAt ? t.publishedAt.toISOString() : null,
    config: (t.config as Record<string, unknown>) || {},
    category: {
      id: t.category.id,
      name: t.category.name,
      slug: t.category.slug,
      icon: t.category.icon,
    },
    tags: t.tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
  }));

  // 5. Serialize categories
  const categories: DirectoryCategory[] = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    count: c._count.tools,
  }));

  // 6. Schema.org JSON-LD
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://toolty.online' },
    { name: 'AI Tools', item: 'https://toolty.online/ai-tools' },
    {
      name: currentCategory.name,
      item: `https://toolty.online/ai-tools/${currentCategory.slug}`,
    },
  ]);

  const collectionSchema = buildCollectionPageSchema({
    name: `${currentCategory.name} AI Tools Directory`,
    description:
      currentCategory.description ||
      `Explore curated ${currentCategory.name} artificial intelligence tools and utilities.`,
    url: `https://toolty.online/ai-tools/${currentCategory.slug}`,
    items: tools
      .filter((t) => t.category.slug === currentCategory.slug)
      .slice(0, 20)
      .map((t) => ({
        name: t.name,
        description: t.tagline,
        url: `https://toolty.online/ai-tools/${t.category.slug}/${t.slug}`,
      })),
  });

  return (
    <div className="min-h-screen bg-[#060614] text-white selection:bg-indigo-500 selection:text-white">
      {/* ── Schema.org JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* ── Navigation ── */}
      <Navbar />

      <main className="relative pt-24 pb-20">
        {/* ── Background Glow ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[130px]" />
          <div className="absolute right-10 top-60 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {/* ── Breadcrumb ── */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-xs font-medium text-white/50"
          >
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-white/30" />
            <Link href="/ai-tools" className="hover:text-white transition">
              AI Tools
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-white/30" />
            <span className="text-white">{currentCategory.name}</span>
          </nav>

          {/* ── Category Header ── */}
          <div className="mb-12 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
              <Layers className="h-3.5 w-3.5" />
              <span>Category Directory</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white">
              {currentCategory.name}{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                AI Tools
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white/60 leading-relaxed">
              {currentCategory.description ||
                `Browse all verified and free ${currentCategory.name.toLowerCase()} tools and utilities.`}
            </p>
          </div>

          {/* ── Interactive Filter & Search Grid ── */}
          <ToolsFilterGrid
            initialTools={tools}
            categories={categories}
            defaultCategory={currentCategory.slug}
          />

          {/* ── Newsletter Section ── */}
          <section className="mt-24 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-8 sm:p-12 text-center">
            <div className="mx-auto max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Never Miss a New Tool</span>
              </span>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Get Fresh AI Tools In Your Inbox
              </h2>
              <p className="mt-2 mb-6 text-xs sm:text-sm text-white/50">
                Join our newsletter to receive curated breakdowns of newly discovered and newly launched AI tools every week.
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
