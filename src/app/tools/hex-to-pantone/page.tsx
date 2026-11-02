import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, CheckCircle2, Zap, HelpCircle, Palette } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { HexPantoneWorkbench } from '@/components/tools/converters/HexPantoneWorkbench';
import { buildSoftwareApplicationSchema, buildBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Hex Code to Pantone Converter — Nearest PMS Color Matcher | TOOLty',
  description:
    'Convert any web Hex color code to the closest official Pantone Matching System (PMS) color swatch. Features live side-by-side swatch comparison, Delta-E Euclidean perceptual color distance calculations, RGB/CMYK breakdowns, and alternative matches.',
  keywords: [
    'hex code to pantone',
    'hex to pantone',
    'hex to pantone converter',
    'convert hex to pantone',
    'pantone color finder',
    'hex to pms',
    'pantone matching system',
    'color converter',
    'design utilities',
  ],
  alternates: {
    canonical: 'https://toolty.online/tools/hex-to-pantone',
  },
  openGraph: {
    title: 'Hex Code to Pantone Converter — Nearest PMS Color Matcher',
    description:
      'Match any web Hex code to official Pantone PMS colors with live visual swatches, perceptual distance algorithms, and CMYK approximations.',
    url: 'https://toolty.online/tools/hex-to-pantone',
    siteName: 'TOOLty',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Hex to Pantone Converter' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hex Code to Pantone Converter — Nearest PMS Color Matcher',
    description: 'Instant client-side Hex to Pantone PMS matcher with live side-by-side swatch comparisons.',
    images: ['/og-default.png'],
  },
};

const COMMON_PANTONE_PAIRS = [
  { name: 'Pure Cyan / Reflex Accent', hex: '#00D2FF', pms: 'PMS 306 C', pmsHex: '#00B5E2', similarity: '96.2%' },
  { name: 'Warm Orange / Studio Accent', hex: '#FF8A00', pms: 'PMS 151 C', pmsHex: '#FF8200', similarity: '98.5%' },
  { name: 'Classic Crimson Red', hex: '#E03C31', pms: 'PMS 179 C', pmsHex: '#E03C31', similarity: '100%' },
  { name: 'Deep Royal Blue', hex: '#0033A0', pms: 'PMS 286 C', pmsHex: '#0033A0', similarity: '100%' },
  { name: 'Emerald Forest Green', hex: '#009639', pms: 'PMS 355 C', pmsHex: '#009639', similarity: '100%' },
  { name: 'Electric Violet Purple', hex: '#582C83', pms: 'PMS 268 C', pmsHex: '#582C83', similarity: '100%' },
  { name: 'Warm Gray Neutral', hex: '#BFB8AF', pms: 'PMS Warm Gray 3 C', pmsHex: '#BFB8AF', similarity: '100%' },
  { name: 'Obsidian Jet Black', hex: '#101820', pms: 'PMS Black 6 C', pmsHex: '#101820', similarity: '100%' },
];

const FAQS = [
  {
    question: 'How does the Hex to Pantone converter find the closest color match?',
    answer:
      'Pantone PMS is a proprietary spot-color system designed for physical print inks, while Hex is a digital screen RGB representation. Our engine translates the Hex code into linear RGB coordinates and calculates the weighted perceptual Euclidean distance (redmean formula) against standard Pantone Formula Guide colors. It returns the exact closest PMS swatch alongside its percentage similarity and Delta-E distance.',
  },
  {
    question: 'What is Delta-E (ΔE) in color matching?',
    answer:
      'Delta-E (ΔE) is the standard metric used in color science to quantify the perceptual difference between two colors. A ΔE below 1.0 is imperceptible to the human eye, a ΔE between 1.0 and 2.0 is barely noticeable upon close inspection, and a ΔE between 2.0 and 10.0 indicates a close visual match. Our tool displays both the ΔE and a normalized 0–100% similarity score.',
  },
  {
    question: 'Why do Pantone colors look slightly different on physical print versus digital screens?',
    answer:
      'Digital screens emit light using the additive RGB color space, whereas commercial printing presses absorb light using subtractive inks (Pantone spot inks or CMYK process inks). Many vibrant digital colors (such as neon blues and bright oranges) exist outside the standard printable gamut. Pantone standardized colors ensure that print shops around the world replicate consistent color regardless of printer calibration.',
  },
  {
    question: 'Can I select a color visually instead of typing a Hex code?',
    answer:
      'Yes. Click the color swatch box next to the Hex input field to open the integrated native browser color picker. As you drag the color cursor or pick any color from your screen, the closest Pantone PMS swatch and runner-up alternatives update in real time.',
  },
  {
    question: 'What does the "C" or "U" suffix mean in Pantone codes?',
    answer:
      'The letter suffix indicates the paper stock used during printing: "C" stands for Coated paper (smooth, glossy finish where ink sits on the surface, producing richer colors), while "U" stands for Uncoated paper (absorbent paper where ink sinks in, producing a softer, matte finish). Our primary database matches against standard Coated (C) reference standards.',
  },
];

