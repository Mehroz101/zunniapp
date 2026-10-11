'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Cpu,
  Binary,
  Layers,
  Database,
  Terminal,
  Zap,
  Radio,
  Eye,
  FileCode2,
  Network,
  Sparkles,
  GitBranch,
} from 'lucide-react';
import Link from 'next/link';

// Modern AI & Data Science categories as directed
const innerOrbitItems = [
  { label: 'Neural Engine', color: '#00D2FF', icon: Cpu },
  { label: 'Data Pipeline', color: '#818cf8', icon: Database },
  { label: 'CSS-to-HTML', color: '#38bdf8', icon: Terminal },
  { label: 'HTML-to-Py', color: '#34d399', icon: Binary },
];

const middleOrbitItems = [
  { label: 'LLM Optimizer', color: '#a78bfa', icon: Sparkles },
  { label: 'Vector Search', color: '#f43f5e', icon: Network },
  { label: 'Speech Synthesis', color: '#fb923c', icon: Radio },
  { label: 'Vision AI', color: '#2dd4bf', icon: Eye },
  { label: 'WASM Runtime', color: '#facc15', icon: Zap },
  { label: 'Tensor Flow', color: '#f472b6', icon: Layers },
];

const outerOrbitItems = [
  { label: 'Embeddings', color: '#38bdf8', icon: FileCode2 },
  { label: 'Token Streamer', color: '#4ade80', icon: GitBranch },
  { label: 'AST Transcoder', color: '#c084fc', icon: Binary },
  { label: 'Prisma DDL', color: '#60a5fa', icon: Database },
  { label: 'Zero-Copy Cache', color: '#f87171', icon: Zap },
  { label: 'Quantized LLM', color: '#00D2FF', icon: Cpu },
  { label: 'Prompt Compiler', color: '#fbbf24', icon: Sparkles },
  { label: 'BPE Tokenizer', color: '#a3e635', icon: Network },
];

const orbitConfigs = [
  {
    id: 'inner',
    items: innerOrbitItems,
    radius: 190,
    cardSize: 48,
    duration: 50,
  },
  {
    id: 'middle',
    items: middleOrbitItems,
    radius: 300,
    cardSize: 52,
    duration: 75,
  },
  {
    id: 'outer',
    items: outerOrbitItems,
    radius: 420,
    cardSize: 54,
    duration: 110,
  },
];

