import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Boxes,
  Code2,
  Terminal,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  Zap,
  Cpu,
  FileCode,
  Layers,
  Database,
  Binary,
} from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

export const metadata: Metadata = {
  title: 'AI Toolkits & Developer Workflow Suites | AiTools Studio',
  description:
    'Curated, high-velocity AI toolkits for frontend developers, prompt engineers, SEO architects, and full-stack system designers.',
  openGraph: {
    title: 'AI Toolkits & Developer Workflow Suites',
    description: 'Curated suites of AI tools and browser-native compilers engineered for high throughput.',
    url: 'https://aiisevery.vercel.app/toolkits',
    siteName: 'AiTools Studio',
  },
  alternates: {
    canonical: 'https://aiisevery.vercel.app/toolkits',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TOOLKITS = [
  {
    id: 'developer-core',
    title: 'Full-Stack Developer Toolkit',
    badge: 'CORE SUITE',
    icon: Code2,
    color: 'text-[#FF8A00]',
    bg: 'bg-orange-500/10',
    description:
      'High-performance AST converters and strict typing engines designed for instant code transpilation without external CLI overhead.',
    tools: [
      { name: 'CSS to HTML Scaffolder', href: '/tools/css-to-html', desc: 'Reverse-engineer styles into semantic JSX/HTML trees' },
      { name: 'JS to TypeScript Strict', href: '/tools/js-to-ts', desc: 'Auto-generate interfaces and strict type boundaries' },
      { name: 'SQL to Prisma ORM', href: '/tools/sql-to-schema-orm', desc: 'Transpile SQL DDL schemas into type-safe ORM models' },
      { name: 'SVG to JSX Component', href: '/tools/svg-to-jsx', desc: 'Optimize raw SVGs into clean, tree-shakeable React components' },
    ],
  },
  {
    id: 'seo-crawler',
    title: 'Technical SEO & Crawler Diagnostics',
    badge: 'SEARCH & GEO',
    icon: Search,
    color: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    description:
      'End-to-end diagnostic suite for webmasters and growth engineers auditing crawl budgets, robot directives, and schema integrity.',
    tools: [
      { name: 'Robots.txt Syntax Validator', href: '/tools/robots-txt-validator', desc: 'Parse user-agents, disallow rules, and sitemap directives' },
      { name: 'XML Sitemap Auditor', href: '/tools/sitemap-validator', desc: 'Validate URL structures, change frequencies, and index tags' },
      { name: 'JSON-LD Schema Builder', href: '/tools/schema-generator', desc: 'Build rich Google snippets for articles, FAQs, and software' },
      { name: 'SERP Meta Tag Inspector', href: '/tools/meta-tag-generator', desc: 'Simulate pixel widths across mobile and desktop search viewports' },
    ],
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering & LLM Harness',
    badge: 'AI OPTIMIZER',
    icon: Sparkles,
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    description:
      'Token-efficient prompt compressors, role assignment templates, and context window optimization tools for frontier LLMs.',
    tools: [
      { name: 'Prompt Context Compressor', href: '/tools?category=ai', desc: 'Strip token redundancies and maximize KV-cache reuse' },
      { name: 'Regex Synthesis Studio', href: '/tools/regex-tester', desc: 'Synthesize PCRE patterns and capture groups deterministically' },
      { name: 'HTML to Python AST Scraper', href: '/tools/html-to-python-ast', desc: 'Extract DOM selectors into automated BeautifulSoup pipelines' },
      { name: 'JSON to YAML Transcoder', href: '/tools/json-to-yaml', desc: 'Zero-loss stream parsing for LLM agent function manifests' },
    ],
  },
  {
    id: 'security-utilities',
    title: 'Application Security & Dev Utilities',
    badge: 'ZERO-TELEMETRY',
    icon: ShieldCheck,
    color: 'text-purple-500 dark:text-purple-400',
    bg: 'bg-purple-500/10',
    description:
      'Zero-log cryptographic engines executing 100% locally with zero-latency without transmitting sensitive payload hashes over the wire.',
    tools: [
      { name: 'JWT Secret Inspector', href: '/tools/jwt-debugger', desc: 'Decode header, claims payload, and verify HS256 signatures locally' },
      { name: 'Base64 WASM Studio', href: '/tools/base64-encoder-decoder', desc: 'Bi-directional text and image encoding with high throughput' },
      { name: 'UUID v4 Batch Engine', href: '/tools/uuid-generator', desc: 'RFC4122 compliant collision-resistant identifier synthesis' },
      { name: 'Cron Syntax Evaluator', href: '/tools/cron-job-parser', desc: 'Translate 5-field cron schedules into human-readable schedules' },
    ],
  },
];

export default function ToolkitsHubPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar />

      <main className="relative pt-32 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-md">
            <Cpu className="h-3.5 w-3.5 text-[#FF8A00]" />
            <span>CURATED DEVELOPER WORKFLOW SUITES</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
            Integrated AI &amp;{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
              Developer Toolkits
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Eliminate context switching. Each toolkit packages complementary AST compilers, validators, and diagnostics into unified workflows.
          </p>
        </div>

        {/* Toolkit Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {TOOLKITS.map((toolkit) => {
            const Icon = toolkit.icon;
            return (
              <div
                key={toolkit.id}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] p-6 sm:p-8 shadow-xs hover:border-orange-500/40 dark:hover:border-orange-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl ${toolkit.bg} ${toolkit.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                          {toolkit.title}
                        </h2>
                        <span className="text-[10px] font-mono font-bold text-[#FF8A00] uppercase tracking-wider">
                          {toolkit.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {toolkit.description}
                  </p>

                  {/* Included Tools */}
                  <div className="space-y-2.5">
                    {toolkit.tools.map((tool) => (
                      <Link
                        key={tool.name}
                        href={tool.href}
                        className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#FF8A00] transition truncate">
                            {tool.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {tool.desc}
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#FF8A00] group-hover:translate-x-0.5 transition shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    4 Included Production Engines
                  </span>
                  <Link
                    href="/tools"
                    className="text-xs font-bold text-[#FF8A00] hover:underline flex items-center gap-1"
                  >
                    <span>Launch Tools</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
