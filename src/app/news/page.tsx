import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Newspaper,
  ArrowRight,
  Sparkles,
  Clock,
  Radio,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { getCmsArticles } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'AI News, Developer Updates & Industry Dispatches | TOOLty',
  description:
    'Real-time dispatches, model releases, benchmark analyses, and AI developer ecosystem breakthroughs curated by the TOOLty engineering desk.',
  openGraph: {
    title: 'AI News & Industry Dispatches | TOOLty',
    description: 'Real-time updates on frontier models, agent frameworks, and developer tooling.',
    url: 'https://toolty.online/news',
    siteName: 'TOOLty',
    images: [
      {
        url: 'https://toolty.online/og-default.png',
        width: 1200,
        height: 630,
        alt: 'TOOLty AI News & Dispatches',
      },
    ],
  },
  alternates: {
    canonical: 'https://toolty.online/news',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface NewsItem {
  slug: string;
  title: string;
  category: string;
  readingTime: number;
  date: string;
  description: string;
  featuredImage?: string;
  isExternal?: boolean;
}

export default async function NewsHubPage() {
  const cmsNews = await getCmsArticles('NEWS', 50);

  const dbNews: NewsItem[] = cmsNews.map((d) => ({
    slug: d.slug,
    title: d.title,
    category: d.categoryName || 'Industry News',
    readingTime: d.readingTimeMins || 3,
    date: d.publishedAt
      ? new Date(d.publishedAt).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
      : 'Recent',
    description: d.excerpt || 'Explore this news dispatch on TOOLty.',
    featuredImage: d.coverImage || '',
  }));

  const allNews = dbNews;

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar />

      <main className="relative pt-32 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-md">
            <Radio className="h-3.5 w-3.5 text-[#FF8A00] animate-pulse" />
            <span>REAL-TIME DISPATCHES &amp; ECOSYSTEM RADAR</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
            AI Developer News &amp;{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
              Industry Radar
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Verified breakthroughs, model benchmarks, compiler releases, and ecosystem updates curated for high-velocity software engineers.
          </p>
        </div>

        {/* News Grid */}
        {allNews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allNews.map((news) => (
              <Link
                key={news.slug}
                href={`/news/${news.slug}`}
                prefetch={true}
                className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] p-6 shadow-xs hover:border-orange-500/40 dark:hover:border-orange-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Meta Row */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="font-mono font-bold text-[#FF8A00] text-[10px] uppercase tracking-wider">
                      {news.category}
                    </span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{news.date}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{news.readingTime} min</span>
                      </div>
                    </div>
                  </div>

                  {/* News Title */}
                  <h2 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white group-hover:text-[#FF8A00] transition leading-snug mb-3 line-clamp-2">
                    {news.title}
                  </h2>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                    {news.description}
                  </p>
                </div>

                {/* Read Action */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-[#FF8A00]">
                  <span>Read Dispatch</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-12 text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">News Dispatches Coming Soon</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Publish a News article from your CMS dashboard to see it featured here immediately.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
