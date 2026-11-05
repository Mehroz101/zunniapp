import type { Metadata } from 'next';
import { Terminal } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Hero } from '@/components/home/Hero';
import { DeveloperToolsShowcase } from '@/components/home/DeveloperToolsShowcase';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ValueSection } from '@/components/home/ValueSection';
import { FaqSection } from '@/components/home/FaqSection';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { Footer } from '@/components/home/Footer';
import { fetchLiveLandingData } from '@/lib/data';

export const metadata: Metadata = {
  title: 'TOOLty — Free Online Tools & Calculators Directory',
  description:
    'TOOLty is your free online utility workbench. Explore 100% free developer utilities, financial calculators, unit converters, and online tools.',
  openGraph: {
    title: 'TOOLty — Free Online Tools & Calculators Directory',
    description: 'Explore 100% free developer utilities, financial calculators, unit converters, and online tools.',
    url: 'https://toolty.online',
    siteName: 'TOOLty',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TOOLty — Free Online Tools & Calculators Directory',
    description: 'Explore 100% free developer utilities, financial calculators, unit converters, and online tools.',
  },
};

// ISR: Cache statically with background revalidation (eliminates 600ms database render-blocking delay)
export const revalidate = 300;

export default async function HomePage() {
  const { categories, stats } = await fetchLiveLandingData();

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 selection:bg-[#FF8A00]/30 selection:text-slate-950 font-sans overflow-x-clip transition-colors duration-200">
      {/* 🚀 Fixed Floating Developer Pill Navbar 🚀 */}
      <Navbar />

      <main className="relative">
        {/* 🚀 1. Enterprise Directory Hero Section with Global Search Bench 🚀 */}
        <Hero stats={stats} />

        {/* 🚀 2. Massive Developer Tools Directory & Showcase (Full SSR, 0 CLS) 🚀 */}
        <DeveloperToolsShowcase />

        {/* 🚀 3. Specialized Developer Hub Domains 🚀 */}
        <CategoryGrid categories={categories} />

        {/* 🚀 4. Engineering Architecture Foundation 🚀 */}
        <ValueSection />

        {/* 🚀 5. Developer Newsletter Capture Section 🚀 */}
        <section className="relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 lg:px-12 py-16 sm:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.06] blur-[140px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1 text-xs font-mono text-orange-600 dark:text-[#FF8A00] shadow-xs">
              <Terminal className="h-3.5 w-3.5" />
              <span>DEVELOPER TELEMETRY DISPATCH</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-slate-900 dark:text-slate-50">
              Engineering Dispatch,{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
                Weekly.
              </span>
            </h2>

            <p className="mt-3 mb-8 text-slate-600 dark:text-slate-300 font-normal leading-relaxed text-[15px] sm:text-base">
              Join senior engineers, frontend architects, and researchers receiving curated AST transpiler updates, model benchmarks, and open-source releases.
            </p>

            <NewsletterForm />
          </div>
        </section>

        {/* 🚀 6. Interactive Technical FAQs Accordion (Full SSR for Rich Snippets & 0 CLS) 🚀 */}
        <FaqSection />
      </main>

      {/* 🚀 7. Semantic Clean White Developer Footer 🚀 */}
      <Footer />
    </div>
  );
}
