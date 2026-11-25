import Link from 'next/link';
import { ArrowRight, Bookmark, Calendar, Clock, Scale } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import type { CmsArticle } from '@/lib/cms';

interface FormatHubPageProps {
  kind: 'glossary' | 'compare';
  badge: string;
  headingPrefix: string;
  headingAccent: string;
  description: string;
  ctaLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  articles: CmsArticle[];
}

export function FormatHubPage({
  kind,
  badge,
  headingPrefix,
  headingAccent,
  description,
  ctaLabel,
  emptyTitle,
  emptyDescription,
  articles,
}: FormatHubPageProps) {
  const basePath = kind === 'glossary' ? '/glossary' : '/compare';

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar />

      <main className="relative pt-32 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-md">
            {kind === 'glossary' ? (
              <Bookmark className="h-3.5 w-3.5 text-[#FF8A00]" />
            ) : (
              <Scale className="h-3.5 w-3.5 text-[#FF8A00]" />
            )}
            <span>{badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
            {headingPrefix}{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
              {headingAccent}
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((item) => {
              const dateText = item.publishedAt
                ? new Date(item.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';

              return (
                <Link
                  key={item.slug}
                  href={`${basePath}/${item.slug}`}
                  prefetch={true}
                  className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] p-6 shadow-xs hover:border-orange-500/40 dark:hover:border-orange-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <span className="font-mono font-bold text-[#FF8A00] text-[10px] uppercase tracking-wider">
                        {item.categoryName}
                      </span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {dateText}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.readingTimeMins} min
                        </span>
                      </div>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white group-hover:text-[#FF8A00] transition leading-snug mb-3 line-clamp-2">
                      {item.title}
                    </h2>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-[#FF8A00]">
                    <span>{ctaLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-12 text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{emptyTitle}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{emptyDescription}</p>
            <div className="pt-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF8A00] hover:bg-[#ff9e2e] px-5 py-2.5 text-xs font-bold text-slate-950 transition"
              >
                <span>Browse All Articles</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
