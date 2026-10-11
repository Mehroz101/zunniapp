import type { Metadata } from 'next';
import { Terminal } from 'lucide-react';
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
  title: 'AiTools Studio — Developer AI Operating System & Code Tools',
  description:
    'Sleek, zero-latency developer utilities, AST code converters, and AI diagnostics. Client-side WASM execution with zero telemetry logging.',
  openGraph: {
    title: 'AiTools Studio — Developer AI Operating System & Code Tools',
    description: 'Zero-latency developer utilities, AST code converters, and AI diagnostics.',
    url: 'https://aiisevery.vercel.app',
    siteName: 'AiTools Studio',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AiTools Studio — Developer AI Operating System & Code Tools',
    description: 'Zero-latency developer utilities, AST code converters, and AI diagnostics.',
  },
};

export const revalidate = 60; // On-demand ISR + 60s background refresh

export default async function HomePage() {
  const { categories, stats } = await fetchLiveLandingData();

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#00D2FF]/30 selection:text-slate-950 font-sans overflow-x-clip">
      {/* ── Fixed Floating Developer Pill Navbar ── */}
      <Navbar />

      <main className="relative">
        {/* ── 1. Hero Section (Wide Max-W-1440px, Far-Left Typography, Far-Right 3D Robot Aligned with H1) ── */}
        <Hero stats={stats} />

        {/* ── 2. Dedicated Standalone Orbit Section (Half-Screen Off-Screen Clipped) ── */}
        <OrbitKeywordSystem />

        {/* ── 3. Massive Developer Tools Directory & Showcase (Clean Light Cards) ── */}
        <DeveloperToolsShowcase />

        {/* ── 4. Specialized Developer Hub Domains ── */}
        <CategoryGrid categories={categories} />

        {/* ── 5. Engineering Architecture Foundation ── */}
        <ValueSection />

        {/* ── 6. Developer Newsletter Capture Section (Pure White Theme) ── */}
        <section className="relative overflow-hidden bg-slate-50/50 border-t border-slate-200/80 px-6 sm:px-8 lg:px-12 py-24 sm:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.06] blur-[140px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-mono text-[#0092c7] shadow-xs">
              <Terminal className="h-3.5 w-3.5" />
              <span>DEVELOPER TELEMETRY DISPATCH</span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              Engineering Dispatch,{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-[#0092c7] bg-clip-text text-transparent">
                Weekly.
              </span>
            </h2>

            <p className="mt-4 mb-8 text-sm sm:text-base leading-relaxed text-slate-600">
              Join senior engineers, frontend architects, and researchers receiving curated AST transpiler updates, model benchmarks, and open-source releases.
            </p>

            <NewsletterForm />
          </div>
        </section>

        {/* ── 7. Interactive Technical FAQs Accordion ── */}
        <FaqSection />
      </main>

      {/* ── 8. Semantic Clean White Developer Footer ── */}
      <Footer />
    </div>
  );
}
