import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Terminal, ShieldCheck, Zap } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { ToolsDirectoryView } from '@/components/tools/ToolsDirectoryView';
import { getAllTools } from '@/lib/tools/registry';
import { buildCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Free Developer & Technical SEO Tools Suite | AIIsEverything',
  description:
    'Explore 26+ production-ready developer compilers, AST code converters, and technical SEO diagnostic suites. Fast, interactive, 100% free with zero paywalls.',
  alternates: {
    canonical: 'https://aiiseverything.com/tools',
  },
  openGraph: {
    title: 'Free Developer & Technical SEO Tools Suite | AIIsEverything',
    description:
      'Explore 26+ production-ready developer compilers, AST code converters, and technical SEO diagnostic suites.',
    url: 'https://aiiseverything.com/tools',
    siteName: 'AIIsEverything',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Developer & Technical SEO Tools Suite | AIIsEverything',
    description:
      '26+ deterministic developer compilers, code converters, and technical SEO utilities.',
    images: ['/og-default.png'],
  },
};

export const revalidate = 3600; // 1hr ISR

export default function ToolsHubPage() {
  const tools = getAllTools();

  const breadcrumbs = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://aiiseverything.com' },
    { name: 'Tools Directory', item: 'https://aiiseverything.com/tools' },
  ]);

  const collectionSchema = buildCollectionPageSchema({
    name: 'AIIsEverything Developer & SEO Tools Directory',
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
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-200">
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
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1 text-[11px] font-mono font-semibold tracking-wider text-blue-600 dark:text-[#00D2FF] mb-5">
              <Zap className="h-3.5 w-3.5" />
              <span>DEVELOPER UTILITIES SUITE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              AI Tools for{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Every Workflow
              </span>
            </h1>
            <p className="mt-3.5 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              High-throughput client-side code transducers, formatters, and AI debuggers. Zero cloud telemetry.
            </p>
          </div>

          {/* Interactive Tools Directory */}
          <ToolsDirectoryView tools={tools} />

          {/* Value Prop Banner */}
          <div className="mt-20 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#07090f] p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Sub-Millisecond Execution</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Compiled client-side in Web Workers and modern native APIs for instant results with zero network overhead.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Zero Data Transmission</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tokens, JWT keys, and proprietary code payloads remain strictly in your browser memory sandbox.
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
