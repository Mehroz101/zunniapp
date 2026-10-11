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
    <section className="bg-white bg-dot-pattern border-t border-slate-200/80 px-6 sm:px-8 lg:px-12 py-24 sm:py-28" id="categories">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-mono text-[#0092c7] shadow-xs">
            <Layers className="h-3.5 w-3.5" />
            <span>ARCHITECTURAL DOMAINS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950">
            Specialized{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-[#0092c7] bg-clip-text text-transparent">
              Developer Hubs
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-600">
            Targeted utility matrices built for frontend architects, full-stack engineers, and AI practitioners.
          </p>
        </div>

        {/* Responsive Grid with Clean Light Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayList.map((cat) => {
            const Icon = ICON_MAP[cat.slug] ?? Brain;

            return (
              <Link
                key={cat.slug}
                href={`/ai-tools/${cat.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                <div>
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-[#0092c7] group-hover:border-[#0092c7]/40 group-hover:bg-[#00D2FF]/10 transition">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-indigo-600">
                    {cat.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 line-clamp-2">
                    {cat.description ?? `Explore all ${cat.name} utilities and tools.`}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-mono text-slate-400">
                    {cat.toolCount} {cat.toolCount === 1 ? 'utility' : 'utilities'}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-700 transition group-hover:text-indigo-600">
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
