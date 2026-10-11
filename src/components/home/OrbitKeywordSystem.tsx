'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Brain,
  Sparkles,
  Cpu,
  Code2,
  Database,
  Layers,
  Zap,
  Bot,
  Eye,
  Radio,
  FileCode,
  Network,
} from 'lucide-react';
import { Robot3DViewer } from './RobotViewer';

const innerOrbitItems = [
  { label: 'Generative AI', color: '#0092c7', icon: Sparkles },
  { label: 'Large Language Models', color: '#8b5cf6', icon: Brain },
  { label: 'Neural Networks', color: '#ec4899', icon: Network },
  { label: 'Data Science', color: '#10b981', icon: Database },
];

const middleOrbitItems = [
  { label: 'Machine Learning', color: '#f59e0b', icon: Cpu },
  { label: 'Computer Vision', color: '#0284c7', icon: Eye },
  { label: 'Autonomous Agents', color: '#6366f1', icon: Bot },
  { label: 'Prompt Engineering', color: '#14b8a6', icon: Zap },
  { label: 'Deep Learning', color: '#a855f7', icon: Layers },
  { label: 'Code Generation', color: '#eab308', icon: Code2 },
];

const outerOrbitItems = [
  { label: 'NLP Models', color: '#f43f5e', icon: Brain },
  { label: 'Diffusion Models', color: '#0ea5e9', icon: Sparkles },
  { label: 'Vector Databases', color: '#84cc16', icon: Database },
  { label: 'Speech AI', color: '#f97316', icon: Radio },
  { label: 'Transformers', color: '#8b5cf6', icon: Network },
  { label: 'Embeddings', color: '#10b981', icon: FileCode },
  { label: 'RLHF Tuning', color: '#00D2FF', icon: Cpu },
  { label: 'AI Workflows', color: '#ec4899', icon: Zap },
];

const orbitConfigs = [
  {
    id: 'inner',
    items: innerOrbitItems,
    radius: 175,
    cardSize: 48,
    duration: 52,
  },
  {
    id: 'middle',
    items: middleOrbitItems,
    radius: 265,
    cardSize: 52,
    duration: 76,
  },
  {
    id: 'outer',
    items: outerOrbitItems,
    radius: 365,
    cardSize: 54,
    duration: 108,
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

      // Counter-rotate cards so text & icons always stay perfectly upright
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
    <div
      ref={containerRef}
      className="relative w-full h-[540px] sm:h-[620px] lg:h-[680px] flex items-center justify-center select-none"
    >
      {/* ── Soft Ambient Radial Cyan / Azure Glow ── */}
      <div
        className="pointer-events-none absolute inset-0 -m-10 rounded-full blur-[100px] opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.35) 0%, rgba(99, 102, 241, 0.15) 45%, transparent 70%)',
        }}
      />

      {/* ── Orbit Planetary Master System ── */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: '780px',
          height: '780px',
        }}
      >
        {/* Central Core: Real-time 3D Robot that tracks cursor natively */}
        <div className="relative z-30 flex items-center justify-center pointer-events-auto">
          <Robot3DViewer className="w-[380px] h-[480px] sm:w-[440px] sm:h-[540px]" />
        </div>

        {/* ── 3 Concentric Dashed Planetary Orbit Rings ── */}
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
                borderColor: 'rgba(0, 210, 255, 0.28)',
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
                      className="size-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-125 bg-white/95 border border-slate-200/90 shadow-md backdrop-blur-md"
                      style={{
                        boxShadow: `0 8px 20px -4px ${item.color}30`,
                      }}
                    >
                      <IconComponent
                        className="w-4 h-4 transition-transform group-hover:scale-110"
                        style={{ color: item.color }}
                      />
                      <span className="text-[7.5px] font-black text-slate-800 mt-0.5 max-w-[44px] text-center truncate leading-tight">
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
  );
}
