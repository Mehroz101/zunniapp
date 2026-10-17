import Link from 'next/link';
import { BookOpen, ArrowRight, PlusCircle, Clock, FileText } from 'lucide-react';
import type { LivePost } from '@/lib/data';

interface LatestArticlesGridProps {
  posts: LivePost[];
}

export function LatestArticlesGrid({ posts }: LatestArticlesGridProps) {
  return (
    <section className="bg-slate-50/60 border-t border-slate-100 px-6 py-24" id="articles">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-orange-200/80 bg-orange-50 px-3.5 py-1 text-xs font-semibold text-orange-700 shadow-xs">
              <BookOpen className="h-3.5 w-3.5 text-orange-500" /> Editorial & Tutorials
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              Latest{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h2>
          </div>

          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 transition hover:text-slate-950"
          >
            <span>Explore all articles</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Dynamic Articles Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      {post.category.name}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <Clock className="h-3 w-3" /> {post.readingTimeMins} min read
                    </span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug text-slate-900 transition group-hover:text-orange-600">
                    {post.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-500 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700 transition group-hover:text-orange-600">
                  <span>Read Article</span>
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Zero-State */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-200/80">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Articles Ready to Index</h3>
            <p className="mt-1.5 max-w-sm text-xs text-slate-500">
              Publish your first AI guide or breakdown using the admin markdown editor.
            </p>
            <a
              href="http://localhost:3001/posts/new"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-slate-800"
            >
              <PlusCircle className="h-4 w-4 text-[#FF8A00]" />
              Write Article in Dashboard
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
