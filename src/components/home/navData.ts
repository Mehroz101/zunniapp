import React from 'react';
import {
  Code2,
  Terminal,
  Binary,
  ArrowRight,
  Zap,
  FileText,
  Boxes,
  Database,
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

export interface MenuItem {
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

export const MEGA_MENUS: MegaMenuConfig[] = [
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
    subheadline: 'High-performance AST parsers, strict type generators, and markup scaffolder engines',
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
        title: 'High-Traffic Utility Converters',
        items: [
          {
            name: 'ASCII ➔ Hexadecimal Converter',
            desc: 'UTF-8 binary character encoder & hex decoder.',
            icon: Binary,
            href: '/tools/ascii-to-hex',
          },
          {
            name: 'Base64 ➔ Plain Text Decoder',
            desc: 'RFC 4648 decoder with UTF-8 & URL-safe modes.',
            icon: FileCode,
            href: '/tools/base64-to-text',
          },
          {
            name: 'Hex Code ➔ Pantone PMS Matcher',
            desc: 'Perceptual Delta-E color distance & swatches.',
            icon: Layers,
            href: '/tools/hex-to-pantone',
          },
          {
            name: 'Decimal ➔ ASCII Translator',
            desc: 'Base-10 character code point translator.',
            icon: Terminal,
            href: '/tools/decimal-to-ascii',
          },
        ],
      },
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

  // 6. "Resources" Dropdown (/blog) -> Guides, News, Glossary & Toolkits
  {
    key: 'resources',
    label: 'Resources',
    href: '/blog',
    headline: 'Engineering Guides, AI News & Documentation',
    subheadline: 'In-depth architectural masterclasses, weekly AI telemetry, and neural terminology',
    footerText: 'Explore All Articles & Masterclasses',
    footerHref: '/blog',
    categories: [
      {
        title: 'Guides & Masterclasses',
        items: [
          {
            name: 'Engineering Masterclasses',
            desc: 'Step-by-step architectural and systems engineering guides.',
            icon: BookOpen,
            href: '/guides',
          },
          {
            name: 'Curated AI Toolkits',
            desc: 'Production-ready stacks and workflows for modern developers.',
            icon: Boxes,
            href: '/toolkits',
          },
          {
            name: 'Neural Terms Glossary',
            desc: 'Comprehensive reference of AI, LLM, and transformer concepts.',
            icon: Layers,
            href: '/glossary',
          },
        ],
      },
      {
        title: 'News & Dispatches',
        items: [
          {
            name: 'AI News & Dispatches',
            desc: 'Weekly telemetry, model benchmarks, and industry releases.',
            icon: Sparkles,
            href: '/blog',
          },
          {
            name: 'Universal Tools Directory',
            desc: 'Explore 50+ free online developer utilities and engines.',
            icon: Zap,
            href: '/tools',
          },
          {
            name: 'System Health & API Status',
            desc: 'Real-time telemetry and uptime status monitor.',
            icon: Activity,
            href: '/api/health',
          },
        ],
      },
    ],
  },
];
