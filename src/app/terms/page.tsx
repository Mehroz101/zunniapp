import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { getCanonicalSiteUrl } from '@/lib/seo';

const siteUrl = getCanonicalSiteUrl();

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of service governing the use of TOOLty free online developer utilities, calculators, and technical documentation.',
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  openGraph: {
    title: 'Terms of Service | TOOLty',
    description:
      'Terms of service governing the use of TOOLty free online developer utilities, calculators, and technical publications.',
    url: `${siteUrl}/terms`,
    siteName: 'TOOLty',
    type: 'website',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400"
        >
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-slate-900 dark:text-white font-semibold">Terms of Service</span>
        </nav>

        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-mono font-semibold text-orange-600 dark:text-[#FF8A00] mb-4">
          <FileText className="h-3.5 w-3.5" />
          <span>PLATFORM TERMS &amp; USAGE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mb-10">
          Last updated: November 25, 2026
        </p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              1. Acceptable Use
            </h2>
            <p>
              TOOLty provides free online developer tools, format converters, calculators, and technical articles for lawful educational, engineering, and informational workflows. Automated scraping, abusive traffic bursts, or attempts to compromise site availability are prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              2. Informational Disclaimer
            </h2>
            <p>
              All tools, financial calculators, and editorial publications are provided &ldquo;as is&rdquo; without warranty of any kind. Financial, tax, engineering, and medical outputs are estimates and should be independently verified before making high-stakes decisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              3. Intellectual Property &amp; Contact
            </h2>
            <p>
              The TOOLty brand, interface, and original documentation remain the property of TOOLty. For questions or feedback, reach out to{' '}
              <a href="mailto:contact@toolty.online" className="text-[#FF8A00] hover:underline">
                contact@toolty.online
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
