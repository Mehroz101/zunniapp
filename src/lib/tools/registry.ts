import { ToolDefinition, ToolExecutionResult } from './types';
import {
  runRobotsTxtGenerator,
  runXmlSitemapGenerator,
  runSchemaMarkupGenerator,
  runOpenGraphGenerator,
  runCanonicalHreflangGenerator,
  runSerpSimulator,
  runMetaTagAnalyzer,
  runHeadingStructureAnalyzer,
  runKeywordDensityChecker,
  runSlugGenerator,
  runImageAltSeoHelper,
  runLinkExtractor,
} from './engines/seo';
import {
  runJsonToTypescript,
  runJsonToCsv,
  runXmlToJson,
  runHtmlToMarkdown,
  runCssToTailwind,
  runJwtDecoder,
  runCurlToCode,
  runCronParser,
  runRegexTester,
  runHashEncoder,
} from './engines/developer';
import {
  runHtmlToCssConverter,
  runJsonFormatter,
  runAiSummarizer,
  runReadabilityChecker,
} from './engines/utilities';

export const TOOLS_REGISTRY: Record<string, ToolDefinition> = {
  // ── SEO TOOLS ──────────────────────────────
  'robots-txt-generator': {
    id: 'tool-seo-1',
    slug: 'robots-txt-generator',
    name: 'Robots.txt Generator & Directives Validator',
    tagline: 'Configure granular crawl rules for Googlebot, Bingbot, GPTBot, and PerplexityBot with live syntax validation.',
    description: 'Ensure accurate search engine indexing and prevent sensitive path leaks. Includes automatic sitemap integration and AI-crawler policy controls.',
    category: 'seo',
    categoryName: 'SEO Diagnostics',
    categorySlug: 'seo',
    icon: 'Bot',
    inputLabel: 'Custom Paths or Rules (Optional)',
    inputPlaceholder: '/admin/\n/api/private/\n/dashboard/',
    outputLabel: 'Generated robots.txt Configuration',
    outputLanguage: 'text',
    sampleInput: '/admin/\n/checkout/\n/api/v1/internal/',
    options: [
      { id: 'domain', label: 'Website Domain', type: 'text', defaultValue: 'https://example.com' },
      { id: 'allowAiCrawlers', label: 'Allow Generative AI Bots (GPTBot, ClaudeBot)', type: 'boolean', defaultValue: true },
      { id: 'crawlDelay', label: 'Crawl Delay (Seconds, 0 for none)', type: 'text', defaultValue: '0' },
    ],
    features: [
      'Comprehensive crawler control (Googlebot, Bing, Baidu, Yandex)',
      'Specific rules for LLM crawlers (GPTBot, ClaudeBot, PerplexityBot)',
      'Automatic sitemap directive injection',
      'Conflicting rule detection and RFC compliance',
    ],
    howToSteps: [
      { title: 'Define Website Root', description: 'Enter your canonical production domain name.' },
      { title: 'Add Protected Paths', description: 'Specify sensitive directories to block from public search indices.' },
      { title: 'Export Configuration', description: 'Copy or download the generated robots.txt and place it in your root directory.' },
    ],
    faqs: [
      { question: 'Where should robots.txt be placed?', answer: 'Robots.txt must be hosted strictly at the root of your domain (e.g., https://example.com/robots.txt).' },
      { question: 'Does robots.txt hide pages from users?', answer: 'No, robots.txt tells search engine bots what to crawl; it does not protect pages with passwords or permissions.' },
    ],
    seoKeywords: ['robots txt generator', 'seo crawler rules', 'block gptbot robots txt', 'validate robots.txt online'],
  },

  'xml-sitemap-generator': {
    id: 'tool-seo-2',
    slug: 'xml-sitemap-generator',
    name: 'XML Sitemap Generator & Tag Validator',
    tagline: 'Generate schema-compliant XML sitemaps validating against RFC 3986 with priority and changefreq settings.',
    description: 'Provide clean indexation maps to Google Search Console and Bing Webmaster Tools. Features automatic XML entity escaping and URL health validation.',
    category: 'seo',
    categoryName: 'SEO Diagnostics',
    categorySlug: 'seo',
    icon: 'FileCode2',
    inputLabel: 'Paste URLs (One URL per line)',
    inputPlaceholder: 'https://example.com\nhttps://example.com/blog\nhttps://example.com/tools',
    outputLabel: 'Standard sitemap.xml Output',
    outputLanguage: 'xml',
    sampleInput: 'https://aiiseverything.com\nhttps://aiiseverything.com/ai-tools\nhttps://aiiseverything.com/blog\nhttps://aiiseverything.com/tools/robots-txt-generator\nhttps://aiiseverything.com/tools/json-to-typescript',
    options: [
      { id: 'changefreq', label: 'Change Frequency', type: 'select', choices: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly'], defaultValue: 'weekly' },
      { id: 'priority', label: 'Default Priority', type: 'select', choices: ['1.0', '0.8', '0.6', '0.4', '0.2'], defaultValue: '0.8' },
    ],
    features: [
      'Validates all URLs against strict RFC 3986 web standards',
      'Encodes illegal XML characters (&, <, >, ", \') safely',
      'Assigns dynamic lastmod timestamps and priority scores',
      'Ready for Google Search Console and Bing Webmaster uploads',
    ],
    howToSteps: [
      { title: 'List Page URLs', description: 'Paste all public indexable paths into the editor.' },
      { title: 'Set Crawl Parameters', description: 'Choose appropriate update frequencies and page priorities.' },
      { title: 'Download sitemap.xml', description: 'Upload the result to your web server and submit via Search Console.' },
    ],
    faqs: [
      { question: 'What is the limit of an XML sitemap?', answer: 'A single sitemap file can contain up to 50,000 URLs and be up to 50MB uncompressed.' },
    ],
    seoKeywords: ['xml sitemap generator', 'sitemap validator', 'google sitemap builder', 'free online sitemap creator'],
  },

  'schema-markup-generator': {
    id: 'tool-seo-3',
    slug: 'schema-markup-generator',
    name: 'JSON-LD Schema Markup Builder & Validator',
    tagline: 'Build Google Rich Snippet JSON-LD structured data for Articles, Organizations, Software, FAQs, and Products.',
    description: 'Ensure compliance with Google Search Central specifications. Inject structured data to secure visual Rich Results on SERPs.',
    category: 'seo',
    categoryName: 'SEO Diagnostics',
    categorySlug: 'seo',
    icon: 'FileJson',
    inputLabel: 'Entity Parameters (JSON or Key-Value format)',
    inputPlaceholder: 'title: Advanced Neural Search Architecture\nauthor: Dr. Sarah Chen\ndescription: A breakthrough analysis in multi-modal vector embeddings.',
    outputLabel: 'JSON-LD <script> Schema Output',
    outputLanguage: 'html',
    sampleInput: 'title: 10x Developer Productivity Guide\nauthor: Engineering Team\ndescription: Comprehensive blueprint to building production-grade full-stack architectures in Record Time.\nurl: https://aiiseverything.com/blog/developer-productivity',
    options: [
      { id: 'schemaType', label: 'Schema Type', type: 'select', choices: ['Article', 'Organization', 'SoftwareApplication', 'FAQPage', 'LocalBusiness', 'Product'], defaultValue: 'Article' },
    ],
    features: [
      'Generates compliant Schema.org JSON-LD formatted blocks',
      'Supported Rich Results: Article, Software, FAQPage, Organization, Product',
      'Pre-packaged with Google Search Central required fields',
      'Zero syntax errors with instant client validation',
    ],
    howToSteps: [
      { title: 'Select Schema Entity', description: 'Pick the relevant type (Article, FAQ, Product, etc.).' },
      { title: 'Supply Entity Details', description: 'Enter page title, author, description, and target URLs.' },
      { title: 'Embed in HTML Head', description: 'Paste the generated script tag directly into your page head.' },
    ],
    faqs: [
      { question: 'Why use JSON-LD over Microdata?', answer: 'Google explicitly recommends JSON-LD because it is decoupled from HTML templates and easier to maintain.' },
    ],
    seoKeywords: ['schema markup generator', 'json ld generator', 'rich snippets builder', 'faq schema generator'],
  },

  'openGraph-generator': {
    id: 'tool-seo-4',
    slug: 'open-graph-generator',
    name: 'Open Graph & Twitter Card Social Previewer',
    tagline: 'Generate pixel-perfect meta tags for Facebook, LinkedIn, Twitter, and Pinterest with live social card previews.',
    description: 'Maximize click-through rates across social networks. Previews large image summary cards with real-time title and description limits.',
    category: 'seo',
    categoryName: 'SEO Diagnostics',
    categorySlug: 'seo',
    icon: 'Share2',
    inputLabel: 'Social Preview Attributes',
    inputPlaceholder: 'title: AIIsEverything Developer Suite\ndescription: Free AI tools for modern software engineers.\nurl: https://aiiseverything.com\nimage: https://aiiseverything.com/og-default.png',
    outputLabel: 'Social Meta Tags Markup',
    outputLanguage: 'html',
    sampleInput: 'title: AIIsEverything — Neural Developer Hub\ndescription: The definitive directory of 26+ interactive developer converters, SEO analyzers, and neural intelligence suites.\nurl: https://aiiseverything.com\nimage: https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80\ntwitter: @aiiseverything',
    features: [
      'Generates Open Graph (og:title, og:image, og:url, og:site_name)',
      'Generates Twitter summary_large_image card tags',
      'Accurate pixel and character boundary previews',
      '1-click HTML snippet copy for Next.js or static sites',
    ],
    howToSteps: [
      { title: 'Configure Social Copy', description: 'Provide high-converting title, description, and high-res image URL.' },
      { title: 'Preview Social Cards', description: 'Inspect how the card appears on Twitter, Facebook, and LinkedIn.' },
      { title: 'Copy Header Tags', description: 'Paste the generated meta tags into your HTML document.' },
    ],
    faqs: [
      { question: 'What is the optimal Open Graph image size?', answer: '1200 x 630 pixels at a 1.91:1 aspect ratio ensures crisp rendering across all social platforms.' },
    ],
    seoKeywords: ['open graph generator', 'twitter card generator', 'social share previewer', 'og meta tags builder'],
  },

  'canonical-hreflang-generator': {
    id: 'tool-seo-5',
    slug: 'canonical-hreflang-generator',
    name: 'Canonical & International Hreflang Constructor',
    tagline: 'Construct bidirectional self-referential canonical tags and ISO 639-1 / ISO 3166-1 hreflang language clusters.',
    description: 'Prevent duplicate content penalties and serve localized search results to international users with guaranteed syntactic validity.',
    category: 'seo',
    categoryName: 'SEO Diagnostics',
    categorySlug: 'seo',
    icon: 'Languages',
    inputLabel: 'Regional Language Mappings (Locale: URL)',
    inputPlaceholder: 'en: https://example.com/\nes: https://example.com/es/\nfr: https://example.com/fr/\nx-default: https://example.com/',
    outputLabel: 'Canonical & Hreflang Tags',
    outputLanguage: 'html',
    sampleInput: 'en: https://aiiseverything.com/\nes: https://aiiseverything.com/es/\nde: https://aiiseverything.com/de/\nfr: https://aiiseverything.com/fr/\nja: https://aiiseverything.com/ja/\nx-default: https://aiiseverything.com/',
    options: [
      { id: 'baseUrl', label: 'Default Canonical URL', type: 'text', defaultValue: 'https://aiiseverything.com' },
    ],
    features: [
      'Self-referential canonical link construction',
      'Supports x-default fallback for multi-regional homepages',
      'Validates ISO 639-1 language and ISO 3166-1 country pairings',
      'Bidirectional cluster validation compliance',
    ],
    howToSteps: [
      { title: 'Map Target Languages', description: 'Input URLs corresponding to each localized edition of the page.' },
      { title: 'Generate Cluster', description: 'Create bidirectional link tags matching Google search guidelines.' },
      { title: 'Embed Across Variants', description: 'Include the identical hreflang set across all translated versions.' },
    ],
    faqs: [
      { question: 'Why is x-default required?', answer: 'x-default specifies the fallback page for visitors whose language or region does not match any explicit language edition.' },
    ],
    seoKeywords: ['hreflang generator', 'canonical tag builder', 'international seo generator', 'multilingual seo tags'],
  },

  'serp-simulator': {
    id: 'tool-seo-6',
    slug: 'serp-simulator',
    name: 'SERP Snippet & Pixel Width Calculator',
    tagline: 'Calculate exact proportional font pixel widths for Google desktop and mobile search snippets to eliminate truncation.',
    description: 'Go beyond arbitrary character counters. Computes true typographic pixel ceilings (600px Title, 960px Description) with live Google preview.',
    category: 'seo',
    categoryName: 'SEO Diagnostics',
    categorySlug: 'seo',
    icon: 'Search',
    inputLabel: 'SERP Attributes (Key: Value)',
    inputPlaceholder: 'title: Master Artificial Intelligence Workflows in 2026\nurl: https://aiiseverything.com/guides/ai-workflows\ndescription: Step-by-step handbook covering neural code compilation, prompt engineering, and high-throughput agent tooling.',
    outputLabel: 'Pixel Audit & SERP Report',
    outputLanguage: 'text',
    sampleInput: 'title: AIIsEverything — 26+ Free Developer Tools, Neural Compilers & AI News\nurl: https://aiiseverything.com/ai-tools\ndescription: Explore the definitive directory of free developer converters, AST parsers, SEO diagnostic engines, and technical tutorials with zero paywalls.',
    features: [
      'Calculates accurate proportional Arial 20px / 14px font pixel widths',
      'Detects desktop (600px) and mobile (580px) title truncations',
      'Live visual Google search result snippet mockup',
      'Recommends optimal title length to maximize organic CTR',
    ],
    howToSteps: [
      { title: 'Enter Page Title & URL', description: 'Type in your proposed title and canonical destination.' },
      { title: 'Draft Meta Description', description: 'Craft a compelling call-to-action summary.' },
      { title: 'Verify Pixel Metrics', description: 'Ensure pixel measurements remain below the truncation threshold.' },
    ],
    faqs: [
      { question: 'Why do character counters fail for Google SERP?', answer: 'Google truncates by pixel width (~600px), not character count. Characters like "W" and "M" take twice as many pixels as "i" and "l".' },
    ],
    seoKeywords: ['serp simulator', 'google pixel width calculator', 'serp preview tool', 'meta title length checker'],
  },

  'meta-tag-analyzer': {
    id: 'tool-seo-7',
    slug: 'meta-tag-analyzer',
    name: 'Technical Meta Tag Inspector & Heading Auditor',
    tagline: 'Audit HTML head markup for title lengths, meta descriptions, viewports, canonical tags, and OpenGraph health scores.',
    description: 'Paste any HTML source snippet to uncover missing tags, duplicate declarations, and technical SEO vulnerabilities in milliseconds.',
    category: 'seo',
    categoryName: 'SEO Diagnostics',
    categorySlug: 'seo',
    icon: 'ScanEye',
    inputLabel: 'Paste HTML Head or Page Source',
    inputPlaceholder: '<head>\n  <title>Sample Web Page</title>\n  <meta name="description" content="A fast and responsive site.">\n</head>',
    outputLabel: 'Technical SEO Audit Report',
    outputLanguage: 'text',
    sampleInput: `<!DOCTYPE html>
<html>
<head>
  <title>AIIsEverything - Free AI Developer Tools & Converters</title>
  <meta name="description" content="Discover 26+ free interactive developer tools, AST code converters, and technical SEO diagnostic suites built for high-performance software engineering teams.">
  <link rel="canonical" href="https://aiiseverything.com/ai-tools">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta property="og:title" content="AIIsEverything Developer Suite">
  <meta property="og:image" content="https://aiiseverything.com/og-default.png">
</head>
</html>`,
    features: [
      'Comprehensive HTML head tag parser',
      'Audits title, description, robots, canonical, and mobile viewports',
      'Computes an aggregate Technical SEO Health Score (0-100)',
      'Pinpoints missing or duplicate tags instantly',
    ],
    howToSteps: [
      { title: 'Copy HTML Source', description: 'View source on any webpage and copy the <head> segment.' },
      { title: 'Run Analysis', description: 'Click execute to parse all meta and link declarations.' },
      { title: 'Review Recommendations', description: 'Apply suggested optimizations to improve technical search compliance.' },
    ],
    faqs: [
      { question: 'What is a good meta tag score?', answer: 'A score of 85+ indicates solid technical fundamentals with essential meta tags correctly configured.' },
    ],
    seoKeywords: ['meta tag analyzer', 'html head tag checker', 'technical seo audit', 'meta tag inspector online'],
  },

  'heading-structure-analyzer': {
    id: 'tool-seo-8',
    slug: 'heading-structure-analyzer',
    name: 'Heading Hierarchy (H1-H6) Tree Analyzer',
    tagline: 'Generate visual hierarchical node trees of H1-H6 headings and flag skipped levels, multiple H1s, and empty nodes.',
    description: 'Evaluate document outline accessibility and search engine topic structure across HTML markup or Markdown copy.',
    category: 'seo',
    categoryName: 'SEO Diagnostics',
    categorySlug: 'seo',
    icon: 'Network',
    inputLabel: 'Paste HTML or Markdown Content',
    inputPlaceholder: '<h1>Main Topic</h1>\n<h2>Sub Topic</h2>\n<p>Content...</p>',
    outputLabel: 'Heading Hierarchy Tree & Audit',
    outputLanguage: 'text',
    sampleInput: `<h1>Architectural Guide to Neural Compilers</h1>
<p>Modern compilers require deterministic evaluation pipelines.</p>
<h2>1. Core Compilation Topologies</h2>
<h3>1.1 Abstract Syntax Tree (AST) Extraction</h3>
<h4>Detailed Token Inspection</h4>
<h2>2. Distributed State Synchronization</h2>
<h3>2.1 Edge Caching Strategies</h3>
<h2>3. Production Verification Protocol</h2>`,
    features: [
      'Visual hierarchical node tree rendering',
      'Validates sequential nesting (catches skipped levels like H1 -> H3)',
      'Identifies multiple H1 declarations or missing H1 tags',
      'Compatible with both raw HTML and Markdown formats',
    ],
    howToSteps: [
      { title: 'Paste Document Markup', description: 'Input your article or landing page code.' },
      { title: 'Inspect Heading Tree', description: 'Examine visual nesting levels and indentation.' },
      { title: 'Resolve Flagged Issues', description: 'Fix skipped heading tags to preserve semantic document flow.' },
    ],
    faqs: [
      { question: 'Why does skipping heading levels hurt SEO?', answer: 'Skipped heading levels (like H2 to H4) confuse screen readers and search engine crawlers parsing the logical topic hierarchy.' },
    ],
    seoKeywords: ['heading hierarchy analyzer', 'h1 h6 tag checker', 'heading structure seo', 'html heading tree visualizer'],
  },

  'keyword-density-checker': {
    id: 'tool-seo-9',
    slug: 'keyword-density-checker',
    name: 'Keyword Density & N-Gram Tokenizer',
    tagline: 'Compute 1-gram, 2-gram, and 3-gram frequencies, strip language stop words, and highlight keyword stuffing risks.',
    description: 'Optimize content relevance without triggering search engine over-optimization penalties (>3.5% density threshold warnings).',
    category: 'seo',
    categoryName: 'SEO Diagnostics',
    categorySlug: 'seo',
    icon: 'BarChart2',
    inputLabel: 'Paste Article or Webpage Text',
    inputPlaceholder: 'Artificial intelligence is reshaping software engineering workflows. Modern AI developer tools allow teams to build reliable code faster...',
    outputLabel: 'N-Gram Frequency & Density Report',
    outputLanguage: 'text',
    sampleInput: `Artificial intelligence tools and developer utilities are accelerating modern software engineering. With advanced neural code converters, teams can transform legacy code into modern frameworks with zero manual friction. Developer tools powered by AI ensure clean architecture, reliable AST parsing, and robust error handling. Embracing AI developer tools empowers engineers to focus on high-impact system architecture.`,
    features: [
      'Strips 150+ common English stop words for authentic signal extraction',
      'Calculates 1-gram and 2-gram phrase frequency distributions',
      'Percentage-based density metrics with over-optimization warnings',
      'Total word and non-stopword token accounting',
    ],
    howToSteps: [
      { title: 'Paste Content Draft', description: 'Input your blog post, product description, or copy.' },
      { title: 'Examine Density Tables', description: 'Identify prominent keywords and multi-word phrases.' },
      { title: 'Balance Word Ratios', description: 'Ensure target keywords maintain healthy 1.0% - 2.5% density.' },
    ],
    faqs: [
      { question: 'What is the optimal keyword density for SEO?', answer: 'A natural density between 1% and 2.5% is widely recommended. Densities exceeding 3.5% risk triggering spam filters.' },
    ],
    seoKeywords: ['keyword density checker', 'ngram tokenizer', 'keyword frequency analyzer', 'keyword stuffing detector'],
  },

  'slug-generator': {
    id: 'tool-seo-10',
    slug: 'slug-generator',
    name: 'URL Slug Sanitizer & Redirection Rule Builder',
    tagline: 'Generate URL-safe slugs with Apache .htaccess 301 Redirects and NGINX rewrite directives automatically.',
    description: 'Strip diacritics, symbols, and stop words into clean, readable URL slugs. Emits ready-to-deploy server redirect rules.',
    category: 'seo',
    categoryName: 'SEO Diagnostics',
    categorySlug: 'seo',
    icon: 'Link2',
    inputLabel: 'Page Title or Raw String',
    inputPlaceholder: '10x Your Developer Productivity with AI Tools: Complete 2026 Guide!',
    outputLabel: 'URL Slug & Server Redirect Snippets',
    outputLanguage: 'text',
    sampleInput: 'Building Scalable Full-Stack Web Architectures: The 2026 Comprehensive Handbook & Blueprint!',
    options: [
      { id: 'delimiter', label: 'Slug Separator', type: 'select', choices: ['-', '_'], defaultValue: '-' },
      { id: 'oldUrl', label: 'Old URL Path for 301 Redirect', type: 'text', defaultValue: '/old-handbook-path' },
    ],
    features: [
      'Normalizes diacritics, accents, and international glyphs',
      'Eliminates punctuation and illegal URL characters safely',
      'Generates Apache .htaccess 301 permanent redirect rules',
      'Generates NGINX rewrite directives and Next.js redirect objects',
    ],
    howToSteps: [
      { title: 'Enter Article Title', description: 'Type or paste the headline or sentence.' },
      { title: 'Select Delimiter', description: 'Choose standard hyphen or underscore formatting.' },
      { title: 'Copy Slug or Server Rule', description: 'Apply the sanitized slug to your CMS or web router.' },
    ],
    faqs: [
      { question: 'Are hyphens or underscores better for SEO slugs?', answer: 'Google explicitly recommends hyphens (-) over underscores (_) as word separators in URL structures.' },
    ],
    seoKeywords: ['slug generator', 'url slug sanitizer', '301 redirect rule builder', 'seo friendly url creator'],
  },

  'image-alt-seo-helper': {
    id: 'tool-seo-11',
    slug: 'image-alt-seo-helper',
    name: 'Image Alt-Text Quality Inspector',
    tagline: 'Scan HTML image tags, pinpoint missing or generic descriptions, and generate keyword-rich accessibility attributes.',
    description: 'Ensure WCAG compliance and maximize Google Image Search indexation by identifying low-value placeholder alt texts.',
    category: 'seo',
    categoryName: 'SEO Diagnostics',
    categorySlug: 'seo',
    icon: 'Image',
    inputLabel: 'Paste HTML with <img> Elements',
    inputPlaceholder: '<img src="/assets/hero-banner.jpg">\n<img src="/logo.png" alt="logo">\n<img src="/dashboard-screenshot.png" alt="screenshot">',
    outputLabel: 'Image Alt Audit & Suggestions',
    outputLanguage: 'text',
    sampleInput: `<div class="gallery">
  <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995" alt="image">
  <img src="/static/neural-network-diagram.png">
  <img src="/icons/brand-logo.svg" alt="logo">
  <img src="/previews/workbench-ide-screen.png" alt="AIIsEverything Developer IDE Workbench with dual editor panes">
</div>`,
    features: [
      'Scans all <img> markup elements across raw HTML',
      'Detects missing alt attributes and empty alt="" strings',
      'Flags generic low-value terms (photo, image, pic, screenshot, logo)',
      'Generates context-aware replacement alt text suggestions',
    ],
    howToSteps: [
      { title: 'Paste HTML Template', description: 'Input your webpage or component markup.' },
      { title: 'Review Audit Flags', description: 'Inspect images flagged with missing or generic descriptions.' },
      { title: 'Apply Recommendations', description: 'Update markup with keyword-optimized, accessible alt texts.' },
    ],
    faqs: [
      { question: 'Why is alt text essential for SEO?', answer: 'Alt text enables search engine crawlers to understand image subject matter and indexes your visuals in Google Image Search.' },
    ],
    seoKeywords: ['image alt checker', 'seo alt text helper', 'image accessibility audit', 'alt attribute optimizer'],
  },

  'link-extractor': {
    id: 'tool-seo-12',
    slug: 'link-extractor',
    name: 'Internal vs. External Link Extractor & Rel Auditor',
    tagline: 'Extract all anchor references, classify internal vs external endpoints, and audit rel="noopener" and nofollow safety.',
    description: 'Audit internal link equity distributions and prevent reverse tabnabbing security vulnerabilities on external hyperlinks.',
    category: 'seo',
    categoryName: 'SEO Diagnostics',
    categorySlug: 'seo',
    icon: 'ExternalLink',
    inputLabel: 'Paste HTML with Anchor <a> Links',
    inputPlaceholder: '<a href="/ai-tools">AI Tools</a>\n<a href="https://github.com" target="_blank">GitHub</a>',
    outputLabel: 'Link Audit Breakdown',
    outputLanguage: 'text',
    sampleInput: `<nav>
  <a href="/">Home</a>
  <a href="/ai-tools">All AI Tools</a>
  <a href="/blog/developer-productivity">Productivity Article</a>
  <a href="https://twitter.com/aiiseverything" target="_blank">Twitter Follow</a>
  <a href="https://github.com/aiiseverything" target="_blank" rel="noopener noreferrer">GitHub Repo</a>
  <a href="mailto:support@aiiseverything.com">Email Us</a>
</nav>`,
    options: [
      { id: 'domain', label: 'Primary Internal Domain', type: 'text', defaultValue: 'aiiseverything.com' },
    ],
    features: [
      'Classifies links into Internal, External, Anchor, and Protocol types',
      'Flags target="_blank" links missing rel="noopener" security protections',
      'Audits nofollow, sponsored, and ugc link attributes',
      'Extracts anchor text alongside destination endpoints',
    ],
    howToSteps: [
      { title: 'Input HTML Code', description: 'Paste page navigation, footer, or body markup.' },
      { title: 'Run Extractor', description: 'Audit all hyperlink tags in one operation.' },
      { title: 'Inspect Security Flags', description: 'Fix unsafe external links to protect user sessions.' },
    ],
    faqs: [
      { question: 'What is the risk of target="_blank" without rel="noopener"?', answer: 'Without rel="noopener", external pages can access your window.opener object and maliciously redirect your users.' },
    ],
    seoKeywords: ['link extractor', 'anchor tag auditor', 'internal link checker', 'rel noopener audit tool'],
  },

  // ── DEVELOPER CORE & SERIALIZATION CONVERTERS ──────────────
  'json-to-typescript': {
    id: 'tool-dev-1',
    slug: 'json-to-typescript',
    name: 'JSON to TypeScript Interface & Zod Schema Compiler',
    tagline: 'Compile complex nested JSON objects into strictly typed TypeScript definitions and runtime Zod validation schemas.',
    description: 'Transform API response payloads into production-grade TypeScript interfaces or Zod schemas with instant recursive AST generation.',
    category: 'dev',
    categoryName: 'Code & Syntax',
    categorySlug: 'dev',
    icon: 'Code2',
    inputLabel: 'Source JSON Object',
    inputPlaceholder: '{\n  "id": "user_123",\n  "name": "Jane Doe",\n  "email": "jane@example.com",\n  "isActive": true\n}',
    outputLabel: 'TypeScript Interfaces & Zod Schemas',
    outputLanguage: 'typescript',
    sampleInput: JSON.stringify({
      id: "usr_9981",
      username: "alex_dev",
      profile: {
        firstName: "Alex",
        lastName: "Vance",
        age: 29,
        verified: true,
        createdAt: "2026-04-12T10:00:00.000Z"
      },
      roles: ["admin", "editor"],
      metrics: {
        totalLogins: 420,
        lastIp: "192.168.1.1"
      }
    }, null, 2),
    options: [
      { id: 'rootName', label: 'Root Type Name', type: 'text', defaultValue: 'UserPayload' },
      { id: 'mode', label: 'Output Mode', type: 'select', choices: ['typescript', 'zod', 'both'], defaultValue: 'both' },
    ],
    features: [
      'Deep recursive AST parsing of nested JSON objects',
      'Emits idiomatic TypeScript interfaces with proper type unions',
      'Generates runtime Zod validation schemas (z.object, z.string.datetime)',
      '100% client-side execution with sub-millisecond compile time',
    ],
    howToSteps: [
      { title: 'Paste API JSON', description: 'Input your raw JSON payload from Postman, curl, or browser network tab.' },
      { title: 'Choose Output Mode', description: 'Select TypeScript interfaces, Zod schemas, or both.' },
      { title: 'Integrate in Project', description: 'Copy generated interfaces directly into your code repository.' },
    ],
    faqs: [
      { question: 'Does this handle null values and arrays of mixed types?', answer: 'Yes, it accurately maps null types and creates safe union types like (string | number)[] for mixed arrays.' },
    ],
    seoKeywords: ['json to typescript', 'json to zod schema', 'typescript interface generator', 'convert json to ts online'],
  },

  'json-to-csv': {
    id: 'tool-dev-2',
    slug: 'json-to-csv',
    name: 'JSON to CSV / CSV to JSON Engine',
    tagline: 'Bidirectional flattened parser supporting custom delimiters, nested object unrolling, and quote escaping.',
    description: 'Transform complex structured JSON datasets into tabular CSV spreadsheets, or convert CSV exports back into JSON collections.',
    category: 'data',
    categoryName: 'Data Converters',
    categorySlug: 'data',
    icon: 'Table',
    inputLabel: 'Source Data (JSON Array or CSV)',
    inputPlaceholder: '[{"id": 1, "name": "Tool A"}, {"id": 2, "name": "Tool B"}]',
    outputLabel: 'Converted Tabular or JSON Result',
    outputLanguage: 'text',
    sampleInput: JSON.stringify([
      { id: "t1", name: "Robots.txt Generator", category: "SEO", isFree: true, views: 1420 },
      { id: "t2", name: "JSON to TypeScript", category: "Developer", isFree: true, views: 2890 },
      { id: "t3", name: "JWT Debugger", category: "Security", isFree: true, views: 3410 }
    ], null, 2),
    options: [
      { id: 'mode', label: 'Conversion Direction', type: 'select', choices: ['json-to-csv', 'csv-to-json'], defaultValue: 'json-to-csv' },
      { id: 'delimiter', label: 'Delimiter', type: 'select', choices: [',', ';', '\t'], defaultValue: ',' },
    ],
    features: [
      'Bidirectional conversion: JSON to CSV and CSV to JSON',
      'Automatically flattens nested JSON objects (e.g. user.profile.city)',
      'Proper RFC 4180 quotation and comma escaping',
      'Supports custom delimiters including commas, semicolons, and tabs',
    ],
    howToSteps: [
      { title: 'Choose Direction', description: 'Select JSON to CSV or CSV to JSON conversion mode.' },
      { title: 'Paste Input Data', description: 'Input your raw JSON array or spreadsheet CSV text.' },
      { title: 'Download Output', description: 'Copy the result or download as a .csv or .json file.' },
    ],
    faqs: [
      { question: 'Can this handle nested JSON objects?', answer: 'Yes, nested objects are automatically unrolled into dot-notated header columns.' },
    ],
    seoKeywords: ['json to csv converter', 'csv to json online', 'flatten json to spreadsheet', 'convert json array to csv'],
  },

  'xml-to-json': {
    id: 'tool-dev-3',
    slug: 'xml-to-json',
    name: 'XML to JSON / JSON to XML Stream Engine',
    tagline: 'Deep bidirectional serialization engine preserving tag attributes, text nodes, arrays, and CDATA payloads.',
    description: 'Seamlessly convert between legacy XML data protocols (SOAP, RSS, Sitemaps) and modern JSON application architectures.',
    category: 'data',
    categoryName: 'Data Converters',
    categorySlug: 'data',
    icon: 'FileSpreadsheet',
    inputLabel: 'XML Document or JSON Object',
    inputPlaceholder: '<catalog>\n  <item id="1">Product A</item>\n</catalog>',
    outputLabel: 'Converted JSON or XML Output',
    outputLanguage: 'json',
    sampleInput: `<feed xmlns="http://www.w3.org/2005/Atom">
  <title>AIIsEverything Developer Feed</title>
  <updated>2026-04-12T12:00:00Z</updated>
  <entry>
    <id>post-101</id>
    <title>Next-Gen Neural Code Compilation</title>
    <author>Engineering Editorial</author>
  </entry>
  <entry>
    <id>post-102</id>
    <title>Deterministic Micro-Service Routing</title>
    <author>DevOps Team</author>
  </entry>
</feed>`,
    options: [
      { id: 'mode', label: 'Conversion Direction', type: 'select', choices: ['xml-to-json', 'json-to-xml'], defaultValue: 'xml-to-json' },
    ],
    features: [
      'Bidirectional XML to JSON and JSON to XML transformations',
      'Preserves tag hierarchy, nested lists, and sibling elements',
      'Formatted, indented output with clean syntactic serialization',
      'Zero external server round-trips for complete data privacy',
    ],
    howToSteps: [
      { title: 'Paste Source Code', description: 'Input your XML or JSON payload.' },
      { title: 'Select Direction', description: 'Pick XML to JSON or JSON to XML.' },
      { title: 'Copy Formatted Output', description: 'Use the converted structure in your API services.' },
    ],
    faqs: [
      { question: 'Does this converter preserve XML attributes?', answer: 'Yes, attributes and child elements are mapped cleanly into accessible JSON properties.' },
    ],
    seoKeywords: ['xml to json converter', 'json to xml online', 'convert xml payload to json', 'xml parser online'],
  },

  'html-to-markdown': {
    id: 'tool-dev-4',
    slug: 'html-to-markdown',
    name: 'HTML to Markdown / Markdown to HTML Parser',
    tagline: 'Bi-directional parser supporting tables, code fences, nested lists, blockquotes, and task items.',
    description: 'Convert rich web articles into clean Markdown documentation for GitHub, Notion, or Obsidian, or render Markdown into semantic HTML.',
    category: 'dev',
    categoryName: 'Code & Syntax',
    categorySlug: 'dev',
    icon: 'FileText',
    inputLabel: 'Source HTML Markup or Markdown Text',
    inputPlaceholder: '<h1>Title</h1>\n<p>This is a paragraph with <strong>bold</strong> text.</p>',
    outputLabel: 'Converted Markdown or HTML Output',
    outputLanguage: 'markdown',
    sampleInput: `<article>
  <h1>Mastering Modern AI Developer Tooling</h1>
  <p>Software development in 2026 demands <strong>deterministic execution</strong> and high-throughput pipelines.</p>
  <h2>Core Requirements</h2>
  <ul>
    <li>Abstract Syntax Tree (AST) compilation</li>
    <li>Edge-rendered micro-tools</li>
    <li>Zero runtime exceptions</li>
  </ul>
  <blockquote>"Architecture is the art of eliminating unnecessary friction."</blockquote>
</article>`,
    options: [
      { id: 'mode', label: 'Mode', type: 'select', choices: ['html-to-markdown', 'markdown-to-html'], defaultValue: 'html-to-markdown' },
    ],
    features: [
      'Bidirectional HTML to Markdown and Markdown to HTML conversion',
      'Converts headers (#), emphasis (**), lists, links, blockquotes',
      'Preserves code blocks and syntax formatting',
      'Sanitizes dangerous script tags from generated HTML',
    ],
    howToSteps: [
      { title: 'Paste Source Content', description: 'Input your HTML article or Markdown draft.' },
      { title: 'Execute Parser', description: 'Transform markup with preserved document semantics.' },
      { title: 'Export Clean Document', description: 'Copy or download the transformed markdown.' },
    ],
    faqs: [
      { question: 'Does this strip unwanted div and span wrappers?', answer: 'Yes, redundant layout wrappers are cleanly stripped, leaving pure semantic Markdown.' },
    ],
    seoKeywords: ['html to markdown converter', 'markdown to html parser', 'convert webpage to markdown', 'html to md online'],
  },

  'css-to-tailwind': {
    id: 'tool-dev-5',
    slug: 'css-to-tailwind',
    name: 'CSS to Tailwind CSS Utility Class Converter',
    tagline: 'Transform standard CSS declarations and rules into modern, idiomatic Tailwind CSS utility classes.',
    description: 'Refactor legacy stylesheets into Tailwind utility classes with support for flexbox, grid, spacing, colors, sizing, and arbitrary values.',
    category: 'dev',
    categoryName: 'Code & Syntax',
    categorySlug: 'dev',
    icon: 'Palette',
    inputLabel: 'Standard CSS Rules or Declarations',
    inputPlaceholder: '.card {\n  display: flex;\n  justify-content: center;\n  padding: 16px;\n  border-radius: 8px;\n}',
    outputLabel: 'Equivalent Tailwind CSS Classes',
    outputLanguage: 'html',
    sampleInput: `.hero-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  margin: 0 auto;
  border-radius: 12px;
  cursor: pointer;
  box-sizing: border-box;
}`,
    features: [
      'Maps display, flexbox, grid, and alignment properties',
      'Translates px margins and paddings into rem spacing units',
      'Supports border radius, font weights, and text alignment',
      'Outputs clean class="..." snippets ready for React/Next.js components',
    ],
    howToSteps: [
      { title: 'Paste CSS Stylesheet', description: 'Input your CSS classes or style declarations.' },
      { title: 'Compile to Tailwind', description: 'Click execute to generate corresponding utility classes.' },
      { title: 'Apply to Components', description: 'Paste the generated class string directly onto your JSX elements.' },
    ],
    faqs: [
      { question: 'What happens with non-standard CSS values?', answer: 'Non-standard values are cleanly converted into Tailwind arbitrary values like [margin:17px].' },
    ],
    seoKeywords: ['css to tailwind converter', 'convert css to tailwindcss', 'tailwind utility class generator', 'css to tailwind online'],
  },

  'jwt-decoder': {
    id: 'tool-dev-6',
    slug: 'jwt-decoder',
    name: 'JWT Debugger & Signature Payload Inspector',
    tagline: 'Securely decode JSON Web Tokens, inspect header algorithms and data claims, and validate expiration status.',
    description: 'Debug OAuth 2.0 and OpenID Connect tokens completely client-side. Zero tokens are ever transmitted over the network.',
    category: 'security',
    categoryName: 'Security & Encoding',
    categorySlug: 'security',
    icon: 'Shield',
    inputLabel: 'Encoded JWT Token (Header.Payload.Signature)',
    inputPlaceholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    outputLabel: 'Decoded Token Claims & Validity Report',
    outputLanguage: 'json',
    sampleInput: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIFNtaXRoIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxODkzNDU2MDAwfQ.Pz8_Pz8_Pz8_Pz8_Pz8_Pz8_Pz8_Pz8_Pz8_Pz8_Pz8',
    features: [
      'Decodes Header, Payload, and Signature components',
      'Validates expiration timestamp (exp) against current real-time clock',
      'Computes remaining token lifespan or expired duration',
      '100% Client-side sandbox: zero network transmission for complete credential safety',
    ],
    howToSteps: [
      { title: 'Paste JWT Token', description: 'Input your bearer token or auth cookie string.' },
      { title: 'Inspect Claims', description: 'Review user IDs, scopes, roles, and validity timestamps.' },
      { title: 'Diagnose Expiry', description: 'Verify whether token is active or expired.' },
    ],
    faqs: [
      { question: 'Is my secret key required to decode?', answer: 'No, JWT payloads are base64url encoded and can be decoded without a secret. Secrets are only needed to verify cryptographic signatures.' },
    ],
    seoKeywords: ['jwt decoder', 'jwt debugger online', 'decode json web token', 'jwt expiration validator'],
  },

  'curl-to-code': {
    id: 'tool-dev-7',
    slug: 'curl-to-code',
    name: 'cURL Command to Multi-Language Code Generator',
    tagline: 'Convert raw cURL network commands into production-grade JavaScript fetch, Axios, Python Requests, and Go code.',
    description: 'Transform terminal cURL requests into copy-paste client code with method, headers, JSON bodies, and query parameters preserved.',
    category: 'dev',
    categoryName: 'Code & Syntax',
    categorySlug: 'dev',
    icon: 'Terminal',
    inputLabel: 'Raw cURL Command',
    inputPlaceholder: 'curl -X POST https://api.example.com/v1/posts -H "Content-Type: application/json" -d \'{"title": "Hello"}\'',
    outputLabel: 'Generated Multi-Language Code Snippets',
    outputLanguage: 'typescript',
    sampleInput: `curl -X POST https://api.aiiseverything.com/v1/tools/execute \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer my_jwt_token_here" \\
  -d '{"tool": "json-to-typescript", "input": "{\\"id\\": 1}"}'`,
    options: [
      { id: 'language', label: 'Target Language', type: 'select', choices: ['all', 'javascript', 'python', 'go'], defaultValue: 'all' },
    ],
    features: [
      'Extracts HTTP method, target endpoint URL, headers, and request body',
      'Generates native JavaScript fetch API snippets',
      'Generates Python requests library scripts',
      'Generates production Go net/http client code',
    ],
    howToSteps: [
      { title: 'Copy cURL Request', description: 'Copy as cURL from browser DevTools Network tab.' },
      { title: 'Select Target Language', description: 'Pick JavaScript, Python, Go, or view all snippets.' },
      { title: 'Integrate into Service', description: 'Paste the generated code into your backend or script.' },
    ],
    faqs: [
      { question: 'Can I copy cURL directly from Chrome DevTools?', answer: 'Yes! Right click any network request in Chrome/Firefox DevTools, choose "Copy as cURL", and paste it here.' },
    ],
    seoKeywords: ['curl to code converter', 'convert curl to python requests', 'curl to fetch javascript', 'curl to axios generator'],
  },

  'cron-parser': {
    id: 'tool-dev-8',
    slug: 'cron-parser',
    name: 'Cron Expression Parser & Schedule Explainer',
    tagline: 'Translate 5-part and 6-part cron expressions into plain English schedules and calculate upcoming execution timestamps.',
    description: 'Ensure automated cron jobs run exactly when expected. Calculates the next 5 upcoming execution times in UTC.',
    category: 'dev',
    categoryName: 'Code & Syntax',
    categorySlug: 'dev',
    icon: 'Clock',
    inputLabel: 'Cron Expression (5 or 6 fields)',
    inputPlaceholder: '*/15 * * * *',
    outputLabel: 'Human Schedule & Upcoming Execution Timestamps',
    outputLanguage: 'text',
    sampleInput: '0 9 * * 1-5',
    features: [
      'Deconstructs minute, hour, day-of-month, month, and day-of-week fields',
      'Translates expressions into clear, plain English descriptions',
      'Calculates the next 5 scheduled executions in UTC timestamps',
      'Supports standard shorthand wildcards (*, */n, ranges)',
    ],
    howToSteps: [
      { title: 'Enter Cron Syntax', description: 'Type in standard 5 or 6 part cron syntax.' },
      { title: 'Verify Plain English Schedule', description: 'Confirm that the schedule matches your intended timing.' },
      { title: 'Check Next Execution Times', description: 'Review the upcoming 5 runs to ensure scheduling accuracy.' },
    ],
    faqs: [
      { question: 'What does "0 9 * * 1-5" mean?', answer: 'It runs at 9:00 AM every weekday (Monday through Friday).' },
    ],
    seoKeywords: ['cron parser', 'cron expression explainer', 'cron schedule calculator', 'crontab validator online'],
  },

  'regex-tester': {
    id: 'tool-dev-9',
    slug: 'regex-tester',
    name: 'Regex Tester & Match Capturing Inspector',
    tagline: 'Live regular expression pattern matching with flag toggles, captured group inspectors, and replacement previews.',
    description: 'Test and debug complex regular expressions with real-time match highlighting, character position indexing, and substitutions.',
    category: 'dev',
    categoryName: 'Code & Syntax',
    categorySlug: 'dev',
    icon: 'CheckSquare',
    inputLabel: 'Test Subject String',
    inputPlaceholder: 'Contact us at support@aiiseverything.com or sales@enterprise.co for technical inquiries.',
    outputLabel: 'Matched Tokens & Capture Groups',
    outputLanguage: 'text',
    sampleInput: `Contact our support engineers at support@aiiseverything.com or billing@aiiseverything.com.
For enterprise licensing inquiries, reach out to enterprise-leads@google.com.`,
    options: [
      { id: 'pattern', label: 'Regex Pattern', type: 'text', defaultValue: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b' },
      { id: 'flags', label: 'Regex Flags', type: 'text', defaultValue: 'g' },
      { id: 'replaceWith', label: 'Optional Replace String', type: 'text', defaultValue: '[REDACTED_EMAIL]' },
    ],
    features: [
      'Real-time regular expression evaluation against input test strings',
      'Inspects full match positions, character indexes, and capture groups',
      'Provides match substitution and string replacement preview',
      'Supports all JavaScript regex flags (g, i, m, s, u)',
    ],
    howToSteps: [
      { title: 'Define Regex Pattern', description: 'Enter your regular expression and flags.' },
      { title: 'Supply Sample Text', description: 'Input test strings representing expected user input.' },
      { title: 'Inspect Matched Results', description: 'Review matches, positions, and capture group extractions.' },
    ],
    faqs: [
      { question: 'What does the "g" flag do?', answer: 'The global flag (g) finds all matches rather than stopping after the first match.' },
    ],
    seoKeywords: ['regex tester', 'regular expression debugger', 'regex match inspector', 'online regex replacement'],
  },

  'hash-encoder': {
    id: 'tool-dev-10',
    slug: 'hash-encoder',
    name: 'Base64 / URL / Hash Multi-Encoder & Decryptor',
    tagline: 'Web Crypto API powered cryptographic hashing (SHA-256, SHA-512, SHA-1) and Base64/URL encoding workbench.',
    description: 'Calculate cryptographic checksums and convert between Base64, URL percent-encoding, and raw string formats securely in browser.',
    category: 'security',
    categoryName: 'Security & Encoding',
    categorySlug: 'security',
    icon: 'Key',
    inputLabel: 'Input Text String',
    inputPlaceholder: 'Enter any text to hash or encode...',
    outputLabel: 'Cryptographic Hashes & Encoded Strings',
    outputLanguage: 'text',
    sampleInput: 'AIIsEverything: The Enterprise AI & Developer Tooling Platform',
    features: [
      'Calculates SHA-256, SHA-512, and SHA-1 checksums via native Web Crypto API',
      'Base64 encode and decode conversions',
      'URL percent-encoding and decoding',
      'Completely client-side execution with zero credential leakage',
    ],
    howToSteps: [
      { title: 'Input String', description: 'Type or paste the message, password, or token to hash.' },
      { title: 'Generate Hashes', description: 'Instantly compute multi-algorithm checksums.' },
      { title: 'Copy Hash Digits', description: 'Use generated hashes for integrity verification.' },
    ],
    faqs: [
      { question: 'Can SHA-256 hashes be decrypted?', answer: 'No, SHA-256 is a one-way cryptographic hash function and cannot be reversed or decrypted.' },
    ],
    seoKeywords: ['hash generator', 'sha256 online calculator', 'base64 encoder decoder', 'url encode decode online'],
  },

  // ── EXISTING & UTILITY TOOLS ──────────────────────────────
  'html-to-css-converter': {
    id: 'tool-util-1',
    slug: 'html-to-css-converter',
    name: 'HTML to CSS Converter & Class Extractor',
    tagline: 'Transform arbitrary HTML markup into organized, scoped CSS stylesheets with class extraction and element defaults.',
    description: 'Extract all class names, element IDs, and tag hierarchies from HTML markup into structured CSS skeletons in seconds.',
    category: 'dev',
    categoryName: 'Code & Syntax',
    categorySlug: 'dev',
    icon: 'FileCode',
    inputLabel: 'Paste HTML Code',
    inputPlaceholder: '<div class="hero-container">\n  <h1 class="hero-title">Hello</h1>\n  <button class="cta-btn">Click</button>\n</div>',
    outputLabel: 'Generated Scoped CSS Stylesheet',
    outputLanguage: 'css',
    sampleInput: `<div class="dashboard-wrapper">
  <header class="header-bar">
    <h1 class="page-title">Developer Console</h1>
    <button class="action-btn">New Project</button>
  </header>
  <main class="content-panel">
    <div class="metrics-grid">
      <div class="metric-card">
        <span class="card-label">Execution Time</span>
      </div>
    </div>
  </main>
</div>`,
    features: [
      'Extracts all CSS classes and unique element IDs automatically',
      'Generates responsive layout resets for flex and grid containers',
      'Scoped selector prefix support to avoid CSS namespace collisions',
      'Clean modular formatting ready for design system integration',
    ],
    howToSteps: [
      { title: 'Paste HTML Markup', description: 'Input your component or page structure.' },
      { title: 'Extract Selectors', description: 'Click execute to generate matching CSS blocks.' },
      { title: 'Style Component', description: 'Fill in specific color and font styles for each selector.' },
    ],
    faqs: [
      { question: 'Does this converter extract inline style tags?', answer: 'It focuses on extracting CSS class and ID selectors to encourage clean separation of concerns.' },
    ],
    seoKeywords: ['html to css converter', 'extract css from html', 'html class to css generator', 'generate stylesheet from html'],
  },

  'json-formatter': {
    id: 'tool-util-2',
    slug: 'json-formatter',
    name: 'JSON Formatter, Minifier & Validator',
    tagline: 'Beautify, validate, and minify JSON payloads with line-and-column syntax error diagnosis.',
    description: 'Validate API responses, clean up messy JSON files, and pinpoint exact syntax error locations with instant line and column indicators.',
    category: 'dev',
    categoryName: 'Code & Syntax',
    categorySlug: 'dev',
    icon: 'Code',
    inputLabel: 'Paste Raw or Unformatted JSON',
    inputPlaceholder: '{"name":"AIIsEverything","tools":26,"isFree":true}',
    outputLabel: 'Beautified or Minified JSON',
    outputLanguage: 'json',
    sampleInput: '{"name":"AIIsEverything","categories":["SEO","Developer","Security"],"tools":26,"metrics":{"speedMs":1.2,"activeUsers":15200},"status":"OPERATIONAL"}',
    options: [
      { id: 'mode', label: 'Formatting Mode', type: 'select', choices: ['format', 'minify'], defaultValue: 'format' },
      { id: 'indent', label: 'Indentation Spaces', type: 'select', choices: ['2', '4'], defaultValue: '2' },
    ],
    features: [
      'Prettifies and minifies JSON payloads instantly',
      'Validates RFC 8259 syntax compliance',
      'Accurately indicates line and column on syntax errors',
      'Handles multi-megabyte payloads in browser with zero lag',
    ],
    howToSteps: [
      { title: 'Paste JSON Code', description: 'Input unformatted or minified JSON text.' },
      { title: 'Format or Minify', description: 'Choose 2-space indentation or compact minified output.' },
      { title: 'Copy Clean Result', description: '1-click copy clean JSON to your clipboard.' },
    ],
    faqs: [
      { question: 'Is my JSON uploaded to any server?', answer: 'No, all JSON formatting and validation happens strictly in your local browser sandbox.' },
    ],
    seoKeywords: ['json formatter', 'json beautifier', 'json validator online', 'minify json payload'],
  },

  'ai-summarizer': {
    id: 'tool-util-3',
    slug: 'ai-summarizer',
    name: 'AI Text Summarizer & Executive Brief Generator',
    tagline: 'Condense long articles, reports, and whitepapers into actionable executive bullet points in seconds.',
    description: 'Uses advanced extractive natural language algorithms to identify core insights, key arguments, and takeaway bullets without fluff.',
    category: 'text',
    categoryName: 'Content & Writing',
    categorySlug: 'text',
    icon: 'Sparkles',
    inputLabel: 'Document Text or Article',
    inputPlaceholder: 'Paste long articles, research studies, or meeting notes...',
    outputLabel: 'Executive Summary & Bullet Points',
    outputLanguage: 'text',
    sampleInput: `Artificial intelligence is fundamentally restructuring how software engineers design, test, and deploy applications. Rather than manually writing boilerplate components, modern engineering teams leverage specialized AI developer tools that handle deterministic transformations, AST parsing, and security auditing. This shift drastically reduces development cycles and allows engineers to focus on architectural reliability and system scalability. High-throughput platforms built around interactive web worker tools provide instant sub-millisecond responsiveness without incurring unnecessary cloud API costs. Ultimately, the integration of intelligent developer suites represents the most significant productivity inflection point in modern software engineering history.`,
    options: [
      { id: 'length', label: 'Summary Length', type: 'select', choices: ['short', 'medium', 'detailed'], defaultValue: 'medium' },
    ],
    features: [
      'Term frequency sentence ranking and extractive intelligence',
      'Condenses verbose copy into actionable executive bullet points',
      'Customizable summary length (short, medium, detailed)',
      'Computes original vs summarized compression ratios',
    ],
    howToSteps: [
      { title: 'Paste Document Text', description: 'Input the text of the article or meeting transcript.' },
      { title: 'Choose Brevity', description: 'Select short, medium, or detailed summary mode.' },
      { title: 'Review Key Points', description: 'Read the extracted executive takeaways.' },
    ],
    faqs: [
      { question: 'What is extractive summarization?', answer: 'Extractive summarization identifies the most mathematically significant and context-rich sentences directly from the original text.' },
    ],
    seoKeywords: ['ai text summarizer', 'executive summary generator', 'summarize article online', 'ai bullet points extractor'],
  },

  'readability-checker': {
    id: 'tool-util-4',
    slug: 'readability-checker',
    name: 'Readability Checker (Flesch-Kincaid Engine)',
    tagline: 'Score text readability, calculate Flesch-Kincaid Grade Levels, and evaluate reading audience comprehension.',
    description: 'Optimize written content for clarity and target audience comprehension with reading ease metrics, syllable counts, and sentence stats.',
    category: 'text',
    categoryName: 'Content & Writing',
    categorySlug: 'text',
    icon: 'BookOpen',
    inputLabel: 'Paste Copy to Evaluate',
    inputPlaceholder: 'Paste your blog post, email, or documentation here...',
    outputLabel: 'Readability Score & Comprehension Report',
    outputLanguage: 'text',
    sampleInput: `Building distributed web applications requires clear architectural design and disciplined engineering practices. When systems are designed with modular components and deterministic compilers, developers can iterate with confidence. Clear code leads to reliable software and happier engineering teams across the entire organization.`,
    features: [
      'Flesch Reading Ease score calculation (0 - 100)',
      'Flesch-Kincaid Grade Level mapping (e.g. Grade 8, College level)',
      'Syllable, word, and complex word accounting',
      'Average words-per-sentence complexity diagnostics',
    ],
    howToSteps: [
      { title: 'Paste Copy Draft', description: 'Input your article, email, or documentation text.' },
      { title: 'Check Reading Grade', description: 'Inspect the Flesch-Kincaid score and audience rating.' },
      { title: 'Simplify When Needed', description: 'Shorten complex sentences to increase clarity and accessibility.' },
    ],
    faqs: [
      { question: 'What is a good Flesch Reading Ease score for web content?', answer: 'A score of 60-70 (equivalent to 8th-9th grade reading level) is optimal for general web audiences.' },
    ],
    seoKeywords: ['readability checker', 'flesch kincaid grade calculator', 'text reading ease score', 'check content readability online'],
  },
};

// ── Master Execution Dispatcher ──
export async function executeTool(
  slug: string,
  input: string,
  options?: Record<string, any>
): Promise<ToolExecutionResult> {
  switch (slug) {
    // SEO
    case 'robots-txt-generator':
      return runRobotsTxtGenerator(input, options);
    case 'xml-sitemap-generator':
      return runXmlSitemapGenerator(input, options);
    case 'schema-markup-generator':
      return runSchemaMarkupGenerator(input, options);
    case 'open-graph-generator':
    case 'meta-tag-generator':
      return runOpenGraphGenerator(input, options);
    case 'canonical-hreflang-generator':
      return runCanonicalHreflangGenerator(input, options);
    case 'serp-simulator':
      return runSerpSimulator(input, options);
    case 'meta-tag-analyzer':
      return runMetaTagAnalyzer(input);
    case 'heading-structure-analyzer':
      return runHeadingStructureAnalyzer(input);
    case 'keyword-density-checker':
      return runKeywordDensityChecker(input);
    case 'slug-generator':
      return runSlugGenerator(input, options);
    case 'image-alt-seo-helper':
      return runImageAltSeoHelper(input);
    case 'link-extractor':
      return runLinkExtractor(input, options);

    // DEVELOPER
    case 'json-to-typescript':
      return runJsonToTypescript(input, options);
    case 'json-to-csv':
      return runJsonToCsv(input, options);
    case 'xml-to-json':
      return runXmlToJson(input, options);
    case 'html-to-markdown':
      return runHtmlToMarkdown(input, options);
    case 'css-to-tailwind':
      return runCssToTailwind(input);
    case 'jwt-decoder':
      return runJwtDecoder(input);
    case 'curl-to-code':
      return runCurlToCode(input, options);
    case 'cron-parser':
      return runCronParser(input);
    case 'regex-tester':
      return runRegexTester(input, options);
    case 'hash-encoder':
      return await runHashEncoder(input, options);

    // UTILITIES
    case 'html-to-css-converter':
      return runHtmlToCssConverter(input, options);
    case 'json-formatter':
      return runJsonFormatter(input, options);
    case 'ai-summarizer':
      return runAiSummarizer(input, options);
    case 'readability-checker':
      return runReadabilityChecker(input);

    default:
      // Fallback
      return {
        success: false,
        output: '',
        error: { message: `No active compiler registered for tool slug: "${slug}"` },
        telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: 0 },
      };
  }
}

export function getAllTools(): ToolDefinition[] {
  return Object.values(TOOLS_REGISTRY);
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY[slug];
}
