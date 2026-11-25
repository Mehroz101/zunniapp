import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { getCmsArticles } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'AI Engineering Guides & Production Architectures | TOOLty',
  description:
    'Comprehensive technical guides on browser-native AST transpilation, Next.js 16 Edge architecture, stateful mathematical workbenches, and LLM prompt engineering.',
  openGraph: {
    title: 'AI Engineering Guides & Production Architectures',
    description: 'In-depth engineering masterclasses, tutorials, and benchmarks for modern builders.',
    url: 'https://toolty.online/guides',
    siteName: 'TOOLty',
    images: [
      {
        url: 'https://toolty.online/og-default.png',
        width: 1200,
        height: 630,
        alt: 'TOOLty Technical Guides',
      },
    ],
  },
  alternates: {
    canonical: 'https://toolty.online/guides',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface GuideItem {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  description: string;
  href: string;
  tags: string[];
}

export default async function GuidesHubPage() {
  const cmsGuides = await getCmsArticles('GUIDE', 50);

  const dbGuides: GuideItem[] = cmsGuides.map((d) => ({
    slug: d.slug,
    title: d.title,
    category: d.categoryName || 'Architecture',
    readTime: `${d.readingTimeMins || 4} min read`,
    date: d.publishedAt
      ? new Date(d.publishedAt).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
      : 'Recent',
    description: d.excerpt || 'Explore this technical guide on TOOLty.',
    href: `/guides/${d.slug}`,
    tags: d.tags.length > 0 ? d.tags : [d.categoryName || 'Guide', 'AI', 'Architecture'],
  }));

  const mergedGuides = dbGuides;

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar />

      <main className="relative pt-32 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-md">
            <Compass className="h-3.5 w-3.5 text-[#FF8A00]" />
            <span>AI ENGINEERING KNOWLEDGE BASE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
            Technical Guides &amp;{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
              Architecture Playbooks
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            In-depth guides, compiler implementation tutorials, and benchmarks curated by our distributed systems and compiler engineers.
          </p>
        </div>

        {/* Guides Grid */}
        {mergedGuides.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mergedGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={guide.href}
                prefetch={true}
                className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] p-6 shadow-xs hover:border-orange-500/40 dark:hover:border-orange-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="font-mono font-bold text-[#FF8A00] text-[10px] uppercase tracking-wider">
                      {guide.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Clock className="h-3 w-3" />
                      <span>{guide.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white group-hover:text-[#FF8A00] transition leading-snug mb-3 line-clamp-2">
                    {guide.title}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                    {guide.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 mb-3">
                    {guide.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-[#FF8A00] pt-1">
                    <span>Read Full Guide</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-12 text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Technical Guides Publishing Soon
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Publish a guide with format set to Technical Guide in the dashboard to feature it here automatically.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF8A00] hover:bg-[#ff9e2e] px-5 py-2.5 text-xs font-bold text-slate-950 transition"
              >
                <span>Browse Blog Articles</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
              >
                <span>Explore Free Tools</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
