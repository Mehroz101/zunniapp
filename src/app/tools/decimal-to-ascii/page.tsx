import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, CheckCircle2, Zap, HelpCircle, Binary } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { DecimalAsciiWorkbench } from '@/components/tools/converters/DecimalAsciiWorkbench';
import { buildSoftwareApplicationSchema, buildBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Decimal to ASCII Converter — Character Code Translator | TOOLty',
  description:
    'Convert decimal numbers (base-10 character codes) to ASCII and UTF-8 characters instantly. Free online Decimal to ASCII converter with support for spaces, commas, newlines, HTML entities, and reverse ASCII to Decimal encoding.',
  keywords: [
    'decimal to ascii',
    'decimal to ascii converter',
    'convert decimal to ascii',
    'ascii decimal code',
    'ascii table',
    'char code to text',
    'ascii to decimal',
    'developer tools',
  ],
  alternates: {
    canonical: 'https://toolty.online/tools/decimal-to-ascii',
  },
  openGraph: {
    title: 'Decimal to ASCII Converter — Character Code Translator',
    description:
      'Translate decimal byte integers into human-readable ASCII and UTF-8 strings with zero-latency browser execution.',
    url: 'https://toolty.online/tools/decimal-to-ascii',
    siteName: 'TOOLty',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Decimal to ASCII Converter' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Decimal to ASCII Converter — Character Code Translator',
    description: 'Instant client-side Decimal to ASCII and ASCII to Decimal converter with full Unicode codepoint safety.',
    images: ['/og-default.png'],
  },
};

const DECIMAL_ASCII_TABLE = [
  { dec: 32, char: 'Space', desc: 'Space character' },
  { dec: 33, char: '!', desc: 'Exclamation mark' },
  { dec: 48, char: '0', desc: 'Digit Zero' },
  { dec: 49, char: '1', desc: 'Digit One' },
  { dec: 65, char: 'A', desc: 'Uppercase Latin letter A' },
  { dec: 66, char: 'B', desc: 'Uppercase Latin letter B' },
  { dec: 90, char: 'Z', desc: 'Uppercase Latin letter Z' },
  { dec: 97, char: 'a', desc: 'Lowercase Latin letter a' },
  { dec: 98, char: 'b', desc: 'Lowercase Latin letter b' },
  { dec: 122, char: 'z', desc: 'Lowercase Latin letter z' },
  { dec: 64, char: '@', desc: 'At sign' },
  { dec: 38, char: '&', desc: 'Ampersand' },
  { dec: 35, char: '#', desc: 'Number sign / Hash' },
];

const FAQS = [
  {
    question: 'How does Decimal to ASCII conversion work?',
    answer:
      'In computer systems, every text character corresponds to an integer code point. The standard ASCII table maps numbers 0 through 127 to specific English letters, numbers, punctuation marks, and control characters. The converter reads each decimal integer (e.g. 72, 101, 108, 108, 111) and retrieves the corresponding character using native String.fromCodePoint(), yielding "Hello".',
  },
  {
    question: 'Can this tool handle numbers above 127 (Unicode / Extended ASCII)?',
    answer:
      'Yes. Our engine supports the complete Unicode character space up to code point 1,114,111 (0x10FFFF). This allows you to translate international alphabets, math symbols, and modern emojis (e.g. decimal 128640 maps to the rocket emoji 🚀).',
  },
  {
    question: 'How should I separate decimal numbers in the input?',
    answer:
      'The parser is extremely forgiving. You can separate decimal numbers using spaces (e.g. 72 101), commas (72, 101), semicolons, new lines, or even HTML numeric entity format (&#72;&#101;). The tool automatically sanitizes the tokens and translates each valid integer.',
  },
  {
    question: 'Can I convert text back to decimal numbers?',
    answer:
      'Yes. Simply click the "Decimal → ASCII" toggle in the top bar to switch to "ASCII → Decimal" mode. You can choose whether the resulting numbers are separated by spaces, commas, or line breaks.',
  },
  {
    question: 'Is my input data kept private and secure?',
    answer:
      'Absolutely. The translation logic runs 100% inside your local browser JavaScript engine. No keystrokes, numbers, or decoded text strings are ever sent across the network.',
  },
];

