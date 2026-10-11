'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Code2,
  Terminal,
  Cpu,
  Binary,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  HelpCircle,
  FileText,
  Boxes,
  Database,
  Menu,
  X,
} from 'lucide-react';

/* ==============================================================================
   ULTRA-MINIMALIST DEVELOPER LOGO
   ============================================================================== */
export function AiLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Sleek Minimalist Geometric Syntax/Neural Mark */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 group-hover:border-[#00D2FF]/50 transition-colors">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          {/* Subtle cyan hairline code & node lockup */}
          <path
            d="M6.5 8L2.5 12L6.5 16"
            stroke="#00D2FF"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 8L21.5 12L17.5 16"
            stroke="#00D2FF"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 6L10.5 18"
            stroke="#FFFFFF"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
          <circle cx="12" cy="12" r="1.5" fill="#00D2FF" />
        </svg>
        <div className="absolute inset-0 rounded-lg bg-[#00D2FF]/15 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Brand Typography */}
      <div className="flex items-baseline tracking-[-0.03em] font-bold text-[16px] text-white">
        <span>AIIsEverything</span>
        <span className="text-[#00D2FF] text-xs font-mono ml-0.5 tracking-normal">.com</span>
      </div>
    </div>
  );
}

/* ==============================================================================
   FLOATING HIGH-END DEVELOPER NAVBAR (NO TOP STRIP)
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

  const neuralHubItems = [
    { name: 'LLM Optimization Suite', desc: 'Context compression & prompt token analyzers', icon: Cpu, href: '/ai-tools/text' },
    { name: 'Neural Code Engine', desc: 'High-speed AST code generators & transducers', icon: Terminal, href: '/ai-tools/coding' },
    { name: 'Vector & Embeddings Hub', desc: 'Vector space diagnostics & cosine similarity', icon: Database, href: '/ai-tools/data' },
    { name: 'Vision AI Transcoder', desc: 'Neural upscaling, SVG synthesis & OCR parsing', icon: Layers, href: '/ai-tools/image' },
  ];

  const codeConverterItems = [
    { name: 'CSS → HTML Scaffolder', desc: 'Convert CSS styling into semantic HTML structure', icon: Code2, href: '/ai-tools/coding' },
    { name: 'HTML → Python AST', desc: 'Generate BeautifulSoup & scraper parsers', icon: Binary, href: '/ai-tools/coding' },
    { name: 'JSON → YAML Stream', desc: 'Bi-directional zero-loss configuration schema parser', icon: FileText, href: '/ai-tools/coding' },
    { name: 'JS → TypeScript Strict', desc: 'Automatic interface generation & strict typing', icon: Terminal, href: '/ai-tools/coding' },
    { name: 'SVG → JSX Component', desc: 'Clean React SVG components with Tailwind support', icon: Boxes, href: '/ai-tools/coding' },
    { name: 'SQL → Prisma Schema', desc: 'Extract SQL DDL into type-safe ORM models', icon: Database, href: '/ai-tools/coding' },
  ];

  const developerUtilityItems = [
    { name: 'AI Syntax Debugger', desc: 'Static code diagnostics with AST tree review', icon: Terminal, href: '/ai-tools/coding' },
    { name: 'Prompt Optimizer Pro', desc: 'System prompt latency & token compression', icon: Sparkles, href: '/ai-tools/writing' },
    { name: 'RegEx Neural Generator', desc: 'Natural language to zero-backtracking regex', icon: Code2, href: '/ai-tools/coding' },
    { name: 'Unit Test Builder', desc: 'Generate Vitest & Jest suites instantly', icon: Binary, href: '/ai-tools/coding' },
    { name: 'Markdown Live Editor', desc: 'Real-time GFM preview with KaTeX & mermaid', icon: FileText, href: '/ai-tools/text' },
    { name: 'Tailwind Class Converter', desc: 'Arbitrary CSS to modern Tailwind utility classes', icon: Layers, href: '/ai-tools/coding' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-3 sm:px-6 pt-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Floating Pill Nav Container */}
        <nav className="w-full bg-[#080b12]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between pointer-events-auto transition-all">
          {/* Left: Minimalist Brand Lockup */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <AiLogo />
            </Link>
          </div>

          {/* Center: Developer Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* 1. AI Neural Hub */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('neural')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1 text-[13px] font-medium px-3 py-1.5 rounded-full transition-colors ${
                  activeDropdown === 'neural' ? 'text-white bg-white/[0.06]' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>AI Neural Hub</span>
                <span className="text-[10px] text-slate-500">▾</span>
              </button>

              {activeDropdown === 'neural' && (
                <div
                  className="absolute top-full left-0 w-[420px] pt-3 z-50 animate-fadeIn"
                  onMouseEnter={() => handleMouseEnter('neural')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-[#0b0f19] rounded-2xl border border-white/10 shadow-2xl p-3.5 grid grid-cols-1 gap-1.5 backdrop-blur-2xl">
                    <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#00D2FF]">
                      Neural Compute & Models
                    </div>
                    {neuralHubItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="group flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#00D2FF] group-hover:border-[#00D2FF]/40 transition">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Code Converters */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('converters')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1 text-[13px] font-medium px-3 py-1.5 rounded-full transition-colors ${
                  activeDropdown === 'converters' ? 'text-white bg-white/[0.06]' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Code Converters</span>
                <span className="text-[10px] text-slate-500">▾</span>
              </button>

              {activeDropdown === 'converters' && (
                <div
                  className="absolute top-full left-0 -ml-16 w-[500px] pt-3 z-50 animate-fadeIn"
                  onMouseEnter={() => handleMouseEnter('converters')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-[#0b0f19] rounded-2xl border border-white/10 shadow-2xl p-3.5 grid grid-cols-2 gap-2 backdrop-blur-2xl">
                    <div className="col-span-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#00D2FF]">
                      High-Precision Code Transpilers
                    </div>
                    {codeConverterItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="group p-2 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/[0.06]"
                      >
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-[#00D2FF] transition flex items-center gap-1.5">
                          <span>{item.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {item.desc}
                        </div>
                      </Link>
                    ))}
                    <div className="col-span-2 pt-2 border-t border-white/[0.06] flex items-center justify-between px-2">
                      <Link
                        href="/ai-tools/coding"
                        onClick={() => setActiveDropdown(null)}
                        className="text-[11px] font-mono text-[#00D2FF] hover:underline flex items-center gap-1"
                      >
                        <span>View all code transcoders</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Developer Utilities */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('utilities')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1 text-[13px] font-medium px-3 py-1.5 rounded-full transition-colors ${
                  activeDropdown === 'utilities' ? 'text-white bg-white/[0.06]' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Developer Utilities</span>
                <span className="text-[10px] text-slate-500">▾</span>
              </button>

              {activeDropdown === 'utilities' && (
                <div
                  className="absolute top-full left-0 -ml-28 w-[480px] pt-3 z-50 animate-fadeIn"
                  onMouseEnter={() => handleMouseEnter('utilities')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-[#0b0f19] rounded-2xl border border-white/10 shadow-2xl p-3.5 grid grid-cols-2 gap-2 backdrop-blur-2xl">
                    <div className="col-span-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#00D2FF]">
                      Client-Side Engineering Utilities
                    </div>
                    {developerUtilityItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="group p-2 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/[0.06]"
                      >
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {item.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Resources & Docs */}
            <Link
              href="/glossary"
              className="text-[13px] font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/[0.04] transition-colors"
            >
              Resources & Docs
            </Link>

            {/* 5. FAQs */}
            <a
              href="#faqs"
              className="text-[13px] font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/[0.04] transition-colors"
            >
              FAQs
            </a>
          </div>

          {/* Right: Modern Sleek Action CTA */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/ai-tools"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/[0.04] transition"
            >
              <span>Directory</span>
            </Link>

            <Link
              href="/ai-tools"
              className="px-4 py-2 rounded-full font-mono text-xs font-semibold text-black bg-[#00D2FF] hover:bg-[#38bdf8] active:scale-95 shadow-[0_0_20px_rgba(0,210,255,0.35)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>LAUNCH STUDIO</span>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.05]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 p-5 bg-[#0b0f19]/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl space-y-3 pointer-events-auto animate-fadeIn">
          <div className="flex flex-col space-y-1">
            <Link
              href="/ai-tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.05] rounded-xl transition-colors"
            >
              AI Neural Hub
            </Link>
            <Link
              href="/ai-tools/coding"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.05] rounded-xl transition-colors"
            >
              Code Converters
            </Link>
            <Link
              href="/ai-tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.05] rounded-xl transition-colors"
            >
              Developer Utilities
            </Link>
            <Link
              href="/glossary"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.05] rounded-xl transition-colors"
            >
              Resources & Docs
            </Link>
            <a
              href="#faqs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.05] rounded-xl transition-colors"
            >
              FAQs
            </a>
          </div>

          <div className="pt-3 border-t border-white/10">
            <Link
              href="/ai-tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-[#00D2FF] text-center block"
            >
              LAUNCH STUDIO
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
