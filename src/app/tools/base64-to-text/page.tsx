import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, CheckCircle2, Zap, HelpCircle } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { Base64TextWorkbench } from '@/components/tools/converters/Base64TextWorkbench';
import { buildSoftwareApplicationSchema, buildBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Base64 to Text Converter — Free Online Decoder & Encoder | TOOLty',
  description:
    'Decode Base64 strings to plain text or encode text to Base64 instantly. Features full UTF-8 Unicode decoding, URL-safe Base64 support, automatic padding correction, and zero-latency client-side security.',
  keywords: [
    'base64 to text',
    'base64 decoder',
    'decode base64',
    'base64 to string',
    'text to base64',
    'base64 encoder',
    'url safe base64',
    'developer tools',
  ],
  alternates: {
    canonical: 'https://toolty.online/tools/base64-to-text',
  },
  openGraph: {
    title: 'Base64 to Text Converter — Free Online Decoder & Encoder',
    description:
      'Instant, secure Base64 to text converter with full UTF-8 Unicode decoding and URL-safe formatting options.',
    url: 'https://toolty.online/tools/base64-to-text',
    siteName: 'TOOLty',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Base64 to Text Converter' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 to Text Converter — Free Online Decoder',
    description: 'Decode Base64 to UTF-8 text with strict error boundaries and zero server transmission.',
    images: ['/og-default.png'],
  },
};

const BASE64_INDEX_TABLE = [
  { val: '0–25', chars: 'A – Z', bin: '000000 – 011001' },
  { val: '26–51', chars: 'a – z', bin: '011010 – 110011' },
  { val: '52–61', chars: '0 – 9', bin: '110100 – 111101' },
  { val: '62', chars: '+ (or - in URL-Safe)', bin: '111110' },
  { val: '63', chars: '/ (or _ in URL-Safe)', bin: '111111' },
  { val: 'Padding', chars: '=', bin: 'Zero-fill pad' },
];

const FAQS = [
  {
    question: 'How does Base64 encoding and decoding work?',
    answer:
      'Base64 is a binary-to-text encoding scheme defined by RFC 4648. It takes groups of 3 bytes (24 bits) and divides them into 4 segments of 6 bits each. Each 6-bit segment maps to one of 64 printable ASCII characters (A-Z, a-z, 0-9, +, /). Decoding reverses this operation, turning 4 characters back into the original 3 raw bytes.',
  },
  {
    question: 'Why do other online Base64 decoders fail with Unicode or emojis?',
    answer:
      'Many simplistic web tools use standard window.atob(), which interprets binary strings strictly as Latin-1 (ISO-8859-1). When encountering multi-byte UTF-8 sequences (like emojis or non-Latin alphabets), standard atob crashes or outputs corrupted mojibake characters. Our converter uses native Uint8Array and TextDecoder("utf-8") pipelines to guarantee 100% fidelity for all global Unicode scripts.',
  },
  {
    question: 'What is URL-Safe Base64?',
    answer:
      'Standard Base64 contains the characters "+" and "/", which have special reserved meanings in web URLs and filenames. URL-Safe Base64 replaces "+" with "-" (hyphen) and "/" with "_" (underscore), and optionally strips trailing "=" padding characters so the string can be safely passed inside query parameters or path segments without percent-encoding.',
  },
  {
    question: 'What causes "Invalid Base64 sequence" errors?',
    answer:
      'This error happens when the input contains illegal characters not present in the 64-character alphabet, or when the string length is not a multiple of 4 and cannot be safely padded. Our tool automatically strips extraneous whitespace and attempts auto-padding, flagging any invalid tokens with an inline error message.',
  },
  {
    question: 'Is it safe to decode private tokens, API keys, or JWTs here?',
    answer:
      'Yes. Conversion execution occurs entirely inside your local browser thread using pure client-side JavaScript. No data, payloads, or credentials are sent over the network or stored in server logs.',
  },
];

