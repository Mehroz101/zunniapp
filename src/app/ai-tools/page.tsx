import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ChevronRight, Zap } from 'lucide-react';
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

export const metadata: Metadata = {
  title: 'Explore Best Free & AI Tools Directory | AIIsEverything',
  description:
    'Browse our comprehensive directory of free AI-powered tools for writing, coding, image generation, text analysis, and SEO. Verified, interactive, and zero paywalls.',
  alternates: {
    canonical: 'https://aiiseverything.com/ai-tools',
  },
  openGraph: {
    title: 'Explore Best Free & AI Tools Directory | AIIsEverything',
    description:
      'Browse our complete directory of free and interactive AI-powered tools.',
    url: 'https://aiiseverything.com/ai-tools',
    siteName: 'AIIsEverything',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Best Free & AI Tools Directory | AIIsEverything',
    description: 'Explore the definitive directory of free AI tools and utilities.',
    images: ['/og-default.png'],
  },
  other: buildGeoMetaTags({
    summary:
      'A curated, searchable directory of high-utility artificial intelligence applications and browser-native tools.',
    entities: ['AIIsEverything', 'AI Directory', 'AI Tools', 'Artificial Intelligence'],
  }),
};

export const revalidate = 60; // 60s ISR refresh

export default async function AIToolsArchivePage() {
  // 1. Fetch all published tools with relations
  const rawTools = await prisma.tool.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      category: true,
      tags: true,
    },
    orderBy: [{ isFeatured: 'desc' }, { viewCount: 'desc' }],
  });

  // 2. Fetch all active categories with counts
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

  // 3. Serialize tools for client component
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

  // 4. Serialize categories
  const categories: DirectoryCategory[] = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    count: c._count.tools,
  }));

  // 5. Schema.org JSON-LD
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://aiiseverything.com' },
    { name: 'AI Tools', item: 'https://aiiseverything.com/ai-tools' },
  ]);

  const collectionSchema = buildCollectionPageSchema({
    name: 'Explore Best Free & AI Tools Directory',
    description:
      'Curated index of artificial intelligence tools, utilities, code formatters, and generative models.',
    url: 'https://aiiseverything.com/ai-tools',
    items: tools.slice(0, 20).map((t) => ({
      name: t.name,
      description: t.tagline,
      url: `https://aiiseverything.com/ai-tools/${t.category.slug}/${t.slug}`,
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

      {/* ── Navigation ── */}
      <Navbar />

      <main className="relative pt-28 pb-20">
        {/* ── Background Subtle Tint ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 -top-20 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#00D2FF]/10 to-indigo-500/5 blur-[130px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ── Breadcrumb ── */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-xs font-medium text-slate-500"
          >
            <Link href="/" className="hover:text-slate-900 transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-900 font-semibold">AI Tools Directory</span>
          </nav>

          {/* ── Hero Directory Header ── */}
          <div className="mb-12 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs">
              <Zap className="h-3.5 w-3.5 text-[#0092c7]" />
              <span>Real-Time AI Tool Hub</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl text-slate-950">
              Explore Best Free &{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-[#0092c7] bg-clip-text text-transparent">
                AI Tools Directory
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Explore our verified collection of AI-powered utilities, code helpers, writing assistants, and neural models. Filter instantly by capability or pricing.
            </p>
          </div>

          {/* ── Interactive Client-Side Filter & Search Grid ── */}
          <ToolsFilterGrid initialTools={tools} categories={categories} />

          {/* ── Newsletter Section ── */}
          <section className="mt-24 rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-8 sm:p-12 text-center shadow-xs">
            <div className="mx-auto max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs mb-4">
                <Sparkles className="h-3.5 w-3.5 text-[#0092c7]" />
                <span>Never Miss a New Tool</span>
              </span>
              <h2 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">
                Get Fresh AI Tools In Your Inbox
              </h2>
              <p className="mt-2 mb-6 text-xs sm:text-sm text-slate-600">
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
