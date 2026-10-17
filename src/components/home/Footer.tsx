import Link from 'next/link';
import { Lock, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { AiLogo } from './Navbar';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#05070c] text-slate-600 dark:text-slate-400 transition-colors duration-200">
      {/* ── Main Developer Footer Columns ── */}
      <div className="px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="mb-4 inline-flex items-center gap-2">
                <AiLogo />
              </Link>
              <p className="max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400 mt-3 font-normal">
                The open developer operating system and intelligence suite for artificial intelligence — curated zero-latency tools, AST code converters, model diagnostics, and technical documentation.
              </p>

              {/* Trust & Engineering Security Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3 py-1 shadow-2xs">
                  <Lock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Developer Workbench</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3 py-1 shadow-2xs">
                  <ShieldCheck className="h-3 w-3 text-[#FF8A00] dark:text-[#FF8A00]" />
                  <span>Zero Server Logging</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3 py-1 shadow-2xs">
                  <Cpu className="h-3 w-3 text-orange-500 dark:text-orange-400" />
                  <span>Edge WASM</span>
                </div>
              </div>
            </div>

            {/* Column 1: Code Converters */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Code Converters
              </h4>
              <ul className="space-y-2.5 text-xs font-sans">
                <li>
                  <Link href="/tools/css-to-html" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    CSS → HTML Scaffolder
                  </Link>
                </li>
                <li>
                  <Link href="/tools/html-to-python-ast" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    HTML → Python AST
                  </Link>
                </li>
                <li>
                  <Link href="/tools/json-to-yaml" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    JSON ↔ YAML Stream
                  </Link>
                </li>
                <li>
                  <Link href="/tools/js-to-ts" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    JS → TypeScript Strict
                  </Link>
                </li>
                <li>
                  <Link href="/tools/svg-to-jsx" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    SVG → JSX Component
                  </Link>
                </li>
                <li>
                  <Link href="/tools/sql-to-schema-orm" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    SQL → Schema ORM
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: AI Studio */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                AI Studio
              </h4>
              <ul className="space-y-2.5 text-xs font-sans">
                <li>
                  <Link href="/ai-tools/coding" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    AI Syntax Debugger
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/writing" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    Prompt Optimizer Pro
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    RegEx Neural Generator
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    Unit Test Synthesizer
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/text" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    Markdown Live Canvas
                  </Link>
                </li>
                <li>
                  <Link href="/calculators" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    19+ Calculators Suite
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools" className="font-semibold text-[#FF8A00] dark:text-[#FF8A00] hover:underline flex items-center gap-1 pt-1">
                    All Utilities Suite →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Documentation & APIs */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Documentation & APIs
              </h4>
              <ul className="space-y-2.5 text-xs font-sans">
                <li>
                  <Link href="/glossary" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    Neural Terms Glossary
                  </Link>
                </li>
                <li>
                  <a
                    href="https://aiiseverythingback.vercel.app/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors"
                  >
                    <span>OpenAPI / Swagger</span>
                    <ArrowUpRight className="h-3 w-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://aiiseverythingback.vercel.app/health"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors"
                  >
                    <span>Health Metrics</span>
                    <ArrowUpRight className="h-3 w-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://aiiseverythingdashboard.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors"
                  >
                    <span>Admin Control Center</span>
                    <ArrowUpRight className="h-3 w-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    Privacy & Legal Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-500 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Metadata & Status Bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-8 text-xs font-mono text-slate-500 dark:text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} AiTools Studio. Open Developer Platform.</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono text-[11px]">
                All Browser Engines Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
