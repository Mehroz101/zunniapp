import Link from 'next/link';
import { ArrowRight, Terminal, Cpu, Shield, Zap, Sparkles } from 'lucide-react';
import type { LivePlatformStats } from '@/lib/data';
import { Robot3DViewer } from './RobotViewer';

interface HeroProps {
  stats?: LivePlatformStats;
}

export function Hero({ stats }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center bg-[#07090e] pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-x-clip">
      {/* ── Subtle Background Gradients & Tech Grid ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[550px] w-[550px] rounded-full bg-[#00D2FF]/[0.07] blur-[150px]" />
        <div className="absolute top-1/3 right-10 h-[600px] w-[600px] rounded-full bg-indigo-500/[0.08] blur-[160px]" />
      </div>

      {/* Modern Hairline Dot Matrix Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8 justify-between">
          {/* ── Left Column: High-Impact Typography & Developer Engine Callouts (Far-Left) ── */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center pt-2 sm:pt-6">
            {/* Top Minimalist Hairline Pill Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-mono text-slate-300 backdrop-blur-md self-start">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00D2FF] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00D2FF]" />
              </span>
              <span className="text-white font-medium">NEURAL KERNEL 2.4 ONLINE</span>
              <span className="text-white/20">/</span>
              <span className="text-[#00D2FF]">ZERO-LATENCY WASM</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl xl:text-[72px] leading-[1.05]">
              AI Operating System{' '}
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                for Builders.
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00D2FF] via-[#38bdf8] to-indigo-400 bg-clip-text text-transparent">
                Zero Latency.
              </span>{' '}
              Pure Code.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-400 max-w-xl font-normal">
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
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-[#00D2FF]/10 text-[#00D2FF] font-mono text-[10px] border border-[#00D2FF]/30">
                    ✓
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{item.label}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/ai-tools"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#00D2FF] px-8 py-4 text-sm font-semibold text-black shadow-[0_0_30px_rgba(0,210,255,0.35)] transition-all duration-200 hover:bg-[#38bdf8] hover:shadow-[0_0_40px_rgba(0,210,255,0.5)] active:scale-[0.98]"
              >
                <span>Launch Developer Studio</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/ai-tools/coding"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-7 py-4 text-sm font-semibold text-slate-200 backdrop-blur-md transition hover:bg-white/[0.07] hover:border-white/20 active:scale-[0.98]"
              >
                <Terminal className="h-4 w-4 text-[#00D2FF]" />
                <span>Code Converters</span>
              </Link>
            </div>

            {/* Refactored High-Impact Engineering Metrics Strip */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/[0.08] pt-8 max-w-xl">
              <div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
                  &lt; 1.2ms
                </div>
                <div className="text-[11px] text-slate-400 mt-1 uppercase font-mono tracking-wider">
                  Compilation
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#00D2FF] tracking-tight">
                  0 B
                </div>
                <div className="text-[11px] text-slate-400 mt-1 uppercase font-mono tracking-wider">
                  Server Logs
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
                  WASM v2
                </div>
                <div className="text-[11px] text-slate-400 mt-1 uppercase font-mono tracking-wider">
                  Core Engine
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 tracking-tight">
                  100%
                </div>
                <div className="text-[11px] text-slate-400 mt-1 uppercase font-mono tracking-wider">
                  Open Utilities
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: 3D Robot Positioned firmly to the Far-Right, Level with H1 ── */}
          <div className="lg:col-span-5 xl:col-span-6 flex items-start justify-end relative overflow-visible">
            <Robot3DViewer className="max-w-none w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
