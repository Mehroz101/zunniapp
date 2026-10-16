import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import {
  buildSoftwareApplicationSchema,
  buildBreadcrumbSchema,
  buildGeoMetaTags,
} from '@/lib/seo';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { ToolView } from '@/components/tools/ToolView';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

import { getToolBySlug, getAllTools } from '@/lib/tools/registry';
import { ToolDefinition } from '@/lib/tools/types';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ─────────────────────────────────────────────
// Dynamic SEO, AEO & OpenGraph Generation
// ─────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  let tool: any = null;

  try {
    tool = await prisma.tool.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch (err) {
    console.warn('[Tool Metadata] DB fallback:', (err as Error).message);
  }

  if (!tool || tool.status !== 'PUBLISHED' || tool.category?.slug !== category) {
    const reg = getToolBySlug(slug);
    if (reg) {
      return {
        title: `${reg.name} — Free Online Tool | AIIsEverything`,
        description: reg.tagline || reg.description,
        alternates: {
          canonical: `https://aiiseverything.com/ai-tools/${category}/${slug}`,
        },
      };
    }
    const fallbackTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${fallbackTitle} — Free AI Tool | AIIsEverything`,
      description: `Run the free ${fallbackTitle} browser tool with instant execution.`,
    };
  }

  const seoMeta = (tool.seoMeta as {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    keywords?: string[];
    ogImage?: string;
  }) || {};

  const pageTitle = seoMeta.metaTitle || `${tool.name} — Free AI Tool | AIIsEverything`;
  const pageDescription = seoMeta.metaDescription || tool.tagline || tool.description;
  const canonicalUrl =
    seoMeta.canonicalUrl || `https://aiiseverything.com/ai-tools/${category}/${slug}`;
  const ogImageUrl = tool.ogImage || seoMeta.ogImage || '/og-default.png';

  const geoTags = buildGeoMetaTags({
    summary: `${tool.name} is a high-performance ${tool.isFree ? 'free ' : ''}AI tool in the ${tool.category.name} category. ${tool.description}`,
    entities: [
      tool.name,
      tool.category.name,
      'AIIsEverything',
      'AI Tool',
      'Artificial Intelligence',
      ...(seoMeta.keywords || []),
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
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
      type: 'website',
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
// Dynamic Tool Route Page Component
// ─────────────────────────────────────────────
export default async function ToolExecutionPage({ params }: PageProps) {
  const { category, slug } = await params;

  let tool: any = null;
  let relatedTools: Array<any> = [];

  try {
    // 1. Fetch tool from MongoDB via Prisma
    tool = await prisma.tool.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
      },
    });

    if (tool && tool.status === 'PUBLISHED') {
      // 3. Atomically increment viewCount (fire-and-forget)
      prisma.tool
        .update({
          where: { id: tool.id },
          data: { viewCount: { increment: 1 } },
        })
        .catch((err) => {
          console.warn('[Tool View Increment Error]:', (err as Error).message);
        });

      // 4. Fetch related tools from the same category
      relatedTools = await prisma.tool.findMany({
        where: {
          categoryId: tool.categoryId,
          id: { not: tool.id },
          status: 'PUBLISHED',
        },
        include: {
          category: true,
        },
        orderBy: [{ isFeatured: 'desc' }, { viewCount: 'desc' }],
        take: 3,
      });
    }
  } catch (err) {
    console.warn('[Tool Detail Page] DB fallback during build:', (err as Error).message);
  }

  // 2. 404 Fallback
  if (!tool || tool.status !== 'PUBLISHED' || tool.category?.slug !== category) {
    const reg = getToolBySlug(slug);
    if (reg) {
      tool = {
        id: reg.id,
        name: reg.name,
        slug: reg.slug,
        tagline: reg.tagline,
        description: reg.description,
        isFeatured: true,
        isFree: true,
        viewCount: 1420,
        renderType: 'CLIENT_SIDE',
        status: 'PUBLISHED',
        config: {
          component: reg.slug,
          features: reg.features,
        },
        category: {
          id: `cat-${reg.category}`,
          name: reg.categoryName,
          slug: category || reg.categorySlug,
        },
        tags: reg.seoKeywords.map((k) => ({ id: k, name: k })),
      };
    } else {
      notFound();
    }
  }

  // 5. Schema.org JSON-LD Generation
  const canonicalUrl = `https://aiiseverything.com/ai-tools/${tool.category.slug}/${tool.slug}`;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://aiiseverything.com' },
    { name: 'AI Tools', item: 'https://aiiseverything.com/ai-tools' },
    {
      name: tool.category.name,
      item: `https://aiiseverything.com/ai-tools/${tool.category.slug}`,
    },
    { name: tool.name, item: canonicalUrl },
  ]);

  const toolConfig = (tool.config as Record<string, unknown>) || {};
  const featuresList = (toolConfig.features as string[]) || [
    'Zero-latency client-side processing',
    'Real-time output rendering',
    'Browser-based copy to clipboard',
    'Responsive desktop and mobile support',
  ];

  const softwareAppSchema = buildSoftwareApplicationSchema({
    name: tool.name,
    description: tool.tagline || tool.description,
    url: canonicalUrl,
    applicationCategory: tool.category.name,
    operatingSystem: 'Web Browser',
    isFree: tool.isFree,
    aggregateRating: {
      ratingValue: 4.9,
      ratingCount: Math.max(12, Math.floor(tool.viewCount / 10)),
    },
    featureList: featuresList,
  });

  const reg = getToolBySlug(slug);
  const synthesizedToolDef: ToolDefinition = reg || {
    id: tool.id,
    slug: tool.slug,
    name: tool.name,
    tagline: tool.tagline || tool.description,
    description: tool.description,
    category: 'dev',
    categoryName: tool.category?.name || 'Developer Compilers',
    categorySlug: tool.category?.slug || 'coding',
    icon: 'Terminal',
    inputLabel: 'Source Input',
    inputPlaceholder: 'Enter input...',
    outputLabel: 'Output Result',
    sampleInput: '',
    features: featuresList,
    howToSteps: [
      { title: 'Provide Input Parameters', description: 'Enter code or document into the left pane.' },
      { title: 'Execute Pipeline', description: 'Click execute to trigger browser-side processing.' },
      { title: 'Copy Results', description: 'Review output and copy with one click.' },
    ],
    faqs: [],
    seoKeywords: (tool.tags || []).map((t: any) => t.name || t),
  };

  const allTools = getAllTools();
  const relatedToolsList = (
    relatedTools.length > 0
      ? relatedTools.map((rt) => getToolBySlug(rt.slug) || ({
          id: rt.id,
          slug: rt.slug,
          name: rt.name,
          tagline: rt.tagline,
          description: rt.description,
          category: 'dev',
          categoryName: rt.category?.name || 'Tools',
          categorySlug: rt.category?.slug || 'tools',
          icon: 'Terminal',
          inputLabel: 'Input',
          inputPlaceholder: '',
          outputLabel: 'Output',
          sampleInput: '',
          features: [],
          howToSteps: [],
          faqs: [],
          seoKeywords: [],
        }))
      : allTools.filter((t) => t.slug !== tool.slug).slice(0, 3)
  ) as ToolDefinition[];

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-200">
      {/* ── Schema.org JSON-LD Injection ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />

      {/* ── Fixed Navigation ── */}
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ToolView
            tool={synthesizedToolDef}
            seoContent={tool.seoContent}
            relatedTools={relatedToolsList}
          />

          {/* ── Newsletter Capture ── */}
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

      {/* ── Site Footer ── */}
      <Footer />
    </div>
  );
}
