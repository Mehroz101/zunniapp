'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Code2,
  Terminal,
  Binary,
  ArrowRight,
  Zap,
  FileText,
  Boxes,
  Database,
  Menu,
  X,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

/* ==============================================================================
   ULTRA-MINIMALIST DEVELOPER LOGO (ADAPTS TO BOTH LIGHT AND DARK THEMES)
   ============================================================================== */
export function AiLogo({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950 dark:bg-slate-900/95 border border-slate-800 dark:border-slate-700/80 shadow-xs dark:ring-1 dark:ring-cyan-500/20 transition-all duration-200 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(0,210,255,0.15)] select-none group cursor-pointer ${className}`}
    >
      {/* Sleek Geometric SVG Syntax / Spark Mark */}
      <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-110"
        >
          {/* Hairline Neon-Cyan Syntax Brackets */}
          <path
            d="M6 8L2 12L6 16"
            stroke="#00D2FF"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 8L22 12L18 16"
            stroke="#00D2FF"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pure White Syntax Transcoder Slash */}
          <path
            d="M14 4.5L10 19.5"
            stroke="#FFFFFF"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeOpacity="0.9"
          />
          {/* Central 4-Point Geometric Spark */}
          <path
            d="M12 9.5L13.2 12L12 14.5L10.8 12Z"
            fill="#00D2FF"
          />
          <circle cx="12" cy="12" r="1" fill="#FFFFFF" />
        </svg>
      </div>

      {/* High-End Developer Suite Typography Lockup */}
      <div className="flex items-baseline tracking-[-0.04em] font-extrabold text-[15px] text-white">
        <span className="text-white">AiTools</span>
        <span className="text-slate-400 dark:text-slate-300 font-semibold ml-1 text-[13px] tracking-normal">
          Studio
        </span>
        <span className="text-[#00D2FF] text-[9.5px] font-mono ml-2 px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-800/80 font-bold uppercase tracking-wider">
          DEV
        </span>
      </div>
    </div>
  );
}

/* ==============================================================================
   FLOATING HIGH-END DEVELOPER NAVBAR WITH SUN/MOON THEME CONTROLLER
   ============================================================================== */
export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const codeConverterItems = [
    { name: 'CSS → HTML Scaffolder', desc: 'Convert CSS styling into semantic HTML structure', icon: Code2, href: '/tools/css-to-html' },
    { name: 'HTML → Python AST', desc: 'Generate BeautifulSoup & scraper parsers', icon: Binary, href: '/tools/html-to-python-ast' },
    { name: 'JSON → YAML Stream', desc: 'Bi-directional zero-loss configuration schema parser', icon: FileText, href: '/tools/json-to-yaml' },
    { name: 'JS → TypeScript Strict', desc: 'Automatic interface generation & strict typing', icon: Terminal, href: '/tools/js-to-ts' },
    { name: 'SVG → JSX Component', desc: 'Clean React SVG components with Tailwind support', icon: Boxes, href: '/tools/svg-to-jsx' },
    { name: 'SQL → Schema ORM', desc: 'Extract SQL DDL into Prisma, Drizzle & TypeORM models', icon: Database, href: '/tools/sql-to-schema-orm' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 pt-4 pointer-events-none">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Floating Pill Nav Container */}
        <nav className="w-full bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-full px-5 sm:px-7 py-2.5 flex items-center justify-between pointer-events-auto transition-all">
          {/* Left: Minimalist Brand Lockup */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <AiLogo />
            </Link>
          </div>

          {/* Center: Exactly 5 Desktop Category Taxonomy Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* 1. Finance */}
            <Link
              href="/calculators?tab=financial"
              className="text-[13.5px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-3.5 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              Finance
            </Link>

            {/* 2. Calculators */}
            <Link
              href="/calculators"
              className="text-[13.5px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-3.5 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              Calculators
            </Link>

            {/* 3. Dev & Web */}
            <Link
              href="/tools?category=dev"
              className="text-[13.5px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-3.5 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              Dev & Web
            </Link>

            {/* 4. Code Converters (With Interactive Compiler Flyout) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('converters')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/tools"
                className={`inline-flex items-center gap-1 text-[13.5px] font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                  activeDropdown === 'converters'
                    ? 'text-slate-950 dark:text-white bg-slate-100 dark:bg-slate-800'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <span>Code Converters</span>
                <span className="text-[10px] text-slate-400">▾</span>
              </Link>

              {activeDropdown === 'converters' && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[520px] pt-3 z-50 animate-fadeIn"
                  onMouseEnter={() => handleMouseEnter('converters')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-white dark:bg-[#0c1220] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 grid grid-cols-2 gap-2">
                    <div className="col-span-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#00D2FF]">
                      Production AST Compilers & Transpilers
                    </div>
                    {codeConverterItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#00D2FF] group-hover:bg-[#00D2FF]/10 transition">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#00D2FF] transition">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-2">
                      <Link
                        href="/tools"
                        onClick={() => setActiveDropdown(null)}
                        className="text-[11px] font-mono text-[#00D2FF] hover:underline flex items-center gap-1"
                      >
                        <span>View all code conversion engines</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Text & Utilities */}
            <Link
              href="/tools?category=text"
              className="text-[13.5px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-3.5 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              Text & Utilities
            </Link>
          </div>

          {/* Right Action: Single-click Theme Toggle + Primary CTA Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            {/* Primary CTA button: "Explore All Tools" */}
            <Link
              href="/tools"
              className="px-4 py-2 rounded-full font-mono text-xs font-bold text-slate-950 bg-[#00D2FF] hover:bg-[#38bdf8] active:scale-95 shadow-[0_0_15px_rgba(0,210,255,0.25)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>Explore All Tools</span>
            </Link>

            {/* Circular Sun/Moon Icon Theme Toggle Button (Adjacent to Primary CTA) */}
            <ThemeToggle />

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden max-w-[1440px] mx-auto mt-2 p-5 bg-white dark:bg-[#0c1220] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 pointer-events-auto animate-fadeIn">
          <div className="flex flex-col space-y-1">
            <Link
              href="/calculators?tab=financial"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Finance
            </Link>
            <Link
              href="/calculators"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Calculators
            </Link>
            <Link
              href="/tools?category=dev"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Dev & Web
            </Link>
            <Link
              href="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Code Converters
            </Link>
            <Link
              href="/tools?category=text"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Text & Utilities
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link
              href="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 rounded-full font-mono text-xs font-bold text-slate-950 bg-[#00D2FF] hover:bg-[#38bdf8] flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Explore All Tools</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
