import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '@/components/brand/BrandLogo';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#05070c] text-slate-600 dark:text-slate-400 transition-colors duration-200">
      {/* ── Main Editorial Footer Section ── */}
      <div className="px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="mb-4 inline-flex items-center gap-2">
                <BrandLogo />
              </Link>
              <p className="max-w-md text-xs sm:text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mt-4 font-normal">
                TOOLty is your free online utility workbench. We empower developers, creators, and professionals to explore, calculate, and convert with 100% free online tools, financial calculators, and developer utilities.
              </p>
            </div>

            {/* Column 1: Code Converters */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-tight text-slate-900 dark:text-slate-100">
                Code Converters
              </h4>
              <ul className="space-y-2.5 text-xs font-sans">
                <li>
                  <Link href="/tools/ascii-to-hex" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    ASCII ↔ Hex Converter
                  </Link>
                </li>
                <li>
                  <Link href="/tools/base64-to-text" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    Base64 ↔ Text Decoder
                  </Link>
                </li>
                <li>
                  <Link href="/tools/hex-to-pantone" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    Hex Code ↔ Pantone (PMS)
                  </Link>
                </li>
                <li>
                  <Link href="/tools/decimal-to-ascii" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    Decimal ↔ ASCII Translator
                  </Link>
                </li>
                <li>
                  <Link href="/tools/css-to-html" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    CSS → HTML Scaffolder
                  </Link>
                </li>
                <li>
                  <Link href="/tools/html-to-python-ast" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    HTML → Python AST
                  </Link>
                </li>
                <li>
                  <Link href="/tools/json-to-yaml" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    JSON ↔ YAML Stream
                  </Link>
                </li>
                <li>
                  <Link href="/tools/js-to-ts" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    JS → TypeScript Strict
                  </Link>
                </li>
                <li>
                  <Link href="/tools/svg-to-jsx" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    SVG → JSX Component
                  </Link>
                </li>
                <li>
                  <Link href="/tools/sql-to-schema-orm" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    SQL → Schema ORM
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: AI Studio & Toolkits */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-tight text-slate-900 dark:text-slate-100">
                AI Studio &amp; Toolkits
              </h4>
              <ul className="space-y-2.5 text-xs font-sans">
                <li>
                  <Link href="/ai-tools" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    AI Tools Directory
                  </Link>
                </li>
                <li>
                  <Link href="/toolkits" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    Curated AI Toolkits
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    Engineering Masterclasses
                  </Link>
                </li>
                <li>
                  <Link href="/calculators/finance" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    Financial Calculators
                  </Link>
                </li>
                <li>
                  <Link href="/calculators/scientific" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    Scientific &amp; Math Engines
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="font-semibold text-[#FF8A00] hover:underline flex items-center gap-1 pt-1">
                    Explore All Tools Suite →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform & Legal */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-tight text-slate-900 dark:text-slate-100">
                Platform &amp; Legal
              </h4>
              <ul className="space-y-2.5 text-xs font-sans">
                <li>
                  <Link href="/blog" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    AI News &amp; Dispatches
                  </Link>
                </li>
                <li>
                  <Link href="/glossary" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    Neural Terms Glossary
                  </Link>
                </li>
                <li>
                  <a
                    href="https://aiiseverythingdashboard.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed"
                  >
                    <span>Admin Control Center</span>
                    <ArrowUpRight className="h-3 w-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors leading-relaxed">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Metadata & Status Bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-8 text-xs font-mono text-slate-500 dark:text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} TOOLty. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono text-[11px]">
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
