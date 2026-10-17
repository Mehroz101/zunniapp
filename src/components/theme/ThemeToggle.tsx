'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch during initial SSR render
  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-2xs ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer shadow-2xs select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A00] ${
        isDark
          ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-amber-300 ring-1 ring-orange-500/20 shadow-[0_0_15px_rgba(255,138,0,0.15)]'
          : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700 hover:text-slate-950'
      } ${className}`}
    >
      {/* Icon Rotational & Opacity Morphing Wrapper */}
      <span className="relative flex items-center justify-center w-5 h-5 overflow-hidden">
        {/* Sun Icon: Visible in Dark Mode, prompting switch back to Light Mode */}
        <Sun
          className={`w-4 h-4 transition-all duration-300 ease-out transform ${
            isDark
              ? 'rotate-0 scale-100 opacity-100 text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.5)]'
              : '-rotate-90 scale-0 opacity-0 absolute'
          }`}
        />

        {/* Moon Icon: Visible in Light Mode, prompting switch to Dark Mode */}
        <Moon
          className={`w-4 h-4 transition-all duration-300 ease-out transform ${
            !isDark
              ? 'rotate-0 scale-100 opacity-100 text-slate-700'
              : 'rotate-90 scale-0 opacity-0 absolute'
          }`}
        />
      </span>
    </button>
  );
}
