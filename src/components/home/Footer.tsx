import Link from 'next/link';
import { Lock, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { AiLogo } from './Navbar';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/90 bg-white text-slate-600">
      {/* ── Main Developer Footer Columns ── */}
      <div className="px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="mb-4 inline-flex items-center gap-2">
                <AiLogo />
              </Link>
              <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-500 mt-3 font-normal">
                The open developer operating system and intelligence suite for artificial intelligence — curated zero-latency tools, AST code converters, model diagnostics, and technical documentation.
              </p>

              {/* Trust & Engineering Security Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5 text-[11px] font-mono text-slate-600">
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-2xs">
                  <Lock className="h-3 w-3 text-emerald-600" />
                  <span>Client-Side Sandbox</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-2xs">
                  <ShieldCheck className="h-3 w-3 text-[#0092c7]" />
                  <span>Zero Server Logging</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-2xs">
                  <Cpu className="h-3 w-3 text-indigo-600" />
                  <span>Edge WASM</span>
                </div>
              </div>
            </div>

            {/* Column 1: Code Converters */}
            <div>
              <h4 className="mb-4 text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Code Converters
              </h4>
              <ul className="space-y-2.5 text-xs font-mono">
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-slate-950">
                    CSS → HTML Scaffolder
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-slate-950">
                    HTML → Python AST
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-slate-950">
                    JSON ↔ YAML Stream
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-slate-950">
                    JS → TypeScript Strict
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-slate-950">
                    SVG → JSX Component
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-slate-950">
                    SQL → Schema ORM
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: AI Studio */}
            <div>
              <h4 className="mb-4 text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                AI Studio
              </h4>
              <ul className="space-y-2.5 text-xs font-mono">
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-slate-950">
                    AI Syntax Debugger
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/writing" className="transition hover:text-slate-950">
                    Prompt Optimizer Pro
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-slate-950">
                    RegEx Neural Generator
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/coding" className="transition hover:text-slate-950">
                    Unit Test Synthesizer
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools/text" className="transition hover:text-slate-950">
                    Markdown Live Canvas
                  </Link>
                </li>
                <li>
                  <Link href="/ai-tools" className="font-semibold text-[#0092c7] hover:text-indigo-600 flex items-center gap-1 pt-1">
                    All Utilities Suite →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Documentation & APIs */}
            <div>
              <h4 className="mb-4 text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Documentation & APIs
              </h4>
              <ul className="space-y-2.5 text-xs font-mono">
                <li>
                  <Link href="/glossary" className="transition hover:text-slate-950">
                    Neural Terms Glossary
                  </Link>
                </li>
                <li>
                  <a
                    href="https://aiiseverythingback.vercel.app/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-700 hover:text-slate-950 transition"
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
                    className="flex items-center gap-1 text-slate-700 hover:text-slate-950 transition"
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
                    className="flex items-center gap-1 text-slate-700 hover:text-slate-950 transition"
                  >
                    <span>Admin Control Center</span>
                    <ArrowUpRight className="h-3 w-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="transition hover:text-slate-950">
                    Privacy & Legal Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition hover:text-slate-950">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-xs font-mono text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} AiTools Studio. Open Developer Platform.</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 font-semibold">All Sandbox Engines Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
