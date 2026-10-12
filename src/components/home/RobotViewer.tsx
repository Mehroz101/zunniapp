'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

const SPLINE_SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

/* ==============================================================================
   HIGH-END FUTURISTIC ROBOT SKELETON (INSTANT ZERO-BLANK-SPACE FALLBACK)
   ============================================================================== */
function RobotSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none select-none z-0"
    >
      {/* Blueprint Card Frame with Subtle Neon-Cyan Glow */}
      <div className="relative w-[340px] sm:w-[420px] md:w-[460px] h-[460px] sm:h-[540px] rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-slate-50/70 via-white/40 to-slate-100/60 dark:from-slate-900/90 dark:via-slate-950/80 dark:to-slate-900/90 shadow-xl backdrop-blur-md overflow-hidden flex flex-col items-center justify-between p-6 sm:p-8">
        {/* Animated Scanner Laser Sweep */}
        <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#00D2FF]/15 to-transparent pointer-events-none animate-scanner-sweep" />

        {/* Top Telemetry Header */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00D2FF] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00D2FF]" />
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 tracking-wider">NEURAL_IK // KERNEL 2.4</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/80 text-[#0092c7] dark:text-[#00D2FF] border border-cyan-200/70 dark:border-cyan-800/80 font-bold">
            PRELOADED
          </span>
        </div>

        {/* Center Geometric Wireframe Robot Silhouette */}
        <div className="relative flex flex-col items-center justify-center my-auto">
          {/* Wireframe Head & Visor Lockup */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-900/5 dark:bg-slate-800/40">
            {/* Inner Core Glowing Orb */}
            <div className="w-16 h-16 rounded-full border border-[#00D2FF]/60 flex items-center justify-center bg-cyan-50/50 dark:bg-cyan-950/60 shadow-[0_0_25px_rgba(0,210,255,0.25)] animate-pulse">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00D2FF] to-indigo-600 shadow-md shadow-cyan-500/40" />
            </div>

            {/* Micro Corner Syntax Brackets */}
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00D2FF]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#00D2FF]" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#00D2FF]" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#00D2FF]" />
          </div>

          {/* Wireframe Torso & Arms Horizon Lines */}
          <div className="mt-4 flex items-center gap-3">
            <span className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
              SYNAPSE RIG ACTIVE
            </span>
            <span className="w-12 sm:w-16 h-0.5 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700" />
          </div>
        </div>

        {/* Bottom Loading Telemetry & Frame Indicator */}
        <div className="w-full text-center border-t border-slate-200/60 dark:border-slate-800 pt-3">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#0092c7] dark:border-[#00D2FF] border-t-transparent animate-spin" />
            <span>HYDRATING 3D SHADERS · 60 FPS PIPELINE</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1">
            WASM RENDERER // HARDWARE ACCELERATED
          </div>
        </div>
      </div>
    </div>
  );
}

// Next.js dynamic import with lightweight futuristic skeleton
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <RobotSkeleton />,
});

/* ==============================================================================
   STANDALONE 3D ROBOT CANVAS VIEWER (UNCLIPPED, FAR-RIGHT PINNED, ZERO JANK)
   ============================================================================== */
export function Robot3DViewer({ className = '' }: { className?: string }) {
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const splineAppRef = useRef<unknown>(null);

  // Eager prefetching and client mount
  useEffect(() => {
    setIsClient(true);

    if (typeof window !== 'undefined' && 'fetch' in window) {
      try {
        fetch(SPLINE_SCENE_URL, {
          mode: 'cors',
          credentials: 'omit',
          priority: 'high',
        }).catch(() => {});
      } catch (_) {}
    }
  }, []);

  // WebGL Canvas GPU acceleration & scroll jitter elimination
  const handleLoad = useCallback((splineApp: unknown) => {
    splineAppRef.current = splineApp;
    setIsLoaded(true);

    if (containerRef.current) {
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas) {
        // Enforce GPU hardware acceleration compositing layer
        canvas.style.willChange = 'transform';
        canvas.style.transform = 'translate3d(0, 0, 0)';
        canvas.style.backfaceVisibility = 'hidden';
        // CRITICAL SCROLL FIX: touchAction pan-y lets the window scroll freely without canvas lag
        canvas.style.touchAction = 'pan-y';
        canvas.style.overflow = 'visible';
        canvas.style.contain = 'none';
        canvas.style.userSelect = 'none';
      }
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        touchAction: 'pan-y',
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
      }}
      className={`relative w-full min-w-[650px] sm:min-w-[700px] xl:min-w-[780px] h-[650px] sm:h-[740px] lg:h-[800px] select-none flex items-start justify-end ml-auto overflow-visible pointer-events-auto gpu-composited ${className}`}
    >
      {/* Targeted Ambient Falloff strictly behind canvas (Zero Hard Pixels) */}
      <div
        className="pointer-events-none absolute top-4 right-10 w-[520px] h-[520px] rounded-full blur-[130px] opacity-25 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 210, 255, 0.18) 0%, rgba(99, 102, 241, 0.06) 50%, rgba(255, 255, 255, 0) 70%)',
        }}
      />

      {/* Render Skeleton until WebGL canvas is fully initialized */}
      {!isLoaded && <RobotSkeleton />}

      {/* Spline Canvas Container with smooth fade-in */}
      {isClient && (
        <div
          className={`w-full h-full relative z-10 flex items-start justify-end transition-opacity duration-700 ease-out overflow-visible ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ touchAction: 'pan-y' }}
        >
          <Spline
            scene={SPLINE_SCENE_URL}
            className="w-full h-full pointer-events-auto overflow-visible"
            onLoad={handleLoad}
          />
        </div>
      )}
    </div>
  );
}
