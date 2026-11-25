import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { Sparkles, ChevronRight, Layers } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import {
  buildCollectionPageSchema,
  buildBreadcrumbSchema,
  buildGeoMetaTags,
  getCanonicalSiteUrl,
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

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STATIC_CATEGORY_FALLBACKS: Record<string, { name: string; description: string }> = {
  coding: {
    name: 'Code Converters & Transpilers',
    description: 'AST transcoders, formatters, schema generators, and strict type compilers.',
  },
  dev: {
    name: 'Developer Utilities',
    description: 'Code formatters, transpilers, token parsers, and regex workbenches.',
  },
  seo: {
    name: 'SEO & Structured Data Builders',
    description: 'Robots.txt generators, XML sitemap builders, JSON-LD schemas, and SERP auditors.',
  },
  text: {
    name: 'AI Models & Neural Utilities',
    description: 'Prompt optimizers, text analyzers, readability checkers, and AI utilities.',
  },
  writing: {
    name: 'Developer Text & NLP Tools',
    description: 'Markdown editors, prompt compilers, and technical writing helpers.',
  },
  data: {
    name: 'Data Pipeline & Schema Converters',
    description: 'JSON, CSV, YAML, XML, and structured data format converters.',
  },
  security: {
    name: 'Security & Cryptography',
    description: 'Zero-log JWT decoders, hash generators, and browser-native security utilities.',
  },
  image: {
    name: 'Vision AI & Graphics Pipeline',
    description: 'SVG optimizers, color converters, and vector JSX components.',
  },
};

async function resolveCategoryMeta(slug: string) {
  try {
    const dbCat = await prisma.toolCategory.findUnique({ where: { slug } });
    if (dbCat && dbCat.isActive) {
      return {
        id: dbCat.id,
        name: dbCat.name,
        slug: dbCat.slug,
        description: dbCat.description || undefined,
      };
    }
  } catch {
    // Fall back gracefully if MongoDB is unavailable
  }

  const staticCat = STATIC_CATEGORY_FALLBACKS[slug.toLowerCase()];
  if (staticCat) {
    return {
      id: `cat-${slug}`,
      name: staticCat.name,
      slug: slug.toLowerCase(),
      description: staticCat.description,
    };
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const siteUrl = getCanonicalSiteUrl();

  const matchedTool = getToolBySlug(slug);
  if (matchedTool) {
    return {
      title: `${matchedTool.name} — Free Online Tool`,
      description: matchedTool.tagline || matchedTool.description,
      alternates: { canonical: `${siteUrl}/tools/${matchedTool.slug}` },
    };
  }

  const category = await resolveCategoryMeta(slug);
  if (!category) {
    return {
      title: 'Category Not Found | TOOLty',
      description: 'The requested AI tools category could not be found.',
    };
  }

  const title = `${category.name} — Free Browser Tools Directory`;
  const description =
    category.description ||
    `Browse our curated collection of free ${category.name} developer and AI utilities.`;
  const canonicalUrl = `${siteUrl}/ai-tools/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} | TOOLty`,
      description,
      url: canonicalUrl,
      siteName: 'TOOLty',
      images: [{ url: `${siteUrl}/icon.svg`, width: 512, height: 512 }],
      type: 'website',
    },
    other: buildGeoMetaTags({
      summary: `${category.name} tools directory on TOOLty. ${description}`,
      entities: [category.name, 'AI Tools', 'TOOLty', 'Developer Utilities'],
    }),
  };
}

