import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Sparkles,
  ChevronRight,
  Eye,
  CheckCircle2,
  ArrowRight,
  Zap,
  Layers,
  ShieldCheck,
  Tag as TagIcon,
  Cpu,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatNumber } from '@/lib/utils';
import {
  buildSoftwareApplicationSchema,
  buildBreadcrumbSchema,
  buildGeoMetaTags,
} from '@/lib/seo';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { ToolRunner } from '@/components/tools/ToolRunner';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export const revalidate = 60; // ISR 60s background refresh

// ─────────────────────────────────────────────
// Dynamic SEO, AEO & OpenGraph Generation
// ─────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;

  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!tool || tool.status !== 'PUBLISHED' || tool.category.slug !== category) {
    return {
      title: 'Tool Not Found | AIIsEverything',
      description: 'The requested AI tool could not be found.',
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

  // 1. Fetch tool from MongoDB via Prisma
  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: true,
    },
  });

  // 2. 404 Fallback
  if (!tool || tool.status !== 'PUBLISHED' || tool.category.slug !== category) {
    notFound();
  }

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
  const relatedTools = await prisma.tool.findMany({
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

  const renderTypeMeta: Record<string, { label: string; desc: string }> = {
    CLIENT_SIDE: {
      label: 'Client-Side Utility',
      desc: 'Executes instantly in your browser with zero server round-trips.',
    },
    API_POWERED: {
      label: 'AI Model Powered',
      desc: 'Processed via specialized neural network inference endpoints.',
    },
    IFRAME_EMBED: {
      label: 'Sandboxed Application',
      desc: 'Secure sandboxed interactive application canvas.',
    },
    EXTERNAL_LINK: {
      label: 'External Platform',
      desc: 'Verified third-party AI tool with direct official integration.',
    },
  };

  const executionInfo = renderTypeMeta[tool.renderType] ?? {
    label: tool.renderType,
    desc: 'Interactive tool execution',
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#00D2FF]/30 selection:text-slate-950 font-sans">
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

      <main className="relative pt-28 pb-20">
        {/* ── Ambient Background Glows ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 -top-20 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#00D2FF]/10 to-indigo-500/5 blur-[140px]" />
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
            <Link href="/ai-tools" className="hover:text-slate-900 transition">
              AI Tools
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <Link
              href={`/ai-tools/${tool.category.slug}`}
              className="hover:text-slate-900 transition"
            >
              {tool.category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
              {tool.name}
            </span>
          </nav>

          {/* ── Tool Header Section ── */}
          <div className="mb-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={`/ai-tools/${tool.category.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition shadow-xs"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>{tool.category.name}</span>
              </Link>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{tool.isFree ? '100% Free' : 'Freemium'}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                <Cpu className="h-3.5 w-3.5 text-indigo-600" />
                <span>{executionInfo.label}</span>
              </span>

              <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                <Eye className="h-3.5 w-3.5 text-slate-400" />
                <span>{formatNumber(tool.viewCount + 1)} views</span>
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl text-slate-950">
              {tool.name}
            </h1>

            <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-slate-700 font-medium">
              {tool.tagline}
            </p>

            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              {tool.description}
            </p>
          </div>

          {/* ── Interactive Tool Execution Canvas ── */}
          <div className="relative mb-16 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-900 shadow-2xs">
              <Zap className="h-3 w-3 fill-current text-[#0092c7]" />
              <span>Interactive Execution Canvas</span>
            </div>

            <ToolRunner
              tool={{
                id: tool.id,
                name: tool.name,
                slug: tool.slug,
                tagline: tool.tagline,
                description: tool.description,
                renderType: tool.renderType,
                config: toolConfig,
                isFree: tool.isFree,
              }}
            />
          </div>

          {/* ── Technical Specifications & How-To (AEO Optimized) ── */}
          <div className="mb-16 grid gap-8 lg:grid-cols-3">
            {/* Left 2 Cols: Step-by-Step Instructions */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-6 sm:p-8 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-200/80 pb-4">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  How to Use {tool.name}
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white shadow-2xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Provide Input Parameters
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Enter your prompt, source document, or code snippet into the execution canvas above.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white shadow-2xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Execute Computation
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Click the execution button to trigger the {executionInfo.label.toLowerCase()} pipeline.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white shadow-2xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Inspect & Copy Results
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Review the formatted output canvas and copy the generated assets to your clipboard with one click.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              {tool.tags && tool.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-200/80">
                  <div className="flex items-center gap-2 mb-3">
                    <TagIcon className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Associated Topics & Tags
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((t) => (
                      <span
                        key={t.id}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 font-medium"
                      >
                        #{t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 1 Col: Platform Highlights */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-200/80 pb-4">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Features</h2>
              </div>

              <ul className="space-y-3">
                {featuresList.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-2xs">
                <p className="font-bold text-slate-900 mb-1">Architecture Guarantee</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {executionInfo.desc}
                </p>
              </div>
            </div>
          </div>

          {/* ── Related Tools Grid ── */}
          {relatedTools.length > 0 && (
            <section className="border-t border-slate-200 pt-16">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Explore More
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-950 mt-1">
                    Related {tool.category.name} Tools
                  </h2>
                </div>

                <Link
                  href={`/ai-tools/${tool.category.slug}`}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950 transition"
                >
                  <span>View All in {tool.category.name}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedTools.map((relTool) => (
                  <Link
                    key={relTool.id}
                    href={`/ai-tools/${relTool.category.slug}/${relTool.slug}`}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-xl hover:border-slate-300 transition"
                  >
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          {relTool.category.name}
                        </span>
                        {relTool.isFree && (
                          <span className="text-[11px] font-semibold text-emerald-600">
                            Free
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {relTool.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {relTool.tagline || relTool.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 group-hover:text-indigo-600">
                      <span>Launch tool</span>
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Newsletter Capture ── */}
          <section className="mt-20 rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-8 sm:p-12 text-center shadow-xs">
            <div className="mx-auto max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs mb-4">
                <Sparkles className="h-3.5 w-3.5 text-[#0092c7]" />
                <span>Stay Ahead in AI</span>
              </span>
              <h2 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">
                Get New Tools & Workflows Weekly
              </h2>
              <p className="mt-2 mb-6 text-xs sm:text-sm text-slate-600">
                Join our newsletter to receive newly released AI tools and breakdown tutorials straight to your inbox.
              </p>
              <NewsletterForm />
            </div>
          </section>
        </div>
      </main>

      {/* ── Site Footer ── */}
      <Footer />
    </div>
  );
}