export default function HexToPantonePage() {
  const canonicalUrl = 'https://toolty.online/tools/hex-to-pantone';

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: 'https://toolty.online' },
    { name: 'Tools', item: 'https://toolty.online/tools' },
    { name: 'Hex Code to Pantone Converter', item: canonicalUrl },
  ]);

  const appSchema = buildSoftwareApplicationSchema({
    name: 'Hex Code to Pantone Converter',
    description: 'Convert web Hex color codes to nearest Pantone Matching System (PMS) swatches with visual side-by-side comparison.',
    url: canonicalUrl,
    applicationCategory: 'DesignApplication',
    isFree: true,
    featureList: [
      'Perceptual Euclidean Delta-E color distance matching',
      'Side-by-side visual swatch cards',
      'Integrated native color picker',
      'RGB and CMYK print formula breakdowns',
      'Top 4 alternative closest Pantone shades',
      'Zero-latency browser calculation',
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
            <span className="text-slate-900 dark:text-slate-100 font-semibold">Hex to Pantone Converter</span>
          </nav>

          {/* Heading Block */}
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 dark:border-[#00D2FF]/30 bg-cyan-500/5 dark:bg-[#00D2FF]/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-[#00D2FF] mb-3">
              <Palette className="h-3.5 w-3.5" />
              <span>Pantone Matching System (PMS) Precision Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Hex Code to Pantone Converter
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Match digital Hex and RGB web colors to the nearest physical Pantone (PMS) shade.
              Compare side-by-side color swatches, inspect perceptual Delta-E distance metrics, and get CMYK print formulas instantly.
            </p>
          </div>

          {/* ── Interactive Workbench ── */}
          <div className="mb-16">
            <HexPantoneWorkbench />
          </div>

          {/* ── SEO Section ── */}
          <section className="pt-10 border-t border-slate-200 dark:border-slate-800/80 space-y-14">
            {/* Features */}
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight mb-6">
                Matcher Architecture &amp; Capabilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Perceptual Redmean Algorithm', desc: 'Accounts for human eye sensitivity to green wavelengths for accurate chromatic distance matching.' },
                  { title: 'Authentic Pantone Swatch Chips', desc: 'Visualizes the official Pantone paper chip aesthetic with PMS number, official title, and hex coordinates.' },
                  { title: 'Top Alternative Suggestions', desc: 'Presents the top closest alternative Pantone shades to provide flexible options for branding and print packaging.' },
                  { title: 'RGB & CMYK Formulas', desc: 'Generates cross-space print formulas so brand designers can bridge digital design and physical print workflows.' },
                  { title: 'Integrated Color Eyedropper', desc: 'Click to visually choose any color with your system color picker or type 3-character/6-character hex values.' },
                  { title: 'Client-Side Execution', desc: 'Calculates nearest vector distances directly in JavaScript with zero lag and zero network latency.' },
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

            {/* Popular Hex to Pantone Cross-Reference Table */}
            <div>
              <div className="max-w-3xl mb-6">
                <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                  Common Hex to Pantone Reference Table
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Standard digital brand colors matched against their certified Pantone PMS coated equivalents.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="py-3 px-4 font-bold">Color Description</th>
                      <th className="py-3 px-4 font-bold">Input Hex</th>
                      <th className="py-3 px-4 font-bold">Matched Pantone (PMS)</th>
                      <th className="py-3 px-4 font-bold">Pantone Hex</th>
                      <th className="py-3 px-4 font-bold">Similarity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-400">
                    {COMMON_PANTONE_PAIRS.map((row) => (
                      <tr key={row.hex} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{row.name}</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center gap-1.5 font-bold">
                            <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: row.hex }} />
                            {row.hex}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-orange-600 dark:text-[#00D2FF]">{row.pms}</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: row.pmsHex }} />
                            {row.pmsHex}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">{row.similarity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step-by-Step How-To */}
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight mb-6">
                How to Match a Hex Code to Pantone
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: 'Enter Hex Code', text: 'Type any 3 or 6-digit hex color code into the input field or click the eyedropper box to pick a color visually.' },
                  { step: '02', title: 'Compare Swatches', text: 'Instantly view your input color side-by-side with the matched official Pantone swatch and similarity percentage.' },
                  { step: '03', title: 'Export Coordinates', text: 'Copy the PMS color code, Pantone hex value, or full CMYK print breakdown to send to your printer or agency.' },
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
              Get notified when new designer color tools, developer compilers, and diagnostic utilities are released.
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
