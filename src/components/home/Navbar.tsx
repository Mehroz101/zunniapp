'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  DollarSign,
  TrendingUp,
  Car,
  Home,
  Briefcase,
  GraduationCap,
  PieChart,
  Atom,
  SlidersHorizontal,
  Box,
  Dumbbell,
  FlaskConical,
  BarChart2,
  Search,
  ShieldCheck,
  BookOpen,
  ChevronDown,
  Key,
  Layers,
  Globe,
  Clock,
  Activity,
  Hammer,
  Wheat,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

/* ==============================================================================
   BESPOKE ULTRA-MINIMALIST STUDIO LOGO (DYNAMIC THEME ADAPTIVE)
   ============================================================================== */
export function AiLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none group cursor-pointer ${className}`}>
      {/* Precision Geometric Vector Mark (Scales 16px to 256px) */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width="26"
          height="26"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200 group-hover:scale-105"
        >
          {/* Architectural Rounded Rhombus Frame */}
          <rect
            x="3"
            y="3"
            width="26"
            height="26"
            rx="7"
            stroke="currentColor"
            strokeWidth="2.2"
            className="text-slate-900 dark:text-white transition-colors"
          />
          {/* Sharp Geometric Monogram Apex (A) */}
          <path
            d="M10 21.5L16 9.5L22 21.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-900 dark:text-white transition-colors"
          />
          {/* Signature Studio Crossbar (T) in light orange */}
          <path
            d="M12.5 17.5H19.5"
            stroke="#FF8A00"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Studio Vertex Spark */}
          <circle cx="16" cy="9.5" r="1.5" fill="#FF8A00" />
        </svg>
      </div>

      <div className="flex items-center gap-1 leading-none select-none">
        <span className="font-sans text-[20px] sm:text-[22px] font-black tracking-[-0.03em] text-slate-900 dark:text-white transition-colors flex items-center">
          <span className="font-black text-slate-900 dark:text-white">TOOL</span>
          <span className="bg-gradient-to-tr from-[#FF8A00] via-[#FFA229] to-[#FF5500] bg-clip-text text-transparent font-black drop-shadow-[0_2px_8px_rgba(255,138,0,0.35)]">
            ty
          </span>
        </span>
      </div>
    </div>
  );
}

/* ==============================================================================
   MEGA-MENU DATA TAXONOMY & DIRECTORY ROUTING (5 CORE CATEGORIES)
   ============================================================================== */
// Mega-menu data extracted to navData.ts for code-splitting & zero-blocking parse
import { MEGA_MENUS } from './navData';

/* ==============================================================================
   FLOATING HIGH-END DEVELOPER NAVBAR WITH MEGA-MENUS & THEME CONTROLLER
   ============================================================================== */
export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Clear pending debounce timer
  const clearDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Trigger hover enter: opens menu immediately with zero delay
  const handleTriggerEnter = useCallback(
    (menuKey: string) => {
      clearDebounce();
      setActiveDropdown(menuKey);
    },
    [clearDebounce]
  );

  // Defensive 150ms leave debounce prevents flickering when moving from trigger to menu
  const handleNavLeave = useCallback(() => {
    clearDebounce();
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }, [clearDebounce]);

  // Entering navbar or dropdown cancels pending leave
  const handleNavEnter = useCallback(() => {
    clearDebounce();
  }, [clearDebounce]);

  // Click / touch toggle
  const handleToggle = (menuKey: string) => {
    clearDebounce();
    setActiveDropdown((prev) => (prev === menuKey ? null : menuKey));
  };

  // Click-outside and Escape key listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        clearDebounce();
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearDebounce();
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      clearDebounce();
    };
  }, [clearDebounce]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const activeMenu = MEGA_MENUS.find((m) => m.key === activeDropdown);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 pt-4 pointer-events-none">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between" ref={navRef}>
        {/* Floating Pill Nav Container: relative z-50 with no overflow clipping */}
        <nav
          className="relative z-50 w-full bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-full px-4 sm:px-6 py-2 flex items-center justify-between pointer-events-auto transition-all"
          onMouseEnter={handleNavEnter}
          onMouseLeave={handleNavLeave}
        >
          {/* Left: Minimalist Brand Lockup */}
          <div className="flex items-center flex-shrink-0">
            <Link
              href="/"
              onClick={() => setActiveDropdown(null)}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <AiLogo />
            </Link>
          </div>

          {/* Center: Desktop Mega-Menu Category Trigger Links & Dedicated AI Toolkits / Guides */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/toolkits"
              onClick={() => setActiveDropdown(null)}
              className="inline-flex items-center gap-1.5 text-[13px] font-bold px-3 py-1.5 rounded-full text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer"
            >
              <Boxes className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>AI Toolkits</span>
            </Link>

            <Link
              href="/guides"
              onClick={() => setActiveDropdown(null)}
              className="inline-flex items-center gap-1.5 text-[13px] font-bold px-3 py-1.5 rounded-full text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>AI Guides</span>
            </Link>

            {MEGA_MENUS.map((menu) => {
              const isOpen = activeDropdown === menu.key;
              return (
                <button
                  key={menu.key}
                  type="button"
                  onClick={() => handleToggle(menu.key)}
                  onMouseEnter={() => handleTriggerEnter(menu.key)}
                  onFocus={() => handleTriggerEnter(menu.key)}
                  className={`inline-flex items-center gap-1 text-[13px] font-semibold px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    isOpen
                      ? 'text-slate-950 dark:text-white bg-slate-100 dark:bg-slate-800/90 shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700/80'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  <span>{menu.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#FF8A00]' : ''
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Mega-Menu Dropdown Panel: Anchored directly to relative z-50 nav container */}
          {activeMenu && (
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50 w-[800px] max-w-[calc(100vw-32px)] animate-fadeIn transition-all duration-200 pointer-events-auto"
              onMouseEnter={handleNavEnter}
              onMouseLeave={handleNavLeave}
            >
              <div className="bg-white/95 dark:bg-[#070b13]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/80 rounded-2xl p-5 overflow-hidden transition-all duration-200">
                {/* Header Banner */}
                <div className="mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-mono font-bold border border-[#FF8A00]/20">
                      {activeMenu.label.charAt(0)}
                    </span>
                    <div>
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF8A00]">
                        {activeMenu.headline}
                      </div>
                      <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {activeMenu.subheadline}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Staggered Mega-Menu Grid (2 Columns) */}
                <div className="grid grid-cols-2 gap-4">
                  {activeMenu.categories.map((category) => (
                    <div key={category.title} className="space-y-1.5">
                      <div className="px-2 text-[10.5px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {category.title}
                      </div>
                      <div className="space-y-0.5">
                        {category.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => {
                                clearDebounce();
                                setActiveDropdown(null);
                              }}
                              className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
                            >
                              {/* Clean Micro-Icon Container with Light Orange Ambient Glow */}
                              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 group-hover:text-[#FF8A00] group-hover:bg-[#FF8A00]/10 dark:group-hover:shadow-[0_0_12px_rgba(255,138,0,0.25)] shrink-0 transition-all duration-200">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-[#FF8A00] transition truncate">
                                  {item.name}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-snug mt-0.5">
                                  {item.desc}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mega-Menu Footer Link */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-2">
                  <Link
                    href={activeMenu.footerHref}
                    onClick={() => {
                      clearDebounce();
                      setActiveDropdown(null);
                    }}
                    className="text-xs font-bold text-[#FF8A00] hover:underline flex items-center gap-1.5"
                  >
                    <span>{activeMenu.footerText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/toolkits"
                      onClick={() => setActiveDropdown(null)}
                      className="text-[11px] font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
                    >
                      AI Toolkits
                    </Link>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <Link
                      href="/guides"
                      onClick={() => setActiveDropdown(null)}
                      className="text-[11px] font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
                    >
                      AI Guides
                    </Link>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      Zero Server Latency
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Action: Single-click Theme Toggle + Primary CTA Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Primary CTA button: "Explore All Tools" (compact on mobile to prevent navbar crowding) */}
            <Link
              href="/tools"
              onClick={() => setActiveDropdown(null)}
              className="hidden sm:inline-flex min-h-[44px] px-4 py-2 rounded-full font-mono text-xs font-bold text-slate-950 bg-[#FF8A00] hover:bg-[#ff9e2e] active:scale-95 shadow-[0_0_15px_rgba(255,138,0,0.25)] transition-all items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>Explore All Tools</span>
            </Link>

            {/* Circular Sun/Moon Icon Theme Toggle Button (44x44px touch target on mobile) */}
            <ThemeToggle />

            {/* Mobile Hamburger Menu Toggle with guaranteed 44x44px interactive area */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Off-Canvas Mobile Drawer & Frosted Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden pointer-events-auto">
          {/* Frosted Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-[88vw] max-w-[400px] bg-white dark:bg-[#080d1a] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-50 animate-fadeIn">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#060a14]">
              <AiLogo />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                aria-label="Close Navigation Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF8A00] pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>Directory &amp; Navigation</span>
                <span className="text-[10px] text-slate-400">Live Suite</span>
              </div>

              {/* Dedicated Primary AI Links */}
              <div className="space-y-2">
                <Link
                  href="/ai-tools"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center justify-between p-3.5 rounded-2xl bg-[#FF8A00]/10 border border-[#FF8A00]/20 text-slate-950 dark:text-white font-bold text-sm transition hover:bg-[#FF8A00]/20 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#FF8A00]" />
                    <span>AI Tools Directory</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#FF8A00]" />
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/toolkits"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs hover:border-orange-500/40"
                  >
                    <Boxes className="w-3.5 h-3.5 text-[#FF8A00]" />
                    <span>AI Toolkits</span>
                  </Link>
                  <Link
                    href="/guides"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs hover:border-orange-500/40"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#FF8A00]" />
                    <span>AI Guides</span>
                  </Link>
                </div>
              </div>

              {/* Accordion Categories */}
              <div className="space-y-1">
                {MEGA_MENUS.map((menu) => {
                  const isExpanded = mobileExpandedSection === menu.key;
                  return (
                    <div key={menu.key} className="border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      <div className="flex items-center justify-between">
                        <Link
                          href={menu.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="min-h-[44px] flex items-center flex-1 text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-[#FF8A00]"
                        >
                          {menu.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileExpandedSection(isExpanded ? null : menu.key)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                          aria-label={`Toggle ${menu.label} subcategories`}
                          aria-expanded={isExpanded}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#FF8A00]' : ''}`}
                          />
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-1 pl-2 space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/50 animate-fadeIn">
                          {menu.categories.map((category) => (
                            <div key={category.title} className="space-y-1">
                              <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                                {category.title}
                              </div>
                              <div className="space-y-0.5">
                                {category.items.map((item) => {
                                  const Icon = item.icon;
                                  return (
                                    <Link
                                      key={item.name}
                                      href={item.href}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="min-h-[40px] flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-[#FF8A00] transition"
                                    >
                                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#FF8A00] shrink-0">
                                        <Icon className="w-3.5 h-3.5" />
                                      </div>
                                      <span className="truncate">{item.name}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-2">
                <Link
                  href="/tools"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-h-[44px] w-full rounded-xl font-mono text-xs font-bold text-slate-950 bg-[#FF8A00] hover:bg-[#ff9e2e] flex items-center justify-center gap-2 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                  <span>Launch Universal Directory</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