export default function DecimalToAsciiPage() {
  const canonicalUrl = 'https://toolty.online/tools/decimal-to-ascii';

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://toolty.online' },
    { name: 'Tools', item: 'https://toolty.online/tools' },
    { name: 'Decimal to ASCII Converter', item: canonicalUrl },
  ]);

  const appSchema = buildSoftwareApplicationSchema({
    name: 'Decimal to ASCII Converter',
    description: 'Convert decimal character codes to ASCII and UTF-8 characters with full Unicode safety.',
    url: canonicalUrl,
    applicationCategory: 'DeveloperApplication',
    isFree: true,
    featureList: [
      'Flexible input delimiters (spaces, commas, newlines, HTML entities)',
      'Full Unicode code point support up to 0x10FFFF',
      'Two-way Decimal to ASCII and ASCII to Decimal conversion',
      'Instant client-side calculation with zero latency',
      'Inline error boundaries for out-of-range tokens',
    ],
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[#FF8A00]/30 selection:text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono mb-6">
            <Link href="/" className="hover:text-orange-600 dark:hover:text-[#00D2FF] transition">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-700" />
            <Link href="/tools" className="hover:text-orange-600 dark:hover:text-[#00D2FF] transition">
              Tools
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-700" />
            <span className="text-slate-900 dark:text-slate-100 font-semibold">Decimal to ASCII Converter</span>
          </nav>

          {/* Heading Block */}
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 dark:border-[#00D2FF]/30 bg-orange-500/5 dark:bg-[#00D2FF]/10 px-3 py-1 text-xs font-bold text-orange-600 dark:text-[#00D2FF] mb-3">
              <Binary className="h-3.5 w-3.5" />
              <span>Base-10 Character Code Translator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Decimal to ASCII Converter
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert decimal character codes (base-10 integers) to readable ASCII and Unicode text.
              Supports space and comma separated values, HTML entities, and two-way ASCII to Decimal translation.
            </p>
          </div>

          {/* ── Interactive Workbench ── */}
          <div className="mb-16">
            <DecimalAsciiWorkbench />
          </div>

          {/* ── SEO Section ── */}
          <section className="pt-10 border-t border-slate-200 dark:border-slate-800/80 space-y-14">
            {/* Features */}
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight mb-6">
                Engine Features &amp; Standards
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Universal Delimiter Parsing', desc: 'Accepts spaces, commas, semicolons, line breaks, or HTML entities (&#72;) without manual cleanup.' },
                  { title: 'Full Unicode CodePoints', desc: 'Safely translates characters beyond basic 7-bit ASCII up to Unicode 0x10FFFF using String.fromCodePoint.' },
                  { title: 'Two-Way Conversion', desc: 'Easily convert ASCII/Unicode text strings into decimal numbers with customizable output formatting.' },
                  { title: 'Strict Range Validation', desc: 'Flags invalid non-numeric inputs or integers out of Unicode bounds with clear inline error guidance.' },
                  { title: 'Deterministic Performance', desc: 'Processes thousands of character codes in sub-millisecond execution times directly in your browser.' },
                  { title: '100% Client-Side Privacy', desc: 'Zero data is sent to any server. Complete privacy and offline operation guaranteed.' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070b14] p-5 shadow-xs"
                  >
                    <CheckCircle2 className="h-4 w-4 text-orange-500 dark:text-[#00D2FF] mb-2" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Decimal to ASCII Reference Table */}
            <div>
              <div className="max-w-3xl mb-6">
                <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                  Decimal to ASCII Quick Reference Table
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Standard decimal values for common alphanumeric and punctuation characters.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="py-3 px-4 font-bold">Decimal Code</th>
                      <th className="py-3 px-4 font-bold">ASCII Character</th>
                      <th className="py-3 px-4 font-bold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-400">
                    {DECIMAL_ASCII_TABLE.map((row) => (
                      <tr key={row.dec} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="py-2.5 px-4 font-bold text-orange-600 dark:text-[#00D2FF]">{row.dec}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{row.char}</td>
                        <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* How to use */}
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight mb-6">
                How to Convert Decimal to ASCII Online
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: 'Input Numbers', text: 'Enter decimal integers separated by spaces or commas (e.g. 72 101 108 108 111) in the left pane.' },
                  { step: '02', title: 'Real-Time Parsing', text: 'The tool validates each code point against Unicode standards and generates the text instantly.' },
                  { step: '03', title: 'Copy Result', text: 'Click "Copy to Clipboard" to transfer your converted text string into your software or documents.' },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070b14] p-6 shadow-xs relative"
                  >
                    <span className="text-3xl font-black text-orange-500/20 dark:text-[#00D2FF]/20 font-mono">
                      {s.step}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">{s.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070b14] p-6 shadow-xs"
                  >
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-orange-500 dark:text-[#00D2FF] shrink-0" />
                      <span>{faq.question}</span>
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Newsletter Box */}
          <div className="mt-20 text-center max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Stay in the Loop</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Get notified when new developer compilers, byte decoders, and diagnostic utilities are released.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
