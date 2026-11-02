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

export const metadata: Metadata = {
  title: 'AI Engineering Guides & Production Architectures | FreeToolsStore',
  description:
    'Comprehensive technical guides on browser-native AST transpilation, Next.js 16 Edge architecture, stateful mathematical workbenches, and LLM prompt engineering.',
  openGraph: {
    title: 'AI Engineering Guides & Production Architectures',
    description: 'In-depth engineering masterclasses, tutorials, and benchmarks for modern builders.',
    url: 'https://freetoolsstore.online/guides',
    siteName: 'FreeToolsStore',
  },
  alternates: {
    canonical: 'https://freetoolsstore.online/guides',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const GUIDES = [
  {
    slug: 'ast-compilers-in-production',
    title: 'Building Browser-Native AST Compilers & Transpilers in Production',
    category: 'Architecture',
    readTime: '8 min read',
    date: 'Oct 2026',
    description:
      'Learn how to leverage Babel, PostCSS, and parser tokenizers directly in browser workers to build zero-latency conversion workbenches without server invocation.',
    href: '/blog/ast-compilers-in-production',
    tags: ['AST', 'Compilers', 'Frontend', 'TypeScript'],
  },
  {
    slug: 'nextjs-16-edge-performance',
    title: 'Next.js 16 Edge Route Guards, Middleware & Sub-100ms Crawler Pipelines',
    category: 'DevOps & SEO',
    readTime: '11 min read',
    date: 'Oct 2026',
    description:
      'A deep dive into zero-cold-start edge middleware, JWT verification using jose, dynamic sitemap generators, and Googlebot crawl budget optimization.',
    href: '/blog/nextjs-16-edge-performance',
    tags: ['Next.js 16', 'Edge', 'Security', 'SEO'],
  },
  {
    slug: 'stateful-ai-workbenches',
    title: 'Engineering Browser-Native Math & Financial Calculation Engines',
    category: 'Engineering',
    readTime: '6 min read',
    date: 'Oct 2026',
    description:
      'How to build deterministic amortization schedules, negative equity auto loan estimators, and compound ROI portfolios with pure reactive state management.',
    href: '/blog/stateful-ai-workbenches',
    tags: ['Math', 'State Management', 'React 19', 'Finance'],
  },
  {
    slug: 'claude-vs-gpt4o-vs-gemini-comparison',
    title: 'Frontier Model Benchmark 2026: Claude 3.5, GPT-5 & Gemini 1.5 Pro',
    category: 'Benchmarks',
    readTime: '14 min read',
    date: 'Oct 2026',
    description:
      'Data-driven head-to-head comparison across 15 real-world engineering benchmarks including AST code refactoring, system architecture, and mathematical proofs.',
    href: '/blog/claude-vs-gpt4o-vs-gemini-comparison',
    tags: ['LLM', 'Benchmarks', 'Claude', 'GPT-5'],
  },
  {
    slug: 'ai-tools-productivity-guide',
    title: '10× Engineering Velocity: Integrating AI Utilities Into Daily Workflows',
    category: 'Productivity',
    readTime: '7 min read',
    date: 'Oct 2026',
    description:
      'Practical masterclass on replacing brittle CLI tools with instant browser compilers for schema migrations, regex debugging, and data format transforms.',
    href: '/blog/ai-tools-productivity-guide',
    tags: ['Productivity', 'Workflow', 'Developer Tools'],
  },
  {
    slug: 'autonomous-agent-frameworks-review',
    title: 'The Evolution of Autonomous Coding Agents & Self-Healing Pipelines',
    category: 'Agentic AI',
    readTime: '9 min read',
    date: 'Oct 2026',
    description:
      'Analyzing multi-agent orchestration, tool-calling feedback loops, and automated verification systems powering modern autonomous code generation.',
    href: '/blog/autonomous-agent-frameworks-review',
    tags: ['Agents', 'Automation', 'AI', 'Full-Stack'],
  },
];

export default function GuidesHubPage() {
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={guide.href}
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

                <h2 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white group-hover:text-[#FF8A00] transition leading-snug mb-3">
                  {guide.title}
                </h2>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
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
      </main>

      <Footer />
    </div>
  );
}
