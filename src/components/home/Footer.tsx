import Link from 'next/link';
import { Lock, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { AiLogo } from './Navbar';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#05070d] text-slate-400">
      {/* ── Main Developer Footer Columns ── */}
      <div className="px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="mb-4 inline-flex items-center gap-2">
                <AiLogo />
              </Link>
              <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-400 mt-3 font-normal">
                The open developer operating system and intelligence suite for artificial intelligence — curated zero-latency tools, AST code converters, model diagnostics, and technical documentation.
              </p>

              {/* Trust & Engineering Security Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  <span>Client-Side Sandbox</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">
                  <ShieldCheck className="h-3 w-3 text-[#00D2FF]" />
                  <span>Zero Server Logging</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">
                  <Cpu className="h-3 w-3 text-indigo-400" />
                  <span>Edge WASM</span>
                </div>
              </div>
            </div>

            {/* Column 1: Code Converters */}
            <div>
              <h4 className="mb-4 text-xs font-mono font-bold uppercase tracking-wider text-white">
                Code Converters
              </h4>
              <ul className="space-y-2.5 text-xs font-mono">
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-white">
                    CSS → HTML Scaffolder
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-white">
                    HTML → Python AST
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-white">
                    JSON ↔ YAML Stream
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-white">
                    JS → TypeScript Strict
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-white">
                    SVG → JSX Component
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-white">
                    SQL → Schema ORM
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: AI Studio */}
            <div>
              <h4 className="mb-4 text-xs font-mono font-bold uppercase tracking-wider text-white">
                AI Studio
              </h4>
              <ul className="space-y-2.5 text-xs font-mono">
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-white">
                    AI Syntax Debugger
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/writing" className="transition hover:text-white">
                    Prompt Optimizer Pro
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-white">
                    RegEx Neural Generator
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-white">
                    Unit Test Synthesizer
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/text" className="transition hover:text-white">
                    Markdown Live Canvas
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools" className="font-semibold text-[#00D2FF] hover:text-[#38bdf8] flex items-center gap-1 pt-1">
                    All Utilities Suite →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Documentation & APIs */}
            <div>
              <h4 className="mb-4 text-xs font-mono font-bold uppercase tracking-wider text-white">
                Documentation & APIs
              </h4>
              <ul className="space-y-2.5 text-xs font-mono">
                <li>
                  <Link href="/glossary" className="transition hover:text-white">
                    Neural Terms Glossary
                  </Link>
                </li>
                <li>
                  <a
                    href="http://localhost:4000/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-300 hover:text-white transition"
                  >
                    <span>OpenAPI / Swagger</span>
                    <ArrowUpRight className="h-3 w-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="http://localhost:4000/health"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-300 hover:text-white transition"
                  >
                    <span>Health Metrics</span>
                    <ArrowUpRight className="h-3 w-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="http://localhost:3001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-300 hover:text-white transition"
                  >
                    <span>Admin Control Center</span>
                    <ArrowUpRight className="h-3 w-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="transition hover:text-white">
                    Privacy & Legal Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-xs font-mono text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} AIIsEverything.com. Open Developer Matrix.</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400">All Sandbox Engines Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
