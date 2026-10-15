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
      <div className="flex flex-col text-left leading-none">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs sm:text-[13px] font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            AIIsEverything
          </span>
          <span className="inline-flex items-center text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-cyan-500/20 text-[#00D2FF] border border-cyan-500/30">
            .COM
          </span>
        </div>
        <span className="text-[9px] font-mono text-slate-400 dark:text-slate-400 tracking-wider uppercase mt-0.5 font-semibold">
          AI Tools · Dev · Calculators
        </span>
      </div>
    </div>
  );
}

/* ==============================================================================
   MEGA-MENU DATA TAXONOMY & DIRECTORY ROUTING (5 CORE CATEGORIES)
   ============================================================================== */
interface MenuItem {
  name: string;
  desc: string;
  icon: React.ElementType;
  href: string;
}

interface MegaMenuCategory {
  title: string;
  items: MenuItem[];
}

interface MegaMenuConfig {
  key: string;
  label: string;
  href: string;
  headline: string;
  subheadline: string;
  footerText: string;
  footerHref: string;
  categories: MegaMenuCategory[];
}

const MEGA_MENUS: MegaMenuConfig[] = [
  // 1. "Finance" Dropdown (/calculators/finance) -> 7 Core Financial Engines
  {
    key: 'finance',
    label: 'Finance',
    href: '/calculators/finance',
    headline: 'Financial & Commercial Calculation Suite',
    subheadline: 'Vehicle equity, amortization, compound ROI, tax brackets, and margin analysis',
    footerText: 'Explore All Financial Calculation Engines',
    footerHref: '/calculators/finance',
    categories: [
      {
        title: 'Lending & Debt Amortization',
        items: [
          {
            name: 'Auto Loan Trade-In Equity',
            desc: 'Amortization, net trade-in value, state sales tax credit.',
            icon: Car,
            href: '/calculators/auto-loan-trade-in-equity-calculator',
          },
          {
            name: 'Compound Investment Calculator',
            desc: 'ROI, CAGR, future value with recurring deposits.',
            icon: TrendingUp,
            href: '/calculators/investment-calculator',
          },
          {
            name: 'Real Estate Cash Flow & Cap Rate',
            desc: 'Rental yield, mortgage impact, cap rates.',
            icon: Home,
            href: '/calculators/real-estate-calculator',
          },
        ],
      },
      {
        title: 'Wealth, Taxes & Commercial Growth',
        items: [
          {
            name: 'Income Tax Calculator',
            desc: 'Brackets, standard deductions, take-home net estimate.',
            icon: DollarSign,
            href: '/calculators/tax-calculator',
          },
          {
            name: 'Marketing ROI & CAC/LTV',
            desc: 'Customer acquisition cost, ROAS, lifetime value.',
            icon: BarChart2,
            href: '/calculators/marketing-calculator',
          },
          {
            name: 'Personal Finance & Budgeting',
            desc: '50/30/20 rule, emergency runway, retirement horizon.',
            icon: PieChart,
            href: '/calculators/personal-finance-calculator',
          },
          {
            name: 'Business Break-Even Engine',
            desc: 'Fixed vs variable costs, contribution margin.',
            icon: Briefcase,
            href: '/calculators/business-calculator',
          },
        ],
      },
    ],
  },

  // 2. "Calculators" Dropdown (/calculators/scientific) -> 2-Column Architecture (12 Specialized Engines)
  {
    key: 'calculators',
    label: 'Calculators',
    href: '/calculators/scientific',
    headline: 'Scientific, Practical & Engineering Calculators',
    subheadline: 'Kinematics, electrical circuits, biometrics, geometry, and STEM formulas',
    footerText: 'Explore All 12 Scientific & Practical Engines',
    footerHref: '/calculators/scientific',
    categories: [
      {
        title: 'Engineering, Construction & Mechanics',
        items: [
          {
            name: 'Construction Estimator',
            desc: 'Concrete volume, drywall, framing, lumber.',
            icon: Hammer,
            href: '/calculators/construction-calculator',
          },
          {
            name: 'Automotive Calculator',
            desc: 'Fuel economy, gear ratios, horsepower to torque.',
            icon: Car,
            href: '/calculators/automotive-calculator',
          },
          {
            name: 'Electronics Workbench',
            desc: 'Resistor color codes, voltage dividers, PCB trace width.',
            icon: SlidersHorizontal,
            href: '/calculators/electronics-calculator',
          },
          {
            name: 'Physics Engine',
            desc: "Kinematics, trajectory, kinetic energy, Ohm's law.",
            icon: Zap,
            href: '/calculators/physics-calculator',
          },
        ],
      },
      {
        title: 'Health, Mathematics & Agriculture',
        items: [
          {
            name: 'Health & BMR/TDEE',
            desc: 'Daily calorie deficits, macronutrient split.',
            icon: Activity,
            href: '/calculators/health-calculator',
          },
          {
            name: 'Fitness & 1RM Zones',
            desc: 'One-rep max, body fat estimation, target heart rates.',
            icon: Dumbbell,
            href: '/calculators/fitness-calculator',
          },
          {
            name: 'Geometry Suite',
            desc: '2D/3D shapes area, perimeter, volume calculations.',
            icon: Box,
            href: '/calculators/geometry-calculator',
          },
          {
            name: 'Mathematics & Polynomials',
            desc: 'Matrix operations, prime factors, roots.',
            icon: Atom,
            href: '/calculators/mathematics-calculator',
          },
          {
            name: 'Statistics & Variance',
            desc: 'Standard deviation, mean/median/mode, z-scores.',
            icon: BarChart2,
            href: '/calculators/statistics-calculator',
          },
          {
            name: 'Chemistry & Dilution',
            desc: 'Molar mass, solution dilution, stoichiometry.',
            icon: FlaskConical,
            href: '/calculators/chemistry-calculator',
          },
          {
            name: 'Educational / GPA Calculator',
            desc: 'Weighted GPA/CGPA and final target grade.',
            icon: GraduationCap,
            href: '/calculators/educational-calculator',
          },
          {
            name: 'Agriculture & Yield Calculator',
            desc: 'Seeding density, fertilizer rates, water needs.',
            icon: Wheat,
            href: '/calculators/agriculture-calculator',
          },
        ],
      },
    ],
  },

  // 3. "Dev & Web" Dropdown (/tools?category=seo) -> Webmaster Diagnostics & Structured Parsers
  {
    key: 'dev-web',
    label: 'Dev & Web',
    href: '/tools?category=seo',
    headline: 'Webmaster Diagnostics & Structured Parsers',
    subheadline: 'Robots.txt, XML sitemaps, JSON-LD schemas, meta tags, and SERP simulator',
    footerText: 'Explore All Web & Developer Diagnostics',
    footerHref: '/tools?category=seo',
    categories: [
      {
        title: 'Data & Developer Formats',
        items: [
          {
            name: 'JSON Tools Suite',
            desc: 'JSON Formatter, JSON to CSV, JSON to YAML, JSON Validator.',
            icon: FileCode,
            href: '/tools/json-formatter',
          },
          {
            name: 'Python Utilities',
            desc: 'HTML to Python AST, BeautifulSoup Scraper Scaffolder.',
            icon: Binary,
            href: '/tools/html-to-python-ast',
          },
          {
            name: 'JSON-LD Schema Builder',
            desc: 'Rich Results schemas (Article, Organization, FAQPage).',
            icon: Code2,
            href: '/tools/schema-markup-generator',
          },
        ],
      },
      {
        title: 'Webmaster & SEO Directives',
        items: [
          {
            name: 'Robots.txt Generator & Validator',
            desc: 'Granular crawler directives and sitemap linking.',
            icon: ShieldCheck,
            href: '/tools/robots-txt-generator',
          },
          {
            name: 'XML Sitemap Generator',
            desc: 'RFC 3986 compliance, priority, and lastmod tagging.',
            icon: Layers,
            href: '/tools/xml-sitemap-generator',
          },
          {
            name: 'SERP Simulator & Pixel Width Checker',
            desc: 'Title/description truncation auditing.',
            icon: Search,
            href: '/tools/serp-simulator',
          },
          {
            name: 'Meta Tag & Heading Auditor',
            desc: 'H1-H6 hierarchy trees, missing viewport alerts.',
            icon: FileText,
            href: '/tools/meta-tag-analyzer',
          },
        ],
      },
    ],
  },

  // 4. "Code Converters" Dropdown (/tools) -> AST Compilers & Syntax Transformers
  {
    key: 'code-converters',
    label: 'Code Converters',
    href: '/tools',
    headline: 'AST Compilers & Syntax Transformers',
    subheadline: 'Client-side AST parsers, strict type generators, and markup scaffolder engines',
    footerText: 'Explore All Code Converters & Compilers',
    footerHref: '/tools',
    categories: [
      {
        title: 'Web & Scraper AST Compilers',
        items: [
          {
            name: 'HTML ➔ Python AST / BeautifulSoup',
            desc: 'Clean DOM traversal generator.',
            icon: Binary,
            href: '/tools/html-to-python-ast',
          },
          {
            name: 'CSS ➔ HTML / JSX Scaffolder',
            desc: 'Automatic semantic tree scaffolding.',
            icon: Code2,
            href: '/tools/css-to-html',
          },
          {
            name: 'SVG ➔ Production JSX/TSX',
            desc: 'Clean React component generator (SVGR pattern).',
            icon: Boxes,
            href: '/tools/svg-to-jsx',
          },
        ],
      },
      {
        title: 'Schema, Types & Transpilers',
        items: [
          {
            name: 'JSON ➔ YAML / YAML ➔ JSON',
            desc: 'Bi-directional streaming converter.',
            icon: FileText,
            href: '/tools/json-to-yaml',
          },
          {
            name: 'JavaScript ➔ Strict TypeScript',
            desc: 'Automatic type inferencing engine.',
            icon: Terminal,
            href: '/tools/js-to-ts',
          },
          {
            name: 'SQL ➔ Prisma / Drizzle ORM',
            desc: 'DDL parser to declarative schemas.',
            icon: Database,
            href: '/tools/sql-to-schema-orm',
          },
          {
            name: 'cURL ➔ Multi-Language Code',
            desc: 'Converts cURL to Fetch, Axios, Python Requests.',
            icon: Globe,
            href: '/tools/curl-to-code',
          },
        ],
      },
    ],
  },

  // 5. "Text & Utilities" Dropdown (/tools) -> Encoders, Decoders & Text Workbenches
  {
    key: 'text-utilities',
    label: 'Text & Utilities',
    href: '/tools',
    headline: 'Encoders, Decoders & Text Workbenches',
    subheadline: 'Zero-log client encryption, token inspectors, regex testers, and document parsers',
    footerText: 'Explore All Developer Utilities',
    footerHref: '/tools',
    categories: [
      {
        title: 'Crypto, Tokens & Schedules',
        items: [
          {
            name: 'JWT Debugger & Signature Inspector',
            desc: 'Decode claims and verify expirations.',
            icon: Key,
            href: '/tools/jwt-decoder',
          },
          {
            name: 'Cron Expression Explainer',
            desc: 'Translates 5/6-part cron syntax to human schedules.',
            icon: Clock,
            href: '/tools/cron-parser',
          },
          {
            name: 'Base64 & Web Crypto Hashing',
            desc: 'Base64 data-URIs, SHA-256, SHA-512, MD5.',
            icon: ShieldCheck,
            href: '/tools/hash-encoder',
          },
        ],
      },
      {
        title: 'Text, Patterns & Documents',
        items: [
          {
            name: 'Regex Pattern Workbench',
            desc: 'Real-time match highlighting and flag testing.',
            icon: Terminal,
            href: '/tools/regex-tester',
          },
          {
            name: 'URL Slug Sanitizer & Redirection Rules',
            desc: 'Safe slugs + .htaccess / NGINX 301 rules.',
            icon: FileText,
            href: '/tools/slug-generator',
          },
          {
            name: 'Markdown ➔ HTML / HTML ➔ Markdown',
            desc: 'Clean bi-directional document parser.',
            icon: BookOpen,
            href: '/tools/markdown-live-editor',
          },
        ],
      },
    ],
  },
];

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

          {/* Center: 5 Desktop Mega-Menu Category Trigger Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
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
                      isOpen ? 'rotate-180 text-[#00D2FF]' : ''
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
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#00D2FF]/10 text-[#00D2FF] text-xs font-mono font-bold border border-[#00D2FF]/20">
                      {activeMenu.label.charAt(0)}
                    </span>
                    <div>
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00D2FF]">
                        {activeMenu.headline}
                      </div>
                      <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {activeMenu.subheadline}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
                    60 FPS CLIENT-SIDE
                  </span>
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
                              {/* Clean Micro-Icon Container with Cyan Ambient Glow */}
                              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 group-hover:text-[#00D2FF] group-hover:bg-[#00D2FF]/10 dark:group-hover:shadow-[0_0_12px_rgba(0,210,255,0.25)] shrink-0 transition-all duration-200">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-[#00D2FF] transition truncate">
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
                    className="text-xs font-bold text-[#00D2FF] hover:underline flex items-center gap-1.5"
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
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* Primary CTA button: "Explore All Tools" */}
            <Link
              href="/tools"
              onClick={() => setActiveDropdown(null)}
              className="px-4 py-2 rounded-full font-mono text-xs font-bold text-slate-950 bg-[#00D2FF] hover:bg-[#38bdf8] active:scale-95 shadow-[0_0_15px_rgba(0,210,255,0.25)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>Explore All Tools</span>
            </Link>

            {/* Circular Sun/Moon Icon Theme Toggle Button */}
            <ThemeToggle />

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-3 max-w-[1440px] mx-auto pointer-events-auto">
          <div className="bg-white/98 dark:bg-[#080d1a]/98 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00D2FF] pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>Directory Navigation &amp; Toolkits</span>
              <span className="text-[10px] text-slate-400">5 Categories</span>
            </div>

            {MEGA_MENUS.map((menu) => {
              const isExpanded = mobileExpandedSection === menu.key;
              return (
                <div key={menu.key} className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center justify-between">
                    <Link
                      href={menu.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-[#00D2FF]"
                    >
                      {menu.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpandedSection(isExpanded ? null : menu.key)
                      }
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-[#00D2FF]' : ''}`}
                      />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pl-2 space-y-3 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                      {menu.categories.map((category) => (
                        <div key={category.title} className="space-y-1.5">
                          <div className="text-[10px] font-mono uppercase text-slate-400">
                            {category.title}
                          </div>
                          {category.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2.5 p-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#00D2FF]"
                              >
                                <Icon className="w-3.5 h-3.5 text-[#00D2FF]" />
                                <span>{item.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/toolkits"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2 rounded-xl text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Explore AI Toolkits
              </Link>
              <Link
                href="/guides"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2 rounded-xl text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Browse AI Guides
              </Link>
              <Link
                href="/tools"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl font-mono text-xs font-bold text-slate-950 bg-[#00D2FF] flex items-center justify-center gap-2 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Launch Universal Directory</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
