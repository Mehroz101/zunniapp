import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Layers,
} from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { Workbench } from '@/components/tools/Workbench';
import { getToolBySlug, getAllTools } from '@/lib/tools/registry';
import {
  buildSoftwareApplicationSchema,
  buildBreadcrumbSchema,
} from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600; // 1hr ISR

// ─────────────────────────────────────────────
// Dynamic SEO & OpenGraph Generation
// ─────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    const formatted = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${formatted} — Free Tool | AIIsEverything`,
      description: `Run the free ${formatted} browser utility with instant execution.`,
    };
  }

  const title = `${tool.name} — Free Online Tool | AIIsEverything`;
  const description = tool.tagline || tool.description;
  const canonicalUrl = `https://aiiseverything.com/tools/${tool.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
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
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const allTools = getAllTools();
  const relatedTools = allTools
    .filter((t) => t.slug !== tool.slug && (t.category === tool.category || true))
    .slice(0, 3);

  // Schema.org Structured Data
  const canonicalUrl = `https://aiiseverything.com/tools/${tool.slug}`;
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://aiiseverything.com' },
    { name: 'Tools', item: 'https://aiiseverything.com/tools' },
    { name: tool.name, item: canonicalUrl },
  ]);

  const appSchema = buildSoftwareApplicationSchema({
    name: tool.name,
    description: tool.description,
    url: canonicalUrl,
    applicationCategory: 'DeveloperApplication',
    isFree: true,
    featureList: tool.features,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-200">
      {/* Schema.org Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      {/* Global Navbar */}
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono mb-8">
            <Link href="/" className="hover:text-cyan-500 transition">Home</Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link href="/tools" className="hover:text-cyan-500 transition">Tools</Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-900 dark:text-slate-200 truncate font-semibold">{tool.name}</span>
          </nav>

          {/* Tool Header Block */}
          <div className="max-w-3xl mb-10">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-mono font-medium text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                {tool.categoryName}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                100% Free Online Engine
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {tool.name}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* Interactive Universal Workbench Component */}
          <div className="mb-20">
            <Workbench tool={tool} />
          </div>

          {/* Features & Architectural Specifications */}
          <section className="mb-20 pt-10 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Key Engine Capabilities
              </h2>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Engineered for maximum fidelity, RFC standards compliance, and client-side execution safety.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tool.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#07090f] p-4 text-xs"
                >
                  <CheckCircle2 className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Step-by-Step How To Guide */}
          <section className="mb-20">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                How to Use {tool.name}
              </h2>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Follow these simple steps for deterministic output execution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tool.howToSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#07090f] p-6 shadow-sm"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold font-mono text-xs mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Frequently Asked Questions */}
          {tool.faqs && tool.faqs.length > 0 && (
            <section className="mb-20">
              <div className="max-w-3xl mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4 max-w-3xl">
                {tool.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#07090f] p-5"
                  >
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Tools Carousel */}
          {relatedTools.length > 0 && (
            <section className="mb-20 pt-10 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Related Developer Engines
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Explore complementary parsers and technical diagnostics.
                  </p>
                </div>
                <Link
                  href="/tools"
                  className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>All 26+ Tools</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedTools.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/tools/${rel.slug}`}
                    className="group rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#07090f] p-6 shadow-sm transition hover:border-cyan-500/50 hover:shadow-md"
                  >
                    <span className="text-[10px] font-mono uppercase text-cyan-600 dark:text-cyan-400 font-bold">
                      {rel.categoryName}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                      {rel.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {rel.tagline}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Newsletter Box */}
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

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
