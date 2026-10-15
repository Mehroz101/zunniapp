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
import { ToolView } from '@/components/tools/ToolView';
import { prisma } from '@/lib/prisma';
import { getToolBySlug, getAllTools } from '@/lib/tools/registry';
import {
  buildSoftwareApplicationSchema,
  buildBreadcrumbSchema,
} from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600; // 1hr ISR

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((t) => ({ slug: t.slug }));
}

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

  // Fetch CMS SEO content from Database if present
  let dbTool: any = null;
  try {
    dbTool = await prisma.tool.findUnique({
      where: { slug: tool.slug },
      include: { category: true },
    });
  } catch (e) {
    // Graceful fallback to static definitions
  }

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
          <ToolView
            tool={tool}
            seoContent={dbTool?.seoContent}
            relatedTools={relatedTools}
          />

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