export default function Base64ToTextPage() {
  const canonicalUrl = 'https://toolty.online/tools/base64-to-text';

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://toolty.online' },
    { name: 'Tools', item: 'https://toolty.online/tools' },
    { name: 'Base64 to Text Converter', item: canonicalUrl },
  ]);

  const appSchema = buildSoftwareApplicationSchema({
    name: 'Base64 to Text Converter',
    description: 'Decode Base64 strings to plain text or encode text to Base64 with UTF-8 Unicode decoding.',
    url: canonicalUrl,
    applicationCategory: 'DeveloperApplication',
    isFree: true,
    featureList: [
      'UTF-8 Unicode and emoji support',
      'URL-Safe Base64 toggle (- and _)',
      'Line break formatting at 76 characters',
      'Two-way decoding and encoding',
      '100% private browser-native execution',
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
            <span className="text-slate-900 dark:text-slate-100 font-semibold">Base64 to Text Converter</span>
          </nav>

          {/* Heading Block */}
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 dark:border-[#00D2FF]/30 bg-orange-500/5 dark:bg-[#00D2FF]/10 px-3 py-1 text-xs font-bold text-orange-600 dark:text-[#00D2FF] mb-3">
              <Zap className="h-3.5 w-3.5" />
              <span>RFC 4648 Compliant Decoder</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Base64 to Text Converter
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Decode Base64 payloads into readable text or encode plain text to Base64 in real time.
              Built-in UTF-8 decoder handles emojis, international characters, URL-safe variants, and automatic padding repair.
            </p>
          </div>

          {/* ── Interactive Workbench ── */}
          <div className="mb-16">
            <Base64TextWorkbench />
          </div>

          {/* ── SEO Section ── */}
          <section className="pt-10 border-t border-slate-200 dark:border-slate-800/80 space-y-14">
            {/* Features Grid */}
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight mb-6">
                Engine Capabilities &amp; Technical Highlights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Full UTF-8 Unicode Decoding', desc: 'Eliminates atob() byte truncation. Fully supports international language characters, accented vowels, and emojis.' },
                  { title: 'URL-Safe Variant Support', desc: 'Encodes and decodes URL-friendly Base64 where "+" and "/" are safely substituted with "-" and "_".' },
                  { title: 'Automatic Padding Healing', desc: 'Automatically calculates missing "=" padding characters to recover truncated or unpadded base64 inputs.' },
                  { title: 'Two-Way Encode & Decode', desc: 'Easily switch from Base64 to text or plain text to Base64 with a single click in the top toolbar.' },
                  { title: 'Strict RFC Validation', desc: 'Validates characters against the RFC 4648 specification and displays inline errors for malformed sequences.' },
                  { title: 'Local Browser Sandbox', desc: 'Executes 100% on the client side with zero telemetry, keeping your API tokens and credentials confidential.' },
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

            {/* Base64 Character Set Reference Table */}
            <div>
              <div className="max-w-3xl mb-6">
                <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                  RFC 4648 Base64 Alphabet Index Table
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  How 6-bit binary integer values are mapped into ASCII representation.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="py-3 px-4 font-bold">Index Value (Decimal)</th>
                      <th className="py-3 px-4 font-bold">Characters Mapped</th>
                      <th className="py-3 px-4 font-bold">6-Bit Binary Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-400">
                    {BASE64_INDEX_TABLE.map((row) => (
                      <tr key={row.val} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{row.val}</td>
                        <td className="py-2.5 px-4 font-bold text-orange-600 dark:text-[#00D2FF]">{row.chars}</td>
                        <td className="py-2.5 px-4 text-slate-400">{row.bin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* How to use */}
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight mb-6">
                How to Decode Base64 to Plain Text
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: 'Paste Base64', text: 'Paste your Base64 encoded string into the input pane. Whitespace and newlines are cleaned automatically.' },
                  { step: '02', title: 'Instant Decoding', text: 'The tool immediately processes binary byte chunks and translates them to human-readable text via UTF-8.' },
                  { step: '03', title: 'Copy Text', text: 'Click "Copy to Clipboard" to transfer your decoded message into your editor or terminal.' },
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
