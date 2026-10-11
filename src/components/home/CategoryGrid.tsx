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
    <section className="bg-[#07090e] border-t border-white/[0.06] px-4 sm:px-6 lg:px-10 py-24 sm:py-28" id="categories">
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-mono text-[#00D2FF]">
            <Layers className="h-3.5 w-3.5" />
            <span>ARCHITECTURAL DOMAINS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Specialized{' '}
            <span className="bg-gradient-to-r from-[#00D2FF] via-[#38bdf8] to-indigo-400 bg-clip-text text-transparent">
              Developer Hubs
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-400">
            Targeted utility matrices built for frontend architects, full-stack engineers, and AI practitioners.
          </p>
        </div>

        {/* Responsive Grid with Clean Borderless Glassmorphism */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayList.map((cat) => {
            const Icon = ICON_MAP[cat.slug] ?? Brain;

            return (
              <Link
                key={cat.slug}
                href={`/ai-tools/${cat.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00D2FF]/40 hover:bg-white/[0.04] hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
              >
                <div>
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-[#00D2FF] group-hover:border-[#00D2FF]/40 group-hover:bg-[#00D2FF]/10 transition">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-bold text-white transition group-hover:text-[#00D2FF]">
                    {cat.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400 line-clamp-2">
                    {cat.description ?? `Explore all ${cat.name} utilities and tools.`}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="text-xs font-mono text-slate-500">
                    {cat.toolCount} {cat.toolCount === 1 ? 'utility' : 'utilities'}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-300 transition group-hover:text-[#00D2FF]">
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
