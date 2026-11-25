import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { getCanonicalSiteUrl } from '@/lib/seo';

const siteUrl = getCanonicalSiteUrl();

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how TOOLty handles browser-native utilities, zero-telemetry tool execution, analytics, and newsletter subscriptions.',
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
  openGraph: {
    title: 'Privacy Policy | TOOLty',
    description:
      'Learn how TOOLty handles browser-native utilities, zero-telemetry tool execution, and privacy protections.',
    url: `${siteUrl}/privacy`,
    siteName: 'TOOLty',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
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
          <span className="text-slate-900 dark:text-white font-semibold">Privacy Policy</span>
        </nav>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>ZERO-TELEMETRY ARCHITECTURE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mb-10">
          Last updated: November 25, 2026
        </p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              1. Local Browser Tool Execution
            </h2>
            <p>
              Core developer utilities, converters, calculators, and decoders on TOOLty run directly inside your web browser whenever possible. Input payloads such as JSON, JWT tokens, hexadecimal bytes, code snippets, or calculator figures are processed locally without storing your inputs on external servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              2. Analytics &amp; Performance Measurement
            </h2>
            <p>
              We use privacy-conscious web analytics (including Google Analytics / Google Tag Manager) to measure aggregate traffic, page performance, and popular tool categories so we can improve site reliability and usefulness. We do not sell personal data to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              3. Newsletter &amp; Contact Information
            </h2>
            <p>
              If you voluntarily subscribe to TOOLty updates or email{' '}
              <a href="mailto:contact@toolty.online" className="text-[#FF8A00] hover:underline">
                contact@toolty.online
              </a>
              , your email address is used solely to deliver requested dispatches or reply to support inquiries. You can request removal at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              4. Cookies &amp; Preferences
            </h2>
            <p>
              Essential local storage and preference cookies may be used to remember your theme mode (light/dark) and interface settings across visits.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
