import type { Metadata } from 'next';
import { Sparkles, Terminal } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Hero } from '@/components/home/Hero';
import { OrbitKeywordSystem } from '@/components/home/OrbitKeywordSystem';
import { DeveloperToolsShowcase } from '@/components/home/DeveloperToolsShowcase';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ValueSection } from '@/components/home/ValueSection';
import { FaqSection } from '@/components/home/FaqSection';
import { Footer } from '@/components/home/Footer';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { fetchLiveLandingData } from '@/lib/data';

export const metadata: Metadata = {
  title: 'AIIsEverything — Developer AI Operating System & Code Tools',
  description:
    'Sleek, zero-latency developer utilities, AST code converters, and AI diagnostics. Client-side WASM execution with zero telemetry logging.',
  openGraph: {
    title: 'AIIsEverything — Developer AI Operating System & Code Tools',
    description: 'Zero-latency developer utilities, AST code converters, and AI diagnostics.',
    url: 'https://aiiseverything.com',
    siteName: 'AIIsEverything',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIIsEverything — Developer AI Operating System & Code Tools',
    description: 'Zero-latency developer utilities, AST code converters, and AI diagnostics.',
  },
};

export const revalidate = 60; // On-demand ISR + 60s background refresh

export default async function HomePage() {
  const { categories, stats } = await fetchLiveLandingData();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-[#00D2FF]/30 selection:text-white font-sans overflow-x-clip">
      {/* ── Fixed Floating Developer Pill Navbar ── */}
      <Navbar />

      <main className="relative">
        {/* ── 1. Hero Section (Far-Left Typography, Far-Right 3D Robot Aligned with H1) ── */}
        <Hero stats={stats} />

        {/* ── 2. Dedicated Standalone Orbit Section (Half-Screen Off-Screen Clipped) ── */}
        <OrbitKeywordSystem />

        {/* ── 3. Massive Developer Tools Directory & Showcase (Clean Glassmorphism) ── */}
        <DeveloperToolsShowcase />

        {/* ── 4. Specialized Developer Hub Domains ── */}
        <CategoryGrid categories={categories} />

        {/* ── 5. Engineering Architecture Foundation ── */}
        <ValueSection />

        {/* ── 6. Developer Newsletter Capture Section (Deep Dark Luxury) ── */}
        <section className="relative overflow-hidden bg-[#05070d] border-t border-white/[0.06] px-4 sm:px-6 lg:px-10 py-24 sm:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00D2FF]/[0.05] blur-[150px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-mono text-[#00D2FF]">
              <Terminal className="h-3.5 w-3.5" />
              <span>DEVELOPER TELEMETRY DISPATCH</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Engineering Dispatch,{' '}
              <span className="bg-gradient-to-r from-[#00D2FF] via-[#38bdf8] to-indigo-400 bg-clip-text text-transparent">
                Weekly.
              </span>
            </h2>

            <p className="mt-4 mb-8 text-sm sm:text-base leading-relaxed text-slate-400">
              Join senior engineers, frontend architects, and researchers receiving curated AST transpiler updates, model benchmarks, and open-source releases.
            </p>

            <NewsletterForm />
          </div>
        </section>

        {/* ── 7. Interactive Technical FAQs Accordion ── */}
        <FaqSection />
      </main>

      {/* ── 8. Semantic Dark Luxury Developer Footer ── */}
      <Footer />
    </div>
  );
}
