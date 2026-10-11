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

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export const revalidate = 60; // 60s ISR refresh

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  let category: any = null;

  try {
    category = await prisma.toolCategory.findUnique({
      where: { slug },
    });
  } catch (err) {
    console.warn('[Category Metadata] DB fallback:', (err as Error).message);
  }

  const categoryName = category?.name || slug.charAt(0).toUpperCase() + slug.slice(1);
  const title = `${categoryName} AI Tools — Free & Interactive Directory | AIIsEverything`;
  const description =
    category?.description ||
    `Browse our complete collection of ${categoryName} AI tools and utilities. Interactive, free, and updated daily.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://aiiseverything.com/ai-tools/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://aiiseverything.com/ai-tools/${slug}`,
      siteName: 'AIIsEverything',
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
      summary: `${categoryName} AI tools directory on AIIsEverything. ${description}`,
      entities: [categoryName, 'AI Tools', 'AIIsEverything', 'Artificial Intelligence'],
    }),
  };
}

export default async function CategoryToolsPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  let currentCategory: any = null;
  let rawTools: Array<any> = [];
  let rawCategories: Array<any> = [];

  try {
    // 1. Fetch current category
    currentCategory = await prisma.toolCategory.findUnique({
      where: { slug: categorySlug },
    });

    // 2. Fetch all published tools
    rawTools = await prisma.tool.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        tags: true,
      },
      orderBy: [{ isFeatured: 'desc' }, { viewCount: 'desc' }],
    });

    // 3. Fetch all active categories with counts
    rawCategories = await prisma.toolCategory.findMany({
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
  } catch (err) {
    console.warn('[Category Page] DB fallback during build:', (err as Error).message);
  }

  if (!currentCategory) {
    currentCategory = {
      id: categorySlug,
      name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
      slug: categorySlug,
      description: `Explore top ${categorySlug} artificial intelligence tools.`,
      isActive: true,
    };
  }

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
    tags: (t.tags || []).map((tag: any) => ({
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
    { name: 'Home', item: 'https://aiiseverything.com' },
    { name: 'AI Tools', item: 'https://aiiseverything.com/ai-tools' },
    {
      name: currentCategory.name,
      item: `https://aiiseverything.com/ai-tools/${currentCategory.slug}`,
    },
  ]);

  const collectionSchema = buildCollectionPageSchema({
    name: `${currentCategory.name} AI Tools Directory`,
    description:
      currentCategory.description ||
      `Explore curated ${currentCategory.name} artificial intelligence tools and utilities.`,
    url: `https://aiiseverything.com/ai-tools/${currentCategory.slug}`,
    items: tools
      .filter((t) => t.category.slug === currentCategory.slug)
      .slice(0, 20)
      .map((t) => ({
        name: t.name,
        description: t.tagline,
        url: `https://aiiseverything.com/ai-tools/${t.category.slug}/${t.slug}`,
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

          {/* ── Interactive Client-Side Filter & Search Grid ── */}
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
