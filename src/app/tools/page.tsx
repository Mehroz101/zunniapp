import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Terminal, ShieldCheck, Zap } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { ToolsDirectoryView } from '@/components/tools/ToolsDirectoryView';
import { getAllTools } from '@/lib/tools/registry';
import { prisma } from '@/lib/prisma';
import { ToolDefinition } from '@/lib/tools/types';
import { buildCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Free Developer & Technical SEO Tools Suite | AiTools Studio',
  description:
    'Explore 26+ production-ready developer compilers, AST code converters, and technical SEO diagnostic suites. Fast, interactive, 100% free with zero paywalls.',
  alternates: {
    canonical: 'https://aiiseverything.com/tools',
  },
  openGraph: {
    title: 'Free Developer & Technical SEO Tools Suite | AiTools Studio',
    description:
      'Explore 26+ production-ready developer compilers, AST code converters, and technical SEO diagnostic suites.',
    url: 'https://aiiseverything.com/tools',
    siteName: 'AiTools Studio',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Developer & Technical SEO Tools Suite | AiTools Studio',
    description:
      '26+ deterministic developer compilers, code converters, and technical SEO utilities.',
    images: ['/og-default.png'],
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ToolsHubPage() {
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
      seoKeywords: [t.name, 'developer tool'],
      primaryGroup: 'ai-utilities',
    }));

  const tools = [...registryTools, ...mappedDbTools];

  const breadcrumbs = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://aiiseverything.com' },
    { name: 'Tools Directory', item: 'https://aiiseverything.com/tools' },
  ]);

  const collectionSchema = buildCollectionPageSchema({
    name: 'AiTools Studio Developer & SEO Tools Directory',
    description:
      'Explore 26+ production-ready developer compilers, AST code converters, and technical SEO diagnostic suites.',
    url: 'https://aiiseverything.com/tools',
    items: tools.map((t) => ({
      name: t.name,
      url: `https://aiiseverything.com/tools/${t.slug}`,
      description: t.tagline,
    })),
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[#FF8A00]/30 selection:text-slate-950">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Global Navbar */}
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Interactive Tools Directory */}
          <ToolsDirectoryView tools={tools} />

          {/* Value Prop Banner */}
          <div className="mt-20 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#07090f] p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-[#FF8A00]">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Sub-Millisecond Execution</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Compiled directly in browser Web Workers and modern native APIs for instant results with zero network overhead.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Zero Data Transmission</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tokens, cryptographic keys, and proprietary code payloads remain strictly within your local browser memory.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Terminal className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Deterministic Compilers</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Zero superficial mock states. Real AST traversal, schema compliance, and RFC-validated outputs.
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter Call to Action */}
          <div className="mt-20 text-center max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Stay Ahead of Developer Tooling</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Get weekly updates on new AST converters, SEO benchmarks, and neural code workflows.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
