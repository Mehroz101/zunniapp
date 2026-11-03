'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Menu,
  X,
  ChevronDown,
  Boxes,
  BookOpen,
  Zap,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

// ── Code-Splitting: Lazy load heavy mega-menu and drawer to save 81 KiB on initial mobile load ──
const DesktopMegaMenu = dynamic(
  () => import('./DesktopMegaMenu').then((mod) => mod.DesktopMegaMenu),
  { ssr: false }
);

const MobileDrawer = dynamic(
  () => import('./MobileDrawer').then((mod) => mod.MobileDrawer),
  { ssr: false }
);

// ── Category Triggers for Desktop Navbar ──
const NAV_TRIGGERS = [
  { key: 'code-converters', label: 'Code Converters', href: '/tools' },
  { key: 'calculators', label: 'Calculators', href: '/calculators/scientific' },
  { key: 'finance', label: 'Finance', href: '/calculators/finance' },
  { key: 'dev-web', label: 'Dev & Web', href: '/tools?category=seo' },
  { key: 'text-utilities', label: 'Text & Utilities', href: '/tools' },
  { key: 'resources', label: 'Resources', href: '/blog' },
];

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
   FLOATING HIGH-END DEVELOPER NAVBAR WITH MEGA-MENUS & THEME CONTROLLER
   ============================================================================== */
export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Direct toggle for click / touch
  const handleToggle = useCallback(
    (menuKey: string) => {
      clearDebounce();
      setActiveDropdown((prev) => (prev === menuKey ? null : menuKey));
    },
    [clearDebounce]
  );

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 pt-3 sm:pt-4 pointer-events-none h-[64px] sm:h-[72px]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between" ref={navRef}>
        {/* Floating Pill Nav Container: relative z-50 with no overflow clipping */}
        <nav
          className="relative z-50 w-full bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-full px-4 sm:px-6 py-2 flex items-center justify-between pointer-events-auto transition-all min-h-[52px] sm:min-h-[56px]"
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
              className="hidden xl:inline-flex items-center gap-1.5 text-[13px] font-bold px-3 py-1.5 rounded-full text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer"
            >
              <Boxes className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>AI Toolkits</span>
            </Link>

            <Link
              href="/guides"
              onClick={() => setActiveDropdown(null)}
              className="hidden xl:inline-flex items-center gap-1.5 text-[13px] font-bold px-3 py-1.5 rounded-full text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>AI Guides</span>
            </Link>

            {NAV_TRIGGERS.map((menu) => {
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

          {/* Active Mega-Menu Dropdown Panel: Dynamically Loaded for Desktop */}
          {activeDropdown && (
            <DesktopMegaMenu
              menuKey={activeDropdown}
              onMouseEnter={handleNavEnter}
              onMouseLeave={handleNavLeave}
              onClose={() => {
                clearDebounce();
                setActiveDropdown(null);
              }}
            />
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

      {/* Off-Canvas Mobile Drawer: Dynamically Loaded on Demand */}
      {isMobileMenuOpen && (
        <MobileDrawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}

export default Navbar;
