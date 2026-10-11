import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import type { LivePlatformStats } from '@/lib/data';
import { OrbitKeywordSystem } from './OrbitKeywordSystem';

interface HeroProps {
  stats: LivePlatformStats;
}

export function Hero({ stats }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
      {/* ── Soft Ambient Radial Lights (HeyGen Aesthetic) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[640px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#00D2FF]/12 via-indigo-500/8 to-transparent blur-[140px]" />
        <div className="absolute top-1/4 right-0 h-[480px] w-[480px] rounded-full bg-violet-400/8 blur-[120px]" />
        <div className="absolute bottom-0 left-10 h-[360px] w-[360px] rounded-full bg-cyan-400/8 blur-[100px]" />
      </div>

      {/* ── Ultra-Subtle Dot Matrix Texture ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #09090b 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ── Left Column: High-Impact Typography & Action ── */}
          <div className="lg:col-span-7 xl:col-span-6">
            {/* Top Credibility Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white/90 px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-xs backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00D2FF] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00D2FF]" />
              </span>
              <span className="text-slate-900">The AI Operating System for Everyone</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#0092c7] font-bold">50+ Tools Online</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl xl:text-7xl leading-[1.05]">
              AI Is{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-[#0092c7] bg-clip-text text-transparent">
                Everywhere.
              </span>
              <br />
              Master It{' '}
              <span className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
                Here.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl">
              Explore 50+ curated zero-latency AI tools, breaking research, actionable workflows, and interactive guides. Built for humans navigating an AI-first future.
            </p>

            {/* 4 Feature Checklist Items */}
            <div className="mt-8 grid grid-cols-2 gap-3 max-w-lg">
              {[
                { label: '100% Free Tools', desc: 'No paywalls or credits' },
                { label: 'Zero Latency Engine', desc: 'Instant browser execution' },
                { label: 'Verified Workflows', desc: 'Step-by-step blueprints' },
                { label: 'Daily Intelligence', desc: 'Curated breakthroughs' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5 text-xs">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                    ✓
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">{item.label}</div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/ai-tools"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition-all duration-200 hover:bg-slate-800 hover:shadow-xl active:scale-[0.98]"
              >
                <span>Explore Free AI Tools</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 text-[#00D2FF]" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-800 shadow-xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
              >
                <BookOpen className="h-4 w-4 text-indigo-600" />
                <span>Read AI News & Guides</span>
              </Link>
            </div>

            {/* Metrics Strip from Real Database */}
            <div className="mt-12 grid grid-cols-4 gap-3 border-t border-slate-100 pt-8 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                  {stats.toolsCount > 0 ? `${stats.toolsCount}+` : '50+'}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">Live Tools</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                  {stats.articlesCount > 0 ? `${stats.articlesCount}+` : '100+'}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">Articles</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                  {stats.categoriesCount > 0 ? `${stats.categoriesCount}` : '6'}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">Hubs</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                  100%
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">Free Access</div>
              </div>
            </div>
          </div>

          {/* ── Right Column: 3D Robot & Orbit Keyword System ── */}
          <div className="lg:col-span-5 xl:col-span-6 flex items-center justify-center relative">
            <OrbitKeywordSystem />
          </div>
        </div>
      </div>
    </section>
  );
}
