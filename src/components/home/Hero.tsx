import Link from 'next/link';
import { ArrowRight, Terminal, Cpu, Shield, Zap } from 'lucide-react';
import type { LivePlatformStats } from '@/lib/data';
import { Robot3DViewer } from './RobotViewer';

interface HeroProps {
  stats?: LivePlatformStats;
}

export function Hero({ stats }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center bg-white pt-36 sm:pt-40 lg:pt-44 pb-20 lg:pb-28 overflow-x-clip">
      <div className="relative z-10 mx-auto max-w-[1440px] w-full px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24 justify-between">
          {/* ── Left Column: High-Impact Typography Firmly on Far-Left ── */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-start pt-2 sm:pt-4 z-20">
            {/* Top Minimalist Credibility Pill Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white px-4 py-1.5 text-xs font-mono text-slate-700 shadow-xs backdrop-blur-md self-start">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0092c7] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0092c7]" />
              </span>
              <span className="text-slate-900 font-semibold">NEURAL KERNEL 2.4 ONLINE</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#0092c7] font-medium">ZERO-LATENCY WASM</span>
            </div>

            {/* Headline with Deep Slate/Black Typography */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-[68px] font-black tracking-[-0.04em] text-slate-950 leading-[1.05]">
              AI Operating System{' '}
              <span className="text-slate-900">
                for Builders.
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-[#0092c7] bg-clip-text text-transparent">
                Zero Latency.
              </span>{' '}
              Pure Code.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl font-normal">
              High-precision AST code transcoders, prompt token optimizers, neural diagnostics, and developer utilities. Executed entirely inside your browser sandbox with zero telemetry.
            </p>

            {/* 4 Clean Minimalist Engineering Checkpoints */}
            <div className="mt-8 grid grid-cols-2 gap-3.5 max-w-lg">
              {[
                { label: 'Client-Side WASM', desc: 'No network bottlenecks' },
                { label: 'Zero Data Retention', desc: 'Private local sandbox' },
                { label: 'AST-Level Accuracy', desc: 'Deterministic code output' },
                { label: 'Open Tool Protocol', desc: 'Extendable JSON schemas' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5 text-xs">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-emerald-50 text-emerald-700 font-mono text-[10px] border border-emerald-200">
                    ✓
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{item.label}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/ai-tools"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white shadow-md shadow-slate-950/15 transition-all duration-200 hover:bg-slate-800 active:scale-[0.98]"
              >
                <span>Launch Developer Studio</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 text-[#00D2FF]" />
              </Link>
              <Link
                href="/ai-tools/coding"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-800 shadow-xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
              >
                <Terminal className="h-4 w-4 text-[#0092c7]" />
                <span>Code Converters</span>
              </Link>
            </div>

            {/* High-Impact Engineering Metrics Strip (Deep Slate) */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/90 pt-8 max-w-xl">
              <div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-slate-950 tracking-tight">
                  &lt; 1.2ms
                </div>
                <div className="text-[11px] text-slate-500 mt-1 uppercase font-mono tracking-wider">
                  Compilation
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#0092c7] tracking-tight">
                  0 B
                </div>
                <div className="text-[11px] text-slate-500 mt-1 uppercase font-mono tracking-wider">
                  Server Logs
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-slate-950 tracking-tight">
                  WASM v2
                </div>
                <div className="text-[11px] text-slate-500 mt-1 uppercase font-mono tracking-wider">
                  Core Engine
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-600 tracking-tight">
                  100%
                </div>
                <div className="text-[11px] text-slate-500 mt-1 uppercase font-mono tracking-wider">
                  Open Utilities
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: 3D Robot Positioned firmly on Far-Right, Level with H1 and Status Pill ── */}
          <div className="lg:col-span-6 xl:col-span-7 flex items-start justify-end relative overflow-visible -mt-4 sm:-mt-8 lg:-mt-16 xl:-mt-22 lg:-mr-8 xl:-mr-16 z-10">
            <Robot3DViewer className="overflow-visible" />
          </div>
        </div>
      </div>
    </section>
  );
}
