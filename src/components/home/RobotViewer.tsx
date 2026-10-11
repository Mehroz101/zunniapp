'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

// The interactive 3D robot model with mouse-cursor tracking
const SPLINE_SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

// Safe dynamic import for Spline runtime to prevent SSR canvas errors
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="w-full h-full flex flex-col items-center justify-center min-h-[500px] pointer-events-none select-none"
    >
      <div className="w-8 h-8 rounded-full border-2 border-[#0092c7] border-t-transparent animate-spin opacity-80" />
      <span className="text-[11px] font-mono tracking-widest text-slate-400 mt-3 uppercase">
        Initializing 3D Robot Engine...
      </span>
    </div>
  ),
});

/* ==============================================================================
   STANDALONE 3D ROBOT CANVAS VIEWER (UNCLIPPED WITH FULL ARM-SPAN FREEDOM)
   ============================================================================== */
export function Robot3DViewer({ className = '' }: { className?: string }) {
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const splineAppRef = useRef<unknown>(null);

  // Eager client initialization + browser cache prefetching
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

  // WebGL Canvas optimization callback when Spline finishes initializing
  const handleLoad = useCallback((splineApp: unknown) => {
    splineAppRef.current = splineApp;
    setIsLoaded(true);

    if (containerRef.current) {
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas) {
        canvas.style.willChange = 'transform';
        canvas.style.touchAction = 'none';
        canvas.style.overflow = 'visible';
        // Remove any paint layout containment that clips arm animations
        canvas.style.contain = 'none';
      }
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-w-[650px] sm:min-w-[700px] xl:min-w-[760px] h-[650px] sm:h-[740px] lg:h-[800px] select-none flex items-start justify-center overflow-visible pointer-events-auto ${className}`}
    >
      {/* Targeted Robot Ambient Falloff strictly behind canvas (Zero Hard Pixels) */}
      <div
        className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.15) 0%, rgba(99, 102, 241, 0.05) 50%, rgba(255, 255, 255, 0) 70%)',
        }}
      />

      {isClient && (
        <div
          className={`w-full h-full relative z-10 flex items-start justify-center transition-opacity duration-300 overflow-visible ${
            isLoaded ? 'opacity-100' : 'opacity-90'
          }`}
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
