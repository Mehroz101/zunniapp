import Link from 'next/link';
import { Pen, Code, Image, Brain, Search, BarChart3, ChevronRight, Zap } from 'lucide-react';
import type { LiveCategory } from '@/lib/data';
import { CATEGORY_ACCENTS } from '@/lib/data';

interface CategoryGridProps {
  categories: LiveCategory[];
}

const DEFAULT_CATEGORY_FALLBACKS: LiveCategory[] = [
  { id: '1', name: 'AI Writing', slug: 'writing', description: 'Essay generators, paraphrasers & grammar checkers', toolCount: 12 },
  { id: '2', name: 'Coding Tools', slug: 'coding', description: 'Code converters, formatters, and debuggers', toolCount: 18 },
  { id: '3', name: 'AI Image', slug: 'image', description: 'Visual generators, upscalers & editor pipelines', toolCount: 9 },
  { id: '4', name: 'Text Tools', slug: 'text', description: 'Executive summarizers, analyzers & converters', toolCount: 14 },
  { id: '5', name: 'SEO Tools', slug: 'seo', description: 'Meta builders, schema validators & rank analyzers', toolCount: 8 },
  { id: '6', name: 'Analytics', slug: 'data', description: 'CSV/JSON converters & neural data processors', toolCount: 6 },
];

const ICON_MAP: Record<string, React.ElementType> = {
  writing: Pen,
  coding: Code,
  image: Image,
  text: Brain,
  seo: Search,
  data: BarChart3,
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  const displayList = categories.length > 0 ? categories : DEFAULT_CATEGORY_FALLBACKS;

  return (
    <section className="bg-slate-50/60 border-t border-slate-100 px-6 py-24" id="categories">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs">
            <Zap className="h-3.5 w-3.5 text-[#0092c7]" /> Categorized Hubs
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            AI Tools for{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-[#0092c7] bg-clip-text text-transparent">
              Every Workflow
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-600">
            Browse our expanding directory of browser-executable mini-tools and curated AI utilities.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayList.map((cat) => {
            const Icon = ICON_MAP[cat.slug] ?? Brain;
            const accent = CATEGORY_ACCENTS[cat.slug] ?? {
              color: 'from-indigo-600 to-violet-600',
              bgGlow: 'rgba(99, 102, 241, 0.1)',
            };

            return (
              <Link
                key={cat.slug}
                href={`/ai-tools/${cat.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                <div>
                  <div
                    className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent.color} text-white shadow-md shadow-slate-900/10`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-indigo-600">
                    {cat.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 line-clamp-2">
                    {cat.description ?? `Explore all ${cat.name} utilities and converters.`}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-mono text-slate-400">
                    {cat.toolCount} {cat.toolCount === 1 ? 'tool' : 'tools'}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-700 transition group-hover:text-indigo-600">
                    Explore Hub <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