export function OrbitKeywordSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<Array<Array<HTMLDivElement | null>>>([[], [], []]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ring 1 (Inner): Clockwise rotation
      if (ringRefs.current[0]) {
        gsap.to(ringRefs.current[0], {
          rotation: 360,
          duration: orbitConfigs[0].duration,
          ease: 'none',
          repeat: -1,
        });
      }

      // Ring 2 (Middle): Counter-clockwise rotation
      if (ringRefs.current[1]) {
        gsap.to(ringRefs.current[1], {
          rotation: -360,
          duration: orbitConfigs[1].duration,
          ease: 'none',
          repeat: -1,
        });
      }

      // Ring 3 (Outer): Clockwise rotation
      if (ringRefs.current[2]) {
        gsap.to(ringRefs.current[2], {
          rotation: 360,
          duration: orbitConfigs[2].duration,
          ease: 'none',
          repeat: -1,
        });
      }

      // Counter-rotate cards so text & icons always stay upright
      cardRefs.current.forEach((ringCards, ringIdx) => {
        const direction = ringIdx === 1 ? 360 : -360;
        const duration = orbitConfigs[ringIdx].duration;

        ringCards.forEach((cardEl) => {
          if (cardEl) {
            gsap.to(cardEl, {
              rotation: direction,
              duration: duration,
              ease: 'none',
              repeat: -1,
            });
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full py-28 bg-[#07090e] border-t border-white/[0.06] overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#00D2FF]/[0.05] blur-[160px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Side: Editorial & Technical Architecture Narrative */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-mono text-[#00D2FF] mb-5 self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
            <span>DISTRIBUTED NEURAL MESH</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Planetary Neural Matrix.{' '}
            <span className="bg-gradient-to-r from-[#00D2FF] via-[#38bdf8] to-indigo-400 bg-clip-text text-transparent">
              Unified Edge Execution.
            </span>
          </h2>

          <p className="mt-5 text-sm sm:text-base text-slate-400 leading-relaxed">
            Every tool in the suite is interconnected through our low-overhead AST compiler pipeline. Run token optimization, vector similarity checks, and syntax transpilation simultaneously within an isolated client environment.
          </p>

          <div className="mt-8 space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/20 mt-0.5">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Dynamic AST Compiler</div>
                <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Converts syntax trees on-the-fly with zero serialization bottlenecks.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-0.5">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Zero Telemetry Local Sandbox</div>
                <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  No payload is transmitted back to external servers or telemetry databases.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/ai-tools"
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#00D2FF] hover:text-[#38bdf8] transition-colors"
            >
              <span>Explore all ecosystem nodes</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Standalone Planetary Orbit strictly anchored to right edge with half-screen off-screen clipping */}
        <div className="lg:col-span-7 relative h-[680px] sm:h-[780px] flex items-center justify-end overflow-visible">
          <div
            ref={containerRef}
            className="absolute -right-36 sm:-right-48 lg:-right-64 top-1/2 -translate-y-1/2 w-[860px] h-[860px] flex items-center justify-center pointer-events-none select-none"
          >
            {/* Core Neural Generator Sphere */}
            <div className="relative z-20 flex items-center justify-center pointer-events-auto">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#00D2FF]/20 via-indigo-600/30 to-purple-600/40 border border-[#00D2FF]/40 shadow-[0_0_50px_rgba(0,210,255,0.4)] flex flex-col items-center justify-center backdrop-blur-xl">
                <div className="w-12 h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-[#00D2FF] animate-pulse" />
                </div>
                <span className="text-[9px] font-mono font-bold tracking-widest text-[#00D2FF] mt-1">
                  CORE
                </span>
              </div>
            </div>

            {/* Concentric Dashed Planetary Orbit Rings */}
            {orbitConfigs.map((orbit, orbitIdx) => {
              const angleStep = 360 / orbit.items.length;

              return (
                <div
                  key={orbit.id}
                  ref={(el) => {
                    ringRefs.current[orbitIdx] = el;
                  }}
                  className="absolute rounded-full border border-dashed pointer-events-none"
                  style={{
                    width: orbit.radius * 2,
                    height: orbit.radius * 2,
                    borderColor: 'rgba(0, 210, 255, 0.22)',
                    willChange: 'transform',
                  }}
                >
                  {/* Floating Keyword Cards on each ring */}
                  {orbit.items.map((item, itemIdx) => {
                    const rad = (angleStep * itemIdx * Math.PI) / 180;
                    const x = orbit.radius + orbit.radius * Math.cos(rad) - orbit.cardSize / 2;
                    const y = orbit.radius + orbit.radius * Math.sin(rad) - orbit.cardSize / 2;
                    const IconComponent = item.icon;

                    return (
                      <div
                        key={itemIdx}
                        ref={(el) => {
                          if (!cardRefs.current[orbitIdx]) cardRefs.current[orbitIdx] = [];
                          cardRefs.current[orbitIdx][itemIdx] = el;
                        }}
                        className="absolute pointer-events-auto group cursor-pointer"
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          width: `${orbit.cardSize}px`,
                          height: `${orbit.cardSize}px`,
                          willChange: 'transform',
                        }}
                        title={item.label}
                      >
                        <div
                          className="size-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-125 bg-[#0e1322]/90 border border-white/10 shadow-lg backdrop-blur-md group-hover:border-[#00D2FF]/60"
                          style={{
                            boxShadow: `0 8px 24px -4px ${item.color}35`,
                          }}
                        >
                          <IconComponent
                            className="w-4 h-4 transition-transform group-hover:scale-110"
                            style={{ color: item.color }}
                          />
                          <span className="text-[7.5px] font-mono font-medium text-slate-300 mt-0.5 max-w-[46px] text-center truncate leading-tight group-hover:text-white">
                            {item.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
