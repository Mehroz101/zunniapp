'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

// The exact interactive 3D robot model with mouse-cursor tracking
const SPLINE_SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

// Safe dynamic import for Spline runtime to prevent SSR canvas errors
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="w-full h-full flex flex-col items-center justify-center min-h-[460px] pointer-events-none select-none"
    >
      <div className="w-8 h-8 rounded-full border-2 border-[#00D2FF] border-t-transparent animate-spin opacity-80" />
      <span className="text-[11px] font-mono tracking-widest text-slate-400 mt-3 uppercase">
        Initializing 3D Robot Engine...
      </span>
    </div>
  ),
});

/* ==============================================================================
   STANDALONE 3D ROBOT CANVAS VIEWER
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
        canvas.style.contain = 'paint layout';
        canvas.style.touchAction = 'none';
      }
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[520px] sm:h-[620px] lg:h-[680px] select-none flex items-center justify-center bg-transparent ${className}`}
    >
      {isClient && (
        <div
          className={`w-full h-full relative z-10 flex items-center justify-center transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-95'
          }`}
        >
          <Spline
            scene={SPLINE_SCENE_URL}
            className="w-full h-full pointer-events-auto"
            onLoad={handleLoad}
          />
        </div>
      )}
    </div>
  );
}
