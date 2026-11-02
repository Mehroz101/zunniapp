import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { ToolsDirectoryView } from '@/components/tools/ToolsDirectoryView';
import { getAllTools } from '@/lib/tools/registry';
import { prisma } from '@/lib/prisma';
import { ToolDefinition } from '@/lib/tools/types';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import {
  buildCollectionPageSchema,
  buildBreadcrumbSchema,
  buildGeoMetaTags,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'AI Tools Directory — Developer Utilities Suite | TOOLty',
  description:
    'High-throughput browser-native code transducers, formatters, and AI debuggers. 100% free, zero-latency execution with zero cloud telemetry.',
  alternates: {
    canonical: 'https://toolty.online/ai-tools',
  },
  openGraph: {
    title: 'AI Tools Directory — Developer Utilities Suite | TOOLty',
    description:
      'High-throughput browser-native code transducers, formatters, and AI debuggers. Zero cloud telemetry.',
    url: 'https://toolty.online/ai-tools',
    siteName: 'TOOLty',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools Directory — Developer Utilities Suite | TOOLty',
    description:
      'High-throughput browser-native code transducers, formatters, and AI debuggers. Zero cloud telemetry.',
    images: ['/og-default.png'],
  },
  other: buildGeoMetaTags({
    summary:
      'A curated, searchable directory of high-utility artificial intelligence applications and browser-native tools.',
    entities: ['TOOLty', 'AI Directory', 'AI Tools', 'Artificial Intelligence', 'Developer Utilities'],
  }),
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AIToolsArchivePage() {
  const registryTools = getAllTools();
  let dbTools: any[] = [];
  try {
    dbTools = await prisma.tool.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true },
    });
  } catch (e) {
    // DB fallback
  }

  const registrySlugs = new Set(registryTools.map((t) => t.slug));
  const mappedDbTools: ToolDefinition[] = dbTools
    .filter((t) => !registrySlugs.has(t.slug))
    .map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      tagline: t.tagline,
      description: t.description,
      category: (t.category?.slug as any) || 'dev',
      categoryName: t.category?.name || 'Developer Tools',
      categorySlug: t.category?.slug || 'dev',
      icon: 'Terminal',
      inputLabel: 'Input Data',
      inputPlaceholder: 'Enter input...',
      outputLabel: 'Output',
      sampleInput: '',
      features: (t.config as any)?.features || ['Live execution', 'Zero telemetry'],
      howToSteps: [
        { title: 'Input your data', description: 'Paste or upload content.' },
        { title: 'Run tool', description: 'Process your data instantly.' },
      ],
      faqs: [{ question: `What is ${t.name}?`, answer: t.description }],
      seoKeywords: [t.name, 'ai tool', 'developer tool'],
      primaryGroup: 'ai-utilities',
    }));

  const tools = [...registryTools, ...mappedDbTools];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://toolty.online' },
    { name: 'AI Tools', item: 'https://toolty.online/ai-tools' },
  ]);

  const collectionSchema = buildCollectionPageSchema({
    name: 'AI Tools Directory — Developer Utilities Suite',
    description:
      'High-throughput browser-native code transducers, formatters, and AI debuggers. Zero cloud telemetry.',
    url: 'https://toolty.online/ai-tools',
    items: tools.map((t) => ({
      name: t.name,
      description: t.tagline,
      url: `https://toolty.online/tools/${t.slug}`,
    })),
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 selection:bg-[#FF8A00]/30 selection:text-slate-950 font-sans transition-colors duration-200">
      {/* ── Schema.org JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* ── Global Navigation ── */}
      <Navbar />

      <main className="relative pt-28 pb-20">
        {/* ── Background Subtle Tint ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 -top-20 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#FF8A00]/10 to-orange-500/5 blur-[130px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ── Breadcrumb ── */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
            <span className="text-slate-900 dark:text-white font-semibold">AI Tools Directory</span>
          </nav>

          {/* ── Interactive Developer Utilities Suite (Matches Reference Image Exactly) ── */}
          <ToolsDirectoryView tools={tools} />

          {/* ── Newsletter Section ── */}
          <section className="mt-24 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-[#0a101d] dark:to-[#060911] p-8 sm:p-12 text-center shadow-xs">
            <div className="mx-auto max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs mb-4">
                <Sparkles className="h-3.5 w-3.5 text-[#FF8A00]" />
                <span>Never Miss a New Tool</span>
              </span>
              <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white sm:text-3xl">
                Get Fresh AI Tools In Your Inbox
              </h2>
              <p className="mt-2 mb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
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
