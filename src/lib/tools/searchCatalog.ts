// Ultra-lean static search catalog for zero-blocking homepage hydration
// Automatically isolated from heavy compiler engines, AST parsers, and external modules.

export interface SearchToolItem {
  slug: string;
  name: string;
  tagline: string;
  categoryName: string;
  seoKeywords: string[];
}

export const SEARCH_TOOLS: SearchToolItem[] = [
  {
    "slug": "robots-txt-generator",
    "name": "Robots.txt Generator & Directives Validator",
    "tagline": "Configure granular crawl rules for Googlebot, Bingbot, GPTBot, and PerplexityBot with live syntax validation.",
    "categoryName": "SEO Diagnostics",
    "seoKeywords": [
      "robots txt generator",
      "seo crawler rules",
      "block gptbot robots txt",
      "validate robots.txt online"
    ]
  },
  {
    "slug": "xml-sitemap-generator",
    "name": "XML Sitemap Generator & Tag Validator",
    "tagline": "Generate schema-compliant XML sitemaps validating against RFC 3986 with priority and changefreq settings.",
    "categoryName": "SEO Diagnostics",
    "seoKeywords": [
      "xml sitemap generator",
      "sitemap validator",
      "google sitemap builder",
      "free online sitemap creator"
    ]
  },
  {
    "slug": "schema-markup-generator",
    "name": "JSON-LD Schema Markup Builder & Validator",
    "tagline": "Build Google Rich Snippet JSON-LD structured data for Articles, Organizations, Software, FAQs, and Products.",
    "categoryName": "SEO Diagnostics",
    "seoKeywords": [
      "schema markup generator",
      "json ld generator",
      "rich snippets builder",
      "faq schema generator"
    ]
  },
  {
    "slug": "open-graph-generator",
    "name": "Open Graph & Twitter Card Social Previewer",
    "tagline": "Generate pixel-perfect meta tags for Facebook, LinkedIn, Twitter, and Pinterest with live social card previews.",
    "categoryName": "SEO Diagnostics",
    "seoKeywords": [
      "open graph generator",
      "twitter card generator",
      "social share previewer",
      "og meta tags builder"
    ]
  },
  {
    "slug": "canonical-hreflang-generator",
    "name": "Canonical & International Hreflang Constructor",
    "tagline": "Construct bidirectional self-referential canonical tags and ISO 639-1 / ISO 3166-1 hreflang language clusters.",
    "categoryName": "SEO Diagnostics",
    "seoKeywords": [
      "hreflang generator",
      "canonical tag builder",
      "international seo generator",
      "multilingual seo tags"
    ]
  },
  {
    "slug": "serp-simulator",
    "name": "SERP Snippet & Pixel Width Calculator",
    "tagline": "Calculate exact proportional font pixel widths for Google desktop and mobile search snippets to eliminate truncation.",
    "categoryName": "SEO Diagnostics",
    "seoKeywords": [
      "serp simulator",
      "google pixel width calculator",
      "serp preview tool",
      "meta title length checker"
    ]
  },
  {
    "slug": "meta-tag-analyzer",
    "name": "Technical Meta Tag Inspector & Heading Auditor",
    "tagline": "Audit HTML head markup for title lengths, meta descriptions, viewports, canonical tags, and OpenGraph health scores.",
    "categoryName": "SEO Diagnostics",
    "seoKeywords": [
      "meta tag analyzer",
      "html head tag checker",
      "technical seo audit",
      "meta tag inspector online"
    ]
  },
  {
    "slug": "heading-structure-analyzer",
    "name": "Heading Hierarchy (H1-H6) Tree Analyzer",
    "tagline": "Generate visual hierarchical node trees of H1-H6 headings and flag skipped levels, multiple H1s, and empty nodes.",
    "categoryName": "SEO Diagnostics",
    "seoKeywords": [
      "heading hierarchy analyzer",
      "h1 h6 tag checker",
      "heading structure seo",
      "html heading tree visualizer"
    ]
  },
  {
    "slug": "keyword-density-checker",
    "name": "Keyword Density & N-Gram Tokenizer",
    "tagline": "Compute 1-gram, 2-gram, and 3-gram frequencies, strip language stop words, and highlight keyword stuffing risks.",
    "categoryName": "SEO Diagnostics",
    "seoKeywords": [
      "keyword density checker",
      "ngram tokenizer",
      "keyword frequency analyzer",
      "keyword stuffing detector"
    ]
  },
  {
    "slug": "slug-generator",
    "name": "URL Slug Sanitizer & Redirection Rule Builder",
    "tagline": "Generate URL-safe slugs with Apache .htaccess 301 Redirects and NGINX rewrite directives automatically.",
    "categoryName": "SEO Diagnostics",
    "seoKeywords": [
      "slug generator",
      "url slug sanitizer",
      "301 redirect rule builder",
      "seo friendly url creator"
    ]
  },
  {
    "slug": "image-alt-seo-helper",
    "name": "Image Alt-Text Quality Inspector",
    "tagline": "Scan HTML image tags, pinpoint missing or generic descriptions, and generate keyword-rich accessibility attributes.",
    "categoryName": "SEO Diagnostics",
    "seoKeywords": [
      "image alt checker",
      "seo alt text helper",
      "image accessibility audit",
      "alt attribute optimizer"
    ]
  },
  {
    "slug": "link-extractor",
    "name": "Internal vs. External Link Extractor & Rel Auditor",
    "tagline": "Extract all anchor references, classify internal vs external endpoints, and audit rel=\"noopener\" and nofollow safety.",
    "categoryName": "SEO Diagnostics",
    "seoKeywords": [
      "link extractor",
      "anchor tag auditor",
      "internal link checker",
      "rel noopener audit tool"
    ]
  },
  {
    "slug": "json-to-typescript",
    "name": "JSON to TypeScript Interface & Zod Schema Compiler",
    "tagline": "Compile complex nested JSON objects into strictly typed TypeScript definitions and runtime Zod validation schemas.",
    "categoryName": "Code & Syntax",
    "seoKeywords": [
      "json to typescript",
      "json to zod schema",
      "typescript interface generator",
      "convert json to ts online"
    ]
  },
  {
    "slug": "json-to-csv",
    "name": "JSON to CSV / CSV to JSON Engine",
    "tagline": "Bidirectional flattened parser supporting custom delimiters, nested object unrolling, and quote escaping.",
    "categoryName": "Data Converters",
    "seoKeywords": [
      "json to csv converter",
      "csv to json online",
      "flatten json to spreadsheet",
      "convert json array to csv"
    ]
  },
  {
    "slug": "xml-to-json",
    "name": "XML to JSON / JSON to XML Stream Engine",
    "tagline": "Deep bidirectional serialization engine preserving tag attributes, text nodes, arrays, and CDATA payloads.",
    "categoryName": "Data Converters",
    "seoKeywords": [
      "xml to json converter",
      "json to xml online",
      "convert xml payload to json",
      "xml parser online"
    ]
  },
  {
    "slug": "html-to-markdown",
    "name": "HTML to Markdown / Markdown to HTML Parser",
    "tagline": "Bi-directional parser supporting tables, code fences, nested lists, blockquotes, and task items.",
    "categoryName": "Code & Syntax",
    "seoKeywords": [
      "html to markdown converter",
      "markdown to html parser",
      "convert webpage to markdown",
      "html to md online"
    ]
  },
  {
    "slug": "css-to-tailwind",
    "name": "CSS to Tailwind CSS Utility Class Converter",
    "tagline": "Transform standard CSS declarations and rules into modern, idiomatic Tailwind CSS utility classes.",
    "categoryName": "Code & Syntax",
    "seoKeywords": [
      "css to tailwind converter",
      "convert css to tailwindcss",
      "tailwind utility class generator",
      "css to tailwind online"
    ]
  },
  {
    "slug": "jwt-decoder",
    "name": "JWT Debugger & Signature Payload Inspector",
    "tagline": "Securely decode JSON Web Tokens, inspect header algorithms and data claims, and validate expiration status.",
    "categoryName": "Security & Encoding",
    "seoKeywords": [
      "jwt decoder",
      "jwt debugger online",
      "decode json web token",
      "jwt expiration validator"
    ]
  },
  {
    "slug": "curl-to-code",
    "name": "cURL Command to Multi-Language Code Generator",
    "tagline": "Convert raw cURL network commands into production-grade JavaScript fetch, Axios, Python Requests, and Go code.",
    "categoryName": "Code & Syntax",
    "seoKeywords": [
      "curl to code converter",
      "convert curl to python requests",
      "curl to fetch javascript",
      "curl to axios generator"
    ]
  },
  {
    "slug": "cron-parser",
    "name": "Cron Expression Parser & Schedule Explainer",
    "tagline": "Translate 5-part and 6-part cron expressions into plain English schedules and calculate upcoming execution timestamps.",
    "categoryName": "Code & Syntax",
    "seoKeywords": [
      "cron parser",
      "cron expression explainer",
      "cron schedule calculator",
      "crontab validator online"
    ]
  },
  {
    "slug": "regex-tester",
    "name": "Regex Tester & Match Capturing Inspector",
    "tagline": "Live regular expression pattern matching with flag toggles, captured group inspectors, and replacement previews.",
    "categoryName": "Code & Syntax",
    "seoKeywords": [
      "regex tester",
      "regular expression debugger",
      "regex match inspector",
      "online regex replacement"
    ]
  },
  {
    "slug": "hash-encoder",
    "name": "Base64 / URL / Hash Multi-Encoder & Decryptor",
    "tagline": "Web Crypto API powered cryptographic hashing (SHA-256, SHA-512, SHA-1) and Base64/URL encoding workbench.",
    "categoryName": "Security & Encoding",
    "seoKeywords": [
      "hash generator",
      "sha256 online calculator",
      "base64 encoder decoder",
      "url encode decode online"
    ]
  },
  {
    "slug": "html-to-css-converter",
    "name": "HTML to CSS Converter & Class Extractor",
    "tagline": "Transform arbitrary HTML markup into organized, scoped CSS stylesheets with class extraction and element defaults.",
    "categoryName": "Code & Syntax",
    "seoKeywords": [
      "html to css converter",
      "extract css from html",
      "html class to css generator",
      "generate stylesheet from html"
    ]
  },
  {
    "slug": "json-formatter",
    "name": "JSON Formatter, Minifier & Validator",
    "tagline": "Beautify, validate, and minify JSON payloads with line-and-column syntax error diagnosis.",
    "categoryName": "Code & Syntax",
    "seoKeywords": [
      "json formatter",
      "json beautifier",
      "json validator online",
      "minify json payload"
    ]
  },
  {
    "slug": "ai-summarizer",
    "name": "AI Text Summarizer & Executive Brief Generator",
    "tagline": "Condense long articles, reports, and whitepapers into actionable executive bullet points in seconds.",
    "categoryName": "Content & Writing",
    "seoKeywords": [
      "ai text summarizer",
      "executive summary generator",
      "summarize article online",
      "ai bullet points extractor"
    ]
  },
  {
    "slug": "readability-checker",
    "name": "Readability Checker (Flesch-Kincaid Engine)",
    "tagline": "Score text readability, calculate Flesch-Kincaid Grade Levels, and evaluate reading audience comprehension.",
    "categoryName": "Content & Writing",
    "seoKeywords": [
      "readability checker",
      "flesch kincaid grade calculator",
      "text reading ease score",
      "check content readability online"
    ]
  },
  {
    "slug": "css-to-html",
    "name": "CSS to HTML / JSX Semantic Scaffolder",
    "tagline": "Reconstruct semantic HTML5 DOM trees and React JSX components directly from raw CSS rulesets and selector chains.",
    "categoryName": "Developer Compilers",
    "seoKeywords": [
      "css to html",
      "css to jsx",
      "scaffold html from css",
      "css selector to dom tree",
      "css to react component"
    ]
  },
  {
    "slug": "html-to-python-ast",
    "name": "HTML to Python AST / BeautifulSoup Generator",
    "tagline": "Generate executable BeautifulSoup4 web scrapers or structural DOM Abstract Syntax Trees from raw HTML.",
    "categoryName": "Developer Compilers",
    "seoKeywords": [
      "html to python ast",
      "beautifulsoup generator",
      "html to bs4 scraper",
      "python web scraping boilerplate",
      "html dom to python"
    ]
  },
  {
    "slug": "json-to-yaml",
    "name": "JSON to YAML / YAML to JSON Stream Engine",
    "tagline": "High-speed bi-directional JSON and YAML schema converter with multi-document stream support.",
    "categoryName": "Developer Compilers",
    "seoKeywords": [
      "json to yaml",
      "yaml to json",
      "convert json to yaml online",
      "k8s yaml generator",
      "json to yaml stream"
    ]
  },
  {
    "slug": "js-to-ts",
    "name": "JavaScript to TypeScript Strict Inferencer",
    "tagline": "Transpile ES6+ JavaScript into strongly typed TypeScript with automatic interface extraction and type inference.",
    "categoryName": "Developer Compilers",
    "seoKeywords": [
      "js to ts converter",
      "javascript to typescript",
      "infer typescript types online",
      "generate typescript interface from js",
      "js to ts compiler"
    ]
  },
  {
    "slug": "svg-to-jsx",
    "name": "SVG to Production JSX / TSX Component Engine",
    "tagline": "Sanitize and transform raw SVG markup into production-ready React JSX/TSX icon components.",
    "categoryName": "Developer Compilers",
    "seoKeywords": [
      "svg to jsx",
      "svg to react component",
      "svg to tsx",
      "svgr online",
      "convert svg to react icon"
    ]
  },
  {
    "slug": "sql-to-schema-orm",
    "name": "SQL to Schema ORM Generator (Prisma, Drizzle & TypeORM)",
    "tagline": "Transpile raw SQL DDL CREATE TABLE statements into type-safe Prisma Schema, Drizzle ORM, or TypeORM entities.",
    "categoryName": "Developer Compilers",
    "seoKeywords": [
      "sql to prisma",
      "sql to drizzle",
      "sql to typeorm",
      "convert sql to orm schema",
      "create table to prisma schema"
    ]
  },
  {
    "slug": "css-to-html-scaffolder",
    "name": "CSS to HTML / JSX Semantic Scaffolder",
    "tagline": "Reconstruct semantic HTML5 DOM trees and React JSX components directly from raw CSS rulesets.",
    "categoryName": "Developer Compilers",
    "seoKeywords": [
      "css to html scaffolder"
    ]
  },
  {
    "slug": "yaml-to-json",
    "name": "YAML to JSON / JSON to YAML Converter",
    "tagline": "High-speed bi-directional YAML and JSON converter.",
    "categoryName": "Developer Compilers",
    "seoKeywords": [
      "yaml to json",
      "convert yaml to json"
    ]
  },
  {
    "slug": "javascript-to-typescript",
    "name": "JavaScript to TypeScript Strict Transpiler",
    "tagline": "Transpile ES6+ JavaScript into strongly typed TypeScript.",
    "categoryName": "Developer Compilers",
    "seoKeywords": [
      "javascript to typescript"
    ]
  },
  {
    "slug": "svg-to-react",
    "name": "SVG to React JSX / TSX Component Generator",
    "tagline": "Sanitize and convert raw SVG markup into React JSX/TSX.",
    "categoryName": "Developer Compilers",
    "seoKeywords": [
      "svg to react"
    ]
  },
  {
    "slug": "sql-to-prisma",
    "name": "SQL to Prisma Schema Generator",
    "tagline": "Extract SQL CREATE TABLE DDL statements into Prisma Schema models.",
    "categoryName": "Developer Compilers",
    "seoKeywords": [
      "sql to prisma"
    ]
  },
  {
    "slug": "ai-syntax-debugger",
    "name": "AI Syntax Debugger",
    "tagline": "Neural heuristic diagnostic engine that pins down runtime stacktraces and outputs clean inline diffs.",
    "categoryName": "AI Utilities",
    "seoKeywords": [
      "ai syntax debugger",
      "code debugger online",
      "find syntax errors",
      "javascript linter online"
    ]
  },
  {
    "slug": "prompt-optimizer",
    "name": "Prompt Optimizer Pro",
    "tagline": "Compresses verbose prompts, eliminates token bloat, and structures few-shot instructions for LLMs.",
    "categoryName": "AI Utilities",
    "seoKeywords": [
      "prompt optimizer",
      "compress llm prompt",
      "token optimizer",
      "chatgpt prompt builder"
    ]
  },
  {
    "slug": "regex-neural-generator",
    "name": "RegEx Neural Generator",
    "tagline": "Turns plain English match criteria into efficient, catastrophic-backtracking-proof regular expressions.",
    "categoryName": "Code Converters",
    "seoKeywords": [
      "regex generator online",
      "english to regex",
      "regular expression builder",
      "safe regex generator"
    ]
  },
  {
    "slug": "unit-test-builder",
    "name": "Unit Test Builder",
    "tagline": "Analyzes function signatures and edge case branches to synthesize ready-to-run Vitest & Jest suites.",
    "categoryName": "Code Converters",
    "seoKeywords": [
      "unit test generator",
      "vitest test builder",
      "jest test generator",
      "typescript unit test helper"
    ]
  },
  {
    "slug": "markdown-live-editor",
    "name": "Markdown Live Editor",
    "tagline": "Real-time GFM canvas with instant KaTeX math equations, Mermaid diagrams, and one-click HTML copy.",
    "categoryName": "Text & Web",
    "seoKeywords": [
      "markdown to html converter",
      "markdown live editor",
      "gfm markdown converter",
      "markdown viewer online"
    ]
  },
  {
    "slug": "tailwind-converter",
    "name": "Tailwind Class Converter",
    "tagline": "Parses standard CSS rules and outputs corresponding modern Tailwind utility classes with JIT syntax.",
    "categoryName": "Code Converters",
    "seoKeywords": [
      "css to tailwind converter",
      "tailwind class generator",
      "convert css to tailwind",
      "tailwind jit converter"
    ]
  },
  {
    "slug": "json-patch-applier",
    "name": "JSON Patch Applier",
    "tagline": "Apply RFC 6902 JSON Patch operations (add, remove, replace, test) to a JSON document. Validate and debug JSON modifications easily.",
    "categoryName": "Code Converters",
    "seoKeywords": [
      "json patch applier",
      "rfc 6902 online",
      "apply json patch",
      "json pointer validator"
    ]
  },
  {
    "slug": "minifier-pro",
    "name": "Minifier Pro WASM",
    "tagline": "High-performance bytecode minifier for HTML, CSS, and JS. Zero payload leaks to any server.",
    "categoryName": "Code Converters",
    "seoKeywords": [
      "code minifier online",
      "css minifier",
      "javascript minifier",
      "html compressor"
    ]
  },
  {
    "slug": "ascii-to-hex",
    "name": "ASCII to Hex Converter",
    "tagline": "Convert ASCII and UTF-8 text characters into clean hexadecimal representations.",
    "categoryName": "Developer Tools",
    "seoKeywords": [
      "ascii to hex",
      "ascii to hex converter",
      "text to hex",
      "hex converter",
      "hex to ascii"
    ]
  },
  {
    "slug": "base64-to-text",
    "name": "Base64 to Text Converter",
    "tagline": "Decode Base64 strings to plain text and encode text to Base64 in real time.",
    "categoryName": "Developer Tools",
    "seoKeywords": [
      "base64 to text",
      "base64 decoder",
      "decode base64",
      "base64 to string",
      "text to base64"
    ]
  },
  {
    "slug": "hex-to-pantone",
    "name": "Hex Code to Pantone Converter",
    "tagline": "Match web Hex and RGB colors to the closest official Pantone (PMS) shade.",
    "categoryName": "Design & Code Utilities",
    "seoKeywords": [
      "hex code to pantone",
      "hex to pantone",
      "hex to pantone converter",
      "convert hex to pantone",
      "hex to pms"
    ]
  },
  {
    "slug": "decimal-to-ascii",
    "name": "Decimal to ASCII Converter",
    "tagline": "Translate decimal character codes (base-10 integers) to readable ASCII and UTF-8 text.",
    "categoryName": "Developer Tools",
    "seoKeywords": [
      "decimal to ascii",
      "decimal to ascii converter",
      "convert decimal to ascii",
      "ascii decimal code",
      "char code to ascii"
    ]
  }
];
