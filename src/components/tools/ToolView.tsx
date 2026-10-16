import Link from 'next/link';
import { ChevronRight, CheckCircle2, Zap, HelpCircle } from 'lucide-react';
import { ToolDefinition } from '@/lib/tools/types';
import { Workbench } from './Workbench';

interface ToolViewProps {
  tool: ToolDefinition;
  seoContent?: string | null;
  relatedTools?: ToolDefinition[];
}

export function ToolView({ tool, seoContent, relatedTools = [] }: ToolViewProps) {
  return (
    <div className="w-full">
      {/* ── Breadcrumbs Navigation ── */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono mb-6">
        <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-700" />
        <Link href="/tools" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">
          {tool.categoryName || 'Tools'}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-700" />
        <span className="text-slate-900 dark:text-slate-100 font-semibold truncate">
          {tool.name}
        </span>
      </nav>

      {/* ── Tool Header Block ── */}
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {tool.name}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* ── Section 1: The Interactive Tool Canvas (HeyGen Light-Mode Aesthetics) ── */}
      <div className="mb-16">
        <Workbench key={tool.slug} tool={tool} />
      </div>

      {/* ── Section 2: Below-Canvas SEO Content Block (CMS / Database Markdown) ── */}
      <section className="pt-10 border-t border-neutral-200/80 dark:border-slate-800 space-y-12">
        {seoContent ? (
          // Injected Rich CMS Content from Database
          <div className="rounded-2xl border border-neutral-200/80 dark:border-slate-800/80 bg-white dark:bg-[#07090f] p-8 sm:p-12 shadow-xs">
            <div
              className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-a:underline hover:prose-a:text-cyan-500 prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800"
              dangerouslySetInnerHTML={{ __html: seoContent }}
            />
          </div>
        ) : (
          // Default High-Traffic Technical SEO Guide Fallback
          <div className="space-y-12">
            {/* Key Capabilities */}
            {tool.features && tool.features.length > 0 && (
              <div>
                <div className="max-w-3xl mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Key Engine Capabilities
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Engineered for maximum fidelity, RFC standards compliance, and client-side execution safety.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-neutral-200/80 dark:border-slate-800/80 bg-white dark:bg-[#07090f] p-4 text-xs shadow-xs"
                    >
                      <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to Use Step-by-Step */}
            {tool.howToSteps && tool.howToSteps.length > 0 && (
              <div>
                <div className="max-w-3xl mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    How to Use {tool.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Follow these simple steps for deterministic output execution.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tool.howToSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-neutral-200/80 dark:border-slate-800/80 bg-white dark:bg-[#07090f] p-6 shadow-xs"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold font-mono text-xs mb-4">
                        0{idx + 1}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {tool.faqs && tool.faqs.length > 0 && (
              <div>
                <div className="max-w-3xl mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Frequently Asked Questions
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Technical context and common integration questions.
                  </p>
                </div>
                <div className="space-y-4">
                  {tool.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-neutral-200/80 dark:border-slate-800/80 bg-white dark:bg-[#07090f] p-6 shadow-xs"
                    >
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        {faq.question}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 pl-6">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Related Tools Discovery */}
        {relatedTools.length > 0 && (
          <div className="pt-8 border-t border-neutral-200/80 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Explore Related Utilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedTools.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/tools/${rel.slug}`}
                  className="rounded-xl border border-neutral-200/80 dark:border-slate-800 bg-white dark:bg-[#07090f] p-4 hover:border-cyan-500/50 transition shadow-xs group"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 transition">
                    {rel.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {rel.tagline}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
