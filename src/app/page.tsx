import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedToolsGrid } from '@/components/home/FeaturedToolsGrid';
import { LatestArticlesGrid } from '@/components/home/LatestArticlesGrid';
import { ValueSection } from '@/components/home/ValueSection';
import { Footer } from '@/components/home/Footer';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { fetchLiveLandingData } from '@/lib/data';

export const metadata: Metadata = {
  title: 'AIIsEverything — AI Tools, News & Guides For Everyone',
  description:
    'Discover the best AI tools, stay ahead with AI news, and master artificial intelligence with our free tutorials, guides, and glossary. Everything AI, in one place.',
  openGraph: {
    title: 'AIIsEverything — AI Tools, News & Guides For Everyone',
    description: 'The definitive resource hub for artificial intelligence tools, news, and guides.',
    url: 'https://aiiseverything.com',
    siteName: 'AIIsEverything',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIIsEverything — AI Tools, News & Guides For Everyone',
    description: 'Everything AI, in one place.',
  },
};

export const revalidate = 60; // On-demand ISR + 60s background refresh

export default async function HomePage() {
  const { tools, categories, posts, stats } = await fetchLiveLandingData();

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#00D2FF]/30 selection:text-slate-950 font-sans">
      {/* ── Fixed Navigation ── */}
      <Navbar />

      <main>
        {/* ── Hero Section (with Spline 3D Robot & Orbit Keywords) ── */}
        <Hero stats={stats} />

        {/* ── Dynamic Category Hubs Grid ── */}
        <CategoryGrid categories={categories} />

        {/* ── Live Database Featured Tools Grid ── */}
        <FeaturedToolsGrid tools={tools} />

        {/* ── Live Database Articles & Guides Grid ── */}
        <LatestArticlesGrid posts={posts} />

        {/* ── Architectural Value & Philosophy ── */}
        <ValueSection />

        {/* ── Newsletter Capture Section ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 border-t border-slate-200/80 px-6 py-24 sm:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#00D2FF]/15 to-indigo-500/10 blur-[130px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#0092c7]" />
              <span>Weekly AI Digest</span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              Get the Best AI Updates,{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-[#0092c7] bg-clip-text text-transparent">
                Weekly.
              </span>
            </h2>

            <p className="mt-4 mb-8 text-sm sm:text-base leading-relaxed text-slate-600">
              Join developers, designers, and AI practitioners getting a curated breakdown of the most impactful breakthroughs and newly launched tools.
            </p>

            <NewsletterForm />
          </div>
        </section>
      </main>

      {/* ── Semantic Site Footer ── */}
      <Footer />
    </div>
  );
}
