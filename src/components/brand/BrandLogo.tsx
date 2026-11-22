'use client';

import { SantaHat } from '@/components/effects/SantaHat';

interface BrandLogoProps {
  className?: string;
  markOnly?: boolean;
  size?: number;
}

export function BrandLogo({ className = '', markOnly = false, size = 26 }: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none group cursor-pointer ${className}`}>
      {/* Precision Geometric Vector Mark (Scales 16px to 256px) */}
      <div className="relative flex items-center justify-center shrink-0">
        {/* Playful Santa Hat perched on top of the brand icon */}
        <span className="pointer-events-none absolute -left-2.5 -top-3.5 z-20 -rotate-12 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
          <SantaHat className="h-6 w-6 drop-shadow-md" />
        </span>
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200 group-hover:scale-105"
        >
          {/* Architectural Rounded Rhombus Frame */}
          <rect
            x="3"
            y="3"
            width="26"
            height="26"
            rx="7"
            stroke="currentColor"
            strokeWidth="2.2"
            className="text-slate-900 dark:text-white transition-colors"
          />
          {/* Sharp Geometric Monogram Apex (A) */}
          <path
            d="M10 21.5L16 9.5L22 21.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-900 dark:text-white transition-colors"
          />
          {/* Signature Studio Crossbar (T) in light orange */}
          <path
            d="M12.5 17.5H19.5"
            stroke="#FF8A00"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Studio Vertex Spark */}
          <circle cx="16" cy="9.5" r="1.5" fill="#FF8A00" />
        </svg>
      </div>

      {!markOnly && (
        <div className="flex items-center gap-1 leading-none select-none">
          <span className="font-sans text-[20px] sm:text-[22px] font-black tracking-[-0.03em] text-slate-900 dark:text-white transition-colors flex items-center">
            <span className="font-black text-slate-900 dark:text-white">TOOL</span>
            <span className="bg-gradient-to-tr from-[#FF8A00] via-[#FFA229] to-[#FF5500] bg-clip-text text-transparent font-black drop-shadow-[0_2px_8px_rgba(255,138,0,0.35)]">
              ty
            </span>
          </span>
          <span className="ml-1.5 inline-block text-[10px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/40 px-1.5 py-0.5 rounded-full leading-none shadow-2xs">
            🎅 2026 End
          </span>
        </div>
      )}
    </div>
  );
}

// Backward-compatible alias for existing imports
export const AiLogo = BrandLogo;
export default BrandLogo;
