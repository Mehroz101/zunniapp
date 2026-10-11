'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Code,
  Pen,
  Image as ImageIcon,
  Brain,
  Search,
  BarChart3,
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  Zap,
  Layers,
} from 'lucide-react';

/* ==============================================================================
   BESPOKE LOGO COMPONENT (AIIsEverything)
   ============================================================================== */
export function AiLogo({ className = '', compact = false, isDark = false }: { className?: string; compact?: boolean; isDark?: boolean }) {
  return (
    <div className={`flex items-center gap-3 sm:gap-3.5 select-none ${className}`}>
      {/* ── 1. Vector Brand Monogram ── */}
      <div className="relative flex-shrink-0 group cursor-pointer">
        <svg
          width={compact ? '36' : '42'}
          height={compact ? '36' : '42'}
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
        >
          <defs>
            <radialGradient id="aiLogoBgGrad" cx="30%" cy="25%" r="80%">
              <stop offset="0%" stopColor="#111d33" />
              <stop offset="50%" stopColor="#0a1222" />
              <stop offset="100%" stopColor="#050810" />
            </radialGradient>

            <linearGradient id="aiLogoBorderGrad" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.15" />
            </linearGradient>

            <radialGradient id="aiLogoCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00D2FF" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="aiLogoLeftAscent" x1="13" y1="38" x2="26" y2="12" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00D2FF" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            <linearGradient id="aiLogoRightDescent" x1="26" y1="12" x2="39" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <linearGradient id="aiLogoWingGrad" x1="10" y1="28" x2="42" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#00D2FF" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Outer Squircle Emblem Tile */}
          <rect
            x="2"
            y="2"
            width="48"
            height="48"
            rx="14"
            fill="url(#aiLogoBgGrad)"
            stroke="url(#aiLogoBorderGrad)"
            strokeWidth="1.5"
          />

          {/* Core Ambient Glow */}
          <circle cx="26" cy="26" r="20" fill="url(#aiLogoCoreGlow)" />

          {/* Luminous Center AI Neural Core Divider */}
          <line
            x1="26"
            y1="20"
            x2="26"
            y2="37"
            stroke="#00D2FF"
            strokeWidth="1.5"
            strokeDasharray="2.5 2.5"
            strokeLinecap="round"
          />

          {/* Left Dynamic Vector Pylon */}
          <path
            d="M 14.5 37.5 L 23.8 13.2 C 24.5 11.5 25.8 11.5 26.5 13.2 L 28.5 18.5 L 24.5 22 L 20.5 33 L 19 37.5 Z"
            fill="url(#aiLogoLeftAscent)"
          />

          {/* Right Dynamic Vector Pylon */}
          <path
            d="M 26.5 13.2 C 27.2 11.5 28.5 11.5 29.2 13.2 L 37.5 37.5 L 33 37.5 L 31.5 33 L 27.5 22 L 29.5 18.5 Z"
            fill="url(#aiLogoRightDescent)"
          />

          {/* Supersonic Horizontal Bridge Wing */}
          <path
            d="M 11 28.5 L 26 24.5 L 41 28.5 L 26 26.8 Z"
            fill="url(#aiLogoWingGrad)"
          />

          {/* Apex Satellite GPS AI Beacon */}
          <circle cx="26" cy="11.5" r="2.2" fill="#ffffff" />
          <circle cx="26" cy="11.5" r="4.2" stroke="#00D2FF" strokeWidth="1" opacity="0.75" />
        </svg>
      </div>

      {/* ── 2. Brand Typography Lockup ── */}
      {!compact && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[19px] sm:text-[21px] font-black tracking-[-0.03em] ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              AIIsEverything
            </span>
            <span
              className={`text-[18px] sm:text-[20px] font-extrabold tracking-[-0.02em] ${
                isDark ? 'text-[#00D2FF]' : 'text-[#0092c7]'
              }`}
            >
              .com
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[8.5px] font-bold uppercase tracking-[0.18em] ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              AI FOR EVERY CORNER OF LIFE
            </span>
            <span className={`text-[9px] ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>•</span>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-mono font-semibold ${
                isDark
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% FREE ACCESS
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==============================================================================
   MAIN NAVBAR COMPONENT (FLOATING PILL HEYGEN DESIGN)
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
    }, 180);
  };

  const toolsData = [
    { name: 'Coding & Developer Tools', href: '/ai-tools/coding', desc: 'Code converters, formatters & debuggers' },
    { name: 'AI Writing & Essays', href: '/ai-tools/writing', desc: 'Article generators, rewriters & assistants' },
    { name: 'Image Processing & Vision', href: '/ai-tools/image', desc: 'AI visual editors & generators' },
    { name: 'Text & NLP Utilities', href: '/ai-tools/text', desc: 'Summarizers, analyzers & word counters' },
    { name: 'SEO & Meta Tag Builders', href: '/ai-tools/seo', desc: 'Schema generators & search optimization' },
    { name: 'Data & Analytics Tools', href: '/ai-tools/data', desc: 'Data converters & formatting engines' },
  ];

  const blogData = [
    { name: 'AI News & Breakthroughs', href: '/blog', desc: 'Daily frontier model news' },
    { name: 'Technical Tutorials', href: '/blog', desc: 'Step-by-step engineering walkthroughs' },
    { name: 'Model Reviews & Tests', href: '/blog', desc: 'Claude vs GPT-4o vs Gemini evaluations' },
    { name: 'Prompt Engineering', href: '/blog', desc: 'High-leverage prompts & strategies' },
  ];

  const categoriesData = [
    { name: 'AI Writing', href: '/ai-tools/writing' },
    { name: 'Coding Tools', href: '/ai-tools/coding' },
    { name: 'AI Image', href: '/ai-tools/image' },
    { name: 'Text Tools', href: '/ai-tools/text' },
    { name: 'SEO Tools', href: '/ai-tools/seo' },
    { name: 'Data Tools', href: '/ai-tools/data' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      {/* ── 1. Top Utility Credibility Strip (Deep Obsidian Bar) ── */}
      <div className="w-full text-[11px] py-1.5 px-4 select-none bg-[#090e17] text-slate-300 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left: Live Neural Network Active */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              24/7 AI Engine Online · 50+ Free Tools
            </span>
            <span className="hidden md:inline opacity-30 text-slate-500">|</span>
            <span className="hidden md:inline text-[10px] font-mono tracking-wider text-slate-400">
              Zero Paywalls · No Signup Required · Instant Browser-Side Execution
            </span>
          </div>

          {/* Right: Quick Action Links */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto text-xs">
            <Link
              href="/ai-tools"
              className="text-[#00D2FF] hover:text-[#7dd3fc] font-semibold transition-colors"
            >
              Browse Directory
            </Link>
            <span className="opacity-30 text-[#00D2FF]">|</span>
            <Link
              href="/blog"
              className="hidden sm:inline text-[#00D2FF] hover:text-[#7dd3fc] font-semibold transition-colors"
            >
              Tech Blog
            </Link>
            <span className="opacity-30 hidden sm:inline text-[#00D2FF]">|</span>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00D2FF] hover:text-[#7dd3fc] font-bold transition-colors flex items-center gap-1.5 bg-white/5 px-2.5 py-0.5 rounded-full border border-[#00D2FF]/30"
              title="Admin Control Center"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#00D2FF]" />
              Dashboard ↗
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. Floating Pill-Shaped Navbar (HeyGen Pure White Canvas) ── */}
      <div className="max-w-[1320px] mx-auto pt-2.5 px-3 sm:px-4">
        <nav className="w-full bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.06)] px-4 sm:px-6 py-2.5 flex items-center justify-between relative transition-all">
          {/* Left: Brand Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <AiLogo compact={false} isDark={false} />
            </Link>
          </div>

          {/* Center Navigation Links with Modern Dropdowns */}
          <div className="hidden lg:flex items-center gap-3.5 xl:gap-5 flex-nowrap">
            {/* 1. AI Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('tools')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-[13.5px] font-medium text-slate-700 hover:text-slate-950 transition-colors py-1 cursor-pointer whitespace-nowrap"
              >
                <span>AI Tools</span>
                <span className="text-[10px] text-slate-400">▾</span>
              </button>

              {activeDropdown === 'tools' && (
                <div
                  className="absolute top-full left-0 w-[480px] pt-3 z-50 animate-fadeIn"
                  onMouseEnter={() => handleMouseEnter('tools')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-4 grid grid-cols-2 gap-3">
                    {toolsData.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="group p-2 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#0092c7] transition">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.desc}
                        </div>
                      </Link>
                    ))}
                    <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href="/ai-tools"
                        onClick={() => setActiveDropdown(null)}
                        className="text-xs font-bold text-[#0092c7] hover:underline flex items-center gap-1"
                      >
                        <span>Explore All 50+ AI Tools</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('categories')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-[13.5px] font-medium text-slate-700 hover:text-slate-950 transition-colors py-1 cursor-pointer whitespace-nowrap"
              >
                <span>Categories</span>
                <span className="text-[10px] text-slate-400">▾</span>
              </button>

              {activeDropdown === 'categories' && (
                <div
                  className="absolute top-full left-0 w-[240px] pt-3 z-50 animate-fadeIn"
                  onMouseEnter={() => handleMouseEnter('categories')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-3 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100 px-2">
                      Tool Domains
                    </div>
                    {categoriesData.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="block text-xs text-slate-700 hover:text-[#0092c7] hover:bg-slate-50 rounded-lg px-2.5 py-1.5 transition-colors font-medium"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Tech Blog Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('blog')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-[13.5px] font-medium text-slate-700 hover:text-slate-950 transition-colors py-1 cursor-pointer whitespace-nowrap"
              >
                <span>Tech Blog</span>
                <span className="text-[10px] text-slate-400">▾</span>
              </button>

              {activeDropdown === 'blog' && (
                <div
                  className="absolute top-full left-0 w-[360px] pt-3 z-50 animate-fadeIn"
                  onMouseEnter={() => handleMouseEnter('blog')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100">
                      Editorial & Insights
                    </div>
                    {blogData.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="block group p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#0092c7] transition">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500">{item.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Glossary Link */}
            <Link
              href="/glossary"
              className="text-[13.5px] font-medium text-slate-700 hover:text-slate-950 transition-colors py-1 whitespace-nowrap"
            >
              Glossary
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/ai-tools"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 transition px-3 py-2 rounded-full hover:bg-slate-100"
            >
              <span>Directory</span>
            </Link>

            <Link
              href="/ai-tools"
              className="px-5 py-2.5 rounded-full font-extrabold text-[12px] uppercase tracking-wider text-black bg-[#00D2FF] hover:bg-[#00bee6] active:scale-95 shadow-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>EXPLORE FREE TOOLS</span>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 p-5 bg-white rounded-3xl border border-slate-200 shadow-2xl space-y-3 animate-fadeIn">
            <div className="flex flex-col space-y-2">
              <Link
                href="/ai-tools"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
              >
                All AI Tools
              </Link>
              <Link
                href="/ai-tools/coding"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Coding Tools
              </Link>
              <Link
                href="/ai-tools/writing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
              >
                AI Writing
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Tech Blog
              </Link>
              <Link
                href="/glossary"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
              >
                AI Glossary
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/ai-tools"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 rounded-full text-xs font-extrabold uppercase tracking-wider text-black bg-[#00D2FF] text-center shadow-sm"
              >
                EXPLORE FREE TOOLS
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
