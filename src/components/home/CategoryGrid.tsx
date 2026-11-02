import Link from 'next/link';
import { Pen, Code, Image as ImageIcon, Brain, Search, BarChart3, ChevronRight, Layers } from 'lucide-react';
import type { LiveCategory } from '@/lib/data';

interface CategoryGridProps {
  categories: LiveCategory[];
}

const DEFAULT_CATEGORY_FALLBACKS: LiveCategory[] = [
  { id: '1', name: 'Code Converters & Transpilers', slug: 'coding', description: 'AST transcoders, formatters, and type generators', toolCount: 18 },
  { id: '2', name: 'AI Models & Neural Utilities', slug: 'text', description: 'Token optimizers, LLM context analyzers & summarizers', toolCount: 14 },
  { id: '3', name: 'Vision AI & Graphics Pipeline', slug: 'image', description: 'Visual generators, upscalers & vector SVG processors', toolCount: 9 },
  { id: '4', name: 'Developer Text & NLP Tools', slug: 'writing', description: 'Markdown canvas, syntax analyzers & prompt compilers', toolCount: 12 },
  { id: '5', name: 'SEO & Structured Data Builders', slug: 'seo', description: 'JSON-LD schema generators & metadata validators', toolCount: 8 },
  { id: '6', name: 'Data Pipeline & Schema Converters', slug: 'data', description: 'CSV/JSON/YAML streaming & neural dataset formatting', toolCount: 6 },
];

const ICON_MAP: Record<string, React.ElementType> = {
  writing: Pen,
  coding: Code,
  image: ImageIcon,
  text: Brain,
  seo: Search,
  data: BarChart3,
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  const displayList = categories.length > 0 ? categories : DEFAULT_CATEGORY_FALLBACKS;

  return (
    <section className="bg-white dark:bg-[#05070c] border-t border-slate-200/80 dark:border-slate-800/80 px-6 sm:px-8 lg:px-12 py-20 sm:py-24 transition-colors duration-200" id="categories">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1 text-xs font-mono text-orange-600 dark:text-[#FF8A00] shadow-xs">
            <Layers className="h-3.5 w-3.5" />
            <span>ARCHITECTURAL DOMAINS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-slate-900 dark:text-slate-50">
            Specialized{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
              Developer Hubs
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed text-[15px] sm:text-base">
            Targeted utility matrices built for frontend architects, full-stack engineers, and AI practitioners.
          </p>
        </div>

        {/* Responsive Grid with Clean Light & Dark Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayList.map((cat) => {
            const Icon = ICON_MAP[cat.slug] ?? Brain;

            return (
              <Link
                key={cat.slug}
                href={`/ai-tools/${cat.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 dark:hover:border-orange-500/40 hover:shadow-xl"
              >
                <div>
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/50 text-orange-500 dark:text-orange-400 group-hover:border-orange-500/40 group-hover:bg-orange-500/10 transition">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-base font-semibold tracking-[-0.01em] text-slate-900 dark:text-slate-100 transition group-hover:text-orange-600 dark:group-hover:text-orange-400">
                    {cat.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                    {cat.description ?? `Explore all ${cat.name} utilities and tools.`}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    {cat.toolCount} {cat.toolCount === 1 ? 'utility' : 'utilities'}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 transition group-hover:text-orange-600 dark:group-hover:text-orange-400">
                    Enter Hub <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
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
