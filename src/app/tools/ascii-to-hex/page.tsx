import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, CheckCircle2, Zap, HelpCircle, Code2, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { AsciiHexWorkbench } from '@/components/tools/converters/AsciiHexWorkbench';
import { buildSoftwareApplicationSchema, buildBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'ASCII to Hex Converter — Free Online Character Encoder | FreeToolsStore',
  description:
    'Convert ASCII and UTF-8 text strings to hexadecimal notation instantly. Free online ASCII to Hex converter with custom delimiters (space, comma, 0x, \\x), uppercase/lowercase options, and two-way hex decoding.',
  keywords: [
    'ascii to hex',
    'ascii to hex converter',
    'hex converter',
    'convert ascii to hexadecimal',
    'text to hex',
    'hex to ascii',
    'utf-8 to hex',
    'developer utilities',
  ],
  alternates: {
    canonical: 'https://freetoolsstore.online/tools/ascii-to-hex',
  },
  openGraph: {
    title: 'ASCII to Hex Converter — Free Online Character Encoder',
    description:
      'Convert ASCII and UTF-8 characters to clean hexadecimal representations with zero latency in your browser.',
    url: 'https://freetoolsstore.online/tools/ascii-to-hex',
    siteName: 'FreeToolsStore',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ASCII to Hex Converter' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASCII to Hex Converter — Free Online Character Encoder',
    description: 'Instant client-side ASCII and UTF-8 to Hex converter with customizable delimiters.',
    images: ['/og-default.png'],
  },
};

const ASCII_HEX_TABLE = [
  { char: 'Space', dec: 32, hex: '20', bin: '00100000' },
  { char: '!', dec: 33, hex: '21', bin: '00100001' },
  { char: '"', dec: 34, hex: '22', bin: '00100010' },
  { char: '#', dec: 35, hex: '23', bin: '00100011' },
  { char: '$', dec: 36, hex: '24', bin: '00100100' },
  { char: '%', dec: 37, hex: '25', bin: '00100101' },
  { char: '&', dec: 38, hex: '26', bin: '00100110' },
  { char: "'", dec: 39, hex: '27', bin: '00100111' },
  { char: '0', dec: 48, hex: '30', bin: '00110000' },
  { char: '1', dec: 49, hex: '31', bin: '00110001' },
  { char: '9', dec: 57, hex: '39', bin: '00111001' },
  { char: 'A', dec: 65, hex: '41', bin: '01000001' },
  { char: 'B', dec: 66, hex: '42', bin: '01000010' },
  { char: 'M', dec: 77, hex: '4D', bin: '01001101' },
  { char: 'Z', dec: 90, hex: '5A', bin: '01011010' },
  { char: 'a', dec: 97, hex: '61', bin: '01100001' },
  { char: 'b', dec: 98, hex: '62', bin: '01100010' },
  { char: 'm', dec: 109, hex: '6D', bin: '01101101' },
  { char: 'z', dec: 122, hex: '7A', bin: '01111010' },
];

const FAQS = [
  {
    question: 'How does ASCII to Hex conversion work?',
    answer:
      'Each character in the ASCII or UTF-8 character set is represented by a numerical byte value (0–255). The ASCII to Hex converter reads each byte and formats it as a base-16 (hexadecimal) two-digit number. For example, the capital letter "A" has decimal value 65, which corresponds to hex 41.',
  },
  {
    question: 'Does this converter support Unicode and emojis?',
    answer:
      'Yes. Our converter uses native UTF-8 binary encoding (TextEncoder/TextDecoder), allowing multi-byte characters such as accented vowels (é, ü), non-Latin scripts (Arabic, Cyrillic, Chinese), and emojis (🚀) to be cleanly converted to their multi-byte hexadecimal byte sequences.',
  },
  {
    question: 'What is the difference between uppercase and lowercase hex?',
    answer:
      'Hexadecimal values use digits 0–9 and letters A–F. There is no mathematical or computational difference between uppercase (e.g. 48 65 6C 6C 6F) and lowercase (48 65 6c 6c 6f). Uppercase is common in low-level firmware and networking traces, while lowercase is standard in web stylesheets and programming languages.',
  },
  {
    question: 'Can I convert Hexadecimal back to ASCII text?',
    answer:
      'Yes. Click the "Hex → ASCII" button in the workbench toolbar to switch to decoder mode. Paste your hex string with or without prefixes (0x, \\x) or spaces, and the plain text will decode immediately.',
  },
  {
    question: 'Is my data transmitted to any external server?',
    answer:
      'No. The converter runs 100% client-side in your local browser sandbox using modern JavaScript binary APIs. Your data never touches any external server or telemetry pipeline.',
  },
];