export default async function CategoryToolsPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const siteUrl = getCanonicalSiteUrl();

  // Enforce single canonical tool URL: /tools/[slug]
  const matchedTool = getToolBySlug(categorySlug);
  if (matchedTool) {
    permanentRedirect(`/tools/${matchedTool.slug}`);
  }

  const currentCategory = await resolveCategoryMeta(categorySlug);
  if (!currentCategory) {
    notFound();
  }

  let dbTools: Array<any> = [];
  let dbCategories: Array<any> = [];
  try {
    [dbTools, dbCategories] = await Promise.all([
      prisma.tool.findMany({
        where: { status: 'PUBLISHED' },
        include: { category: true, tags: true },
        orderBy: [{ isFeatured: 'desc' }, { viewCount: 'desc' }],
      }),
      prisma.toolCategory.findMany({
        where: { isActive: true },
        include: { _count: { select: { tools: { where: { status: 'PUBLISHED' } } } } },
        orderBy: { displayOrder: 'asc' },
      }),
    ]);
  } catch {
    // Fallback seamlessly to built-in registry
  }

  const toolsMap = new Map<string, DirectoryTool>();
  for (const reg of getAllTools()) {
    const catSlug = reg.categorySlug || reg.category || 'dev';
    const catName =
      STATIC_CATEGORY_FALLBACKS[catSlug]?.name || reg.categoryName || 'Developer Utilities';
    toolsMap.set(reg.slug, {
      id: reg.id,
      name: reg.name,
      slug: reg.slug,
      tagline: reg.tagline,
      description: reg.description,
      renderType: 'CLIENT_SIDE',
      isFeatured: false,
      isFree: true,
      viewCount: 0,
      publishedAt: null,
      config: { pricing: '100% Free' },
      category: {
        id: `cat-${catSlug}`,
        name: catName,
        slug: catSlug,
      },
      tags: (reg.seoKeywords || []).slice(0, 3).map((kw) => ({
        id: kw,
        name: kw,
        slug: kw.toLowerCase().replace(/\s+/g, '-'),
      })),
    });
  }

  for (const t of dbTools) {
    if (!t.slug) continue;
    toolsMap.set(t.slug, {
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
        id: t.category?.id || `cat-${t.category?.slug || 'dev'}`,
        name: t.category?.name || 'Developer Utilities',
        slug: t.category?.slug || 'dev',
        icon: t.category?.icon,
      },
      tags: (t.tags || []).map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      })),
    });
  }

  const tools = Array.from(toolsMap.values());

  const categoryCountMap = new Map<string, DirectoryCategory>();
  dbCategories.forEach((c) => {
    categoryCountMap.set(c.slug, {
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c._count?.tools || 0,
    });
  });

  tools.forEach((t) => {
    const existing = categoryCountMap.get(t.category.slug);
    if (existing) {
      existing.count += 1;
    } else {
      categoryCountMap.set(t.category.slug, {
        id: t.category.id,
        name: t.category.name,
        slug: t.category.slug,
        count: 1,
      });
    }
  });

  if (!categoryCountMap.has(currentCategory.slug)) {
    categoryCountMap.set(currentCategory.slug, {
      id: currentCategory.id,
      name: currentCategory.name,
      slug: currentCategory.slug,
      count: 0,
    });
  }

  const categories = Array.from(categoryCountMap.values());

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: siteUrl },
    { name: 'AI Tools', item: `${siteUrl}/ai-tools` },
    { name: currentCategory.name, item: `${siteUrl}/ai-tools/${currentCategory.slug}` },
  ]);

  const collectionSchema = buildCollectionPageSchema({
    name: `${currentCategory.name} Directory`,
    description:
      currentCategory.description ||
      `Explore curated ${currentCategory.name} developer and AI utilities.`,
    url: `${siteUrl}/ai-tools/${currentCategory.slug}`,
    items: tools
      .filter((t) => t.category.slug === currentCategory.slug)
      .slice(0, 20)
      .map((t) => ({
        name: t.name,
        description: t.tagline,
        url: `${siteUrl}/tools/${t.slug}`,
      })),
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Navbar />

      <main className="relative pt-28 sm:pt-32 pb-20 flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400"
          >
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <Link href="/ai-tools" className="hover:text-slate-900 dark:hover:text-white transition">
              AI Tools
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="text-slate-900 dark:text-white font-semibold">
              {currentCategory.name}
            </span>
          </nav>

          <div className="mb-12 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-mono font-semibold text-orange-600 dark:text-[#FF8A00]">
              <Layers className="h-3.5 w-3.5" />
              <span>Category Directory</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-slate-950 dark:text-white">
              {currentCategory.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentCategory.description ||
                `Browse all free ${currentCategory.name.toLowerCase()} developer and AI utilities.`}
            </p>
          </div>

          <ToolsFilterGrid
            initialTools={tools}
            categories={categories}
            defaultCategory={currentCategory.slug}
          />

          <section className="mt-20 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-8 sm:p-12 text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-mono text-orange-600 dark:text-[#FF8A00] mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Never Miss a New Tool</span>
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Get Fresh Developer Tools Weekly
            </h2>
            <p className="mt-2 mb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Join developers receiving updates on newly launched browser compilers and SEO utilities.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
