'use client';

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
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-sans text-[16px] sm:text-[17px] font-black tracking-tight text-slate-900 dark:text-white transition-colors">
            AiTools<span className="text-[#FF8A00]">.</span>
          </span>
          <span className="text-[9.5px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-md bg-orange-500/10 dark:bg-orange-500/15 text-[#FF8A00] border border-orange-500/20">
            STUDIO
          </span>
        </div>
      )}
    </div>
  );
}

// Backward-compatible alias for existing imports
export const AiLogo = BrandLogo;
export default BrandLogo;