export default function AsciiToHexPage() {
  const canonicalUrl = 'https://freetoolsstore.online/tools/ascii-to-hex';

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://freetoolsstore.online' },
    { name: 'Tools', item: 'https://freetoolsstore.online/tools' },
    { name: 'ASCII to Hex Converter', item: canonicalUrl },
  ]);

  const appSchema = buildSoftwareApplicationSchema({
    name: 'ASCII to Hex Converter',
    description: 'Convert ASCII and UTF-8 text strings to hexadecimal notation instantly with custom delimiters.',
    url: canonicalUrl,
    applicationCategory: 'DeveloperApplication',
    isFree: true,
    featureList: [
      'UTF-8 multi-byte encoding',
      'Configurable delimiters (space, comma, 0x, \\x)',
      'Uppercase and lowercase hex toggles',
      'Two-way Hex to ASCII reverse decoding',
      'Zero-latency browser-native execution',
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
      {/* Schema.org Injections */}
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
            <span className="text-slate-900 dark:text-slate-100 font-semibold">ASCII to Hex Converter</span>
          </nav>

          {/* Heading Block */}
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 dark:border-[#00D2FF]/30 bg-orange-500/5 dark:bg-[#00D2FF]/10 px-3 py-1 text-xs font-bold text-orange-600 dark:text-[#00D2FF] mb-3">
              <Zap className="h-3.5 w-3.5" />
              <span>High-Performance Character Encoder</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              ASCII to Hex Converter
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert plain text and ASCII characters into hexadecimal format with live UTF-8 byte stream processing.
              Supports custom space, comma, 0x, and \x delimiters with instant two-way decoding.
            </p>
          </div>

          {/* ── Interactive Client-Side Workbench ── */}
          <div className="mb-16">
            <AsciiHexWorkbench />
          </div>

          {/* ── SEO Section: Capabilities & Instructions ── */}
          <section className="pt-10 border-t border-slate-200 dark:border-slate-800/80 space-y-14">
            {/* Features Grid */}
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight mb-6">
                Key Encoder Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'UTF-8 Binary Engine', desc: 'Accurately converts standard 7-bit ASCII and multi-byte UTF-8 Unicode characters.' },
                  { title: 'Custom Output Delimiters', desc: 'Choose between spaces (48 65), comma separation, no spaces, 0x prefixes, or \\x escapes.' },
                  { title: 'Two-Way Conversion', desc: 'Seamlessly toggle between ASCII to Hex and Hex to ASCII decoding with automatic token cleaning.' },
                  { title: 'Case Selection', desc: 'Switch between lowercase (6a 6b) and uppercase (6A 6B) hexadecimal formats on demand.' },
                  { title: 'Live Performance Telemetry', desc: 'Displays exact character count, total generated bytes, and sub-millisecond calculation benchmarks.' },
                  { title: '100% Client-Side Privacy', desc: 'Executed locally in your browser memory. No data is stored, cached, or transmitted to any server.' },
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

            {/* ASCII to Hex Reference Table */}
            <div>
              <div className="max-w-3xl mb-6">
                <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                  Common ASCII to Hex Reference Table
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Standard ASCII character values mapped to decimal, hexadecimal (base-16), and binary (base-2).
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="py-3 px-4 font-bold">Character</th>
                      <th className="py-3 px-4 font-bold">Decimal</th>
                      <th className="py-3 px-4 font-bold">Hexadecimal</th>
                      <th className="py-3 px-4 font-bold">Binary (8-bit)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-400">
                    {ASCII_HEX_TABLE.map((row) => (
                      <tr key={row.dec} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{row.char}</td>
                        <td className="py-2.5 px-4">{row.dec}</td>
                        <td className="py-2.5 px-4 font-bold text-orange-600 dark:text-[#00D2FF]">{row.hex}</td>
                        <td className="py-2.5 px-4 text-slate-400">{row.bin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step-by-Step How To Guide */}
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight mb-6">
                How to Convert ASCII to Hex Online
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: 'Enter Text', text: 'Type or paste your text into the left input pane. Multi-byte characters and emojis are fully supported.' },
                  { step: '02', title: 'Choose Format', text: 'Select your preferred delimiter (space, comma, 0x, \\x) and toggle between lowercase and uppercase hex.' },
                  { step: '03', title: 'Copy Output', text: 'Your converted hexadecimal output generates instantly. Click "Copy to Clipboard" to paste into your codebase.' },
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
