import Link from 'next/link';
import { Star, Zap, ArrowRight, PlusCircle, Wrench } from 'lucide-react';
import type { LiveTool } from '@/lib/data';

interface FeaturedToolsGridProps {
  tools: LiveTool[];
}

export function FeaturedToolsGrid({ tools }: FeaturedToolsGridProps) {
  return (
    <section className="bg-white border-t border-slate-100 px-6 py-24" id="tools">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400 shadow-xs">
              <Star className="h-3.5 w-3.5 text-[#FF8A00] fill-[#FF8A00]" /> Curated Collection
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl md:text-5xl">
              Featured{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
                AI Utilities
              </span>
            </h2>
          </div>

          <Link
            href="/ai-tools"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 transition hover:text-slate-950"
          >
            <span>View all directory</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Dynamic Tools Grid */}
        {tools.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/ai-tools/${tool.category.slug}/${tool.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                <div>
                  {/* Top Badges */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200/80 text-orange-500">
                        <Zap className="h-5 w-5" />
                      </div>
                      <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-mono uppercase text-slate-600">
                        {tool.renderType.replace('_', ' ')}
                      </span>
                    </div>

                    {tool.isFree && (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                        Free Access
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-orange-600">
                    {tool.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 line-clamp-2">
                    {tool.tagline}
                  </p>
                </div>

                {/* Footer Info */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                  <span className="text-slate-400 font-medium">{tool.category.name}</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700 transition group-hover:text-orange-600">
                    Launch Tool <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Zero-State / Call to Action */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-200/80">
              <Wrench className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Database Ready for Tools</h3>
            <p className="mt-1.5 max-w-sm text-xs text-slate-500">
              MongoDB is live and connected. Open your admin dashboard to publish your first interactive tool!
            </p>
            <a
              href="http://localhost:3001/tools/new"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-slate-800"
            >
              <PlusCircle className="h-4 w-4 text-[#FF8A00]" />
              Publish First Tool in Dashboard
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
