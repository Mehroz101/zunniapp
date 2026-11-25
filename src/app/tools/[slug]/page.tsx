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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ─────────────────────────────────────────────
// Dynamic SEO & OpenGraph Generation
// ─────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let dbTool: any = null;
  try {
    dbTool = await prisma.tool.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch (e) {
    // Graceful fallback
  }

  const tool = getToolBySlug(slug);
  const publishedDbTool = dbTool?.status === 'PUBLISHED' ? dbTool : null;
  const name = publishedDbTool?.name || tool?.name;
  const tagline = publishedDbTool?.tagline || tool?.tagline;
  const description = publishedDbTool?.description || tool?.description;

  if (!name) {
    const formatted = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${formatted} — Free Tool | TOOLty`,
      description: `Run the free ${formatted} browser utility with instant execution.`,
    };
  }

  const title = `${name} — Free Online Tool`;
  const desc = tagline || description || `Free ${name} online utility.`;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://toolty.online').replace(/\/+$/, '');
  const canonicalUrl = `${siteUrl}/tools/${slug}`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | TOOLty`,
      description: desc,
      url: canonicalUrl,
      siteName: 'TOOLty',
      images: [{ url: `${siteUrl}/icon.svg`, width: 512, height: 512 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | TOOLty`,
      description: desc,
      images: [`${siteUrl}/icon.svg`],
    },
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch from Database first
  let dbTool: any = null;
  try {
    dbTool = await prisma.tool.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch (e) {
    // Graceful fallback
  }

  // 2. Fetch from static registry if available
  let tool = getToolBySlug(slug);

  // If tool exists in DB but not static registry, synthesize a ToolDefinition
  if (!tool && dbTool) {
    tool = {
      id: dbTool.id,
      slug: dbTool.slug,
      name: dbTool.name,
      tagline: dbTool.tagline,
      description: dbTool.description,
      category: (dbTool.category?.slug as any) || 'dev',
      categoryName: dbTool.category?.name || 'Developer Tools',
      categorySlug: dbTool.category?.slug || 'dev',
      icon: 'Terminal',
      inputLabel: 'Input Data',
      inputPlaceholder: 'Paste your input here...',
      outputLabel: 'Processed Output',
      sampleInput: '',
      features: (dbTool.config as any)?.features || ['Zero-latency execution', 'Browser-native privacy'],
      howToSteps: [
        { title: 'Input data', description: 'Paste or upload content to process.' },
        { title: 'Execute', description: 'Click run or press Ctrl+Enter to process.' },
      ],
      faqs: [
        { question: `What is ${dbTool.name}?`, answer: dbTool.description },
      ],
      seoKeywords: [dbTool.name, 'developer tool', 'online tool'],
    };
  }

  if (!tool) {
    notFound();
  }

  const allTools = getAllTools();
  const relatedTools = allTools
    .filter((t) => t.slug !== tool.slug && (t.category === tool.category || true))
    .slice(0, 3);

  // Schema.org Structured Data
  const canonicalUrl = `https://toolty.online/tools/${tool.slug}`;
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://toolty.online' },
    { name: 'Tools', item: 'https://toolty.online/tools' },
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
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[#FF8A00]/30 selection:text-slate-950">
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
