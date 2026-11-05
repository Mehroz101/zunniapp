'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Command } from 'lucide-react';
import { SEARCH_TOOLS, type SearchToolItem } from '@/lib/tools/searchCatalog';

export function HeroSearchConsole() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Search input and state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Filter tools based on search query using lightweight search index
  const filteredTools = useMemo<SearchToolItem[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_TOOLS
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q) ||
          t.categoryName.toLowerCase().includes(q) ||
          t.seoKeywords.some((k) => k.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [searchQuery]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Search Submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (filteredTools.length > 0 && selectedIndex >= 0 && selectedIndex < filteredTools.length) {
      router.push(`/tools/${filteredTools[selectedIndex].slug}`);
      setIsFocused(false);
      return;
    }
    if (filteredTools.length > 0) {
      router.push(`/tools/${filteredTools[0].slug}`);
      setIsFocused(false);
      return;
    }
    if (searchQuery.trim()) {
      router.push(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsFocused(false);
    } else {
      router.push('/tools');
    }
  };

  return (
    <div className="mt-6 sm:mt-9 w-full max-w-2xl mx-auto relative z-30 h-[54px] sm:h-[58px]">
      <form
        onSubmit={handleSearchSubmit}
        className={`relative flex items-center rounded-2xl border transition-all duration-200 shadow-lg h-[54px] sm:h-[58px] ${
          isFocused
            ? 'border-orange-500/80 dark:border-[#FF8A00]/80 ring-4 ring-orange-500/10 dark:ring-[#FF8A00]/10 bg-white dark:bg-slate-900 shadow-orange-500/10'
            : 'border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-slate-200/50 dark:shadow-black/40'
        }`}
      >
        <div className="pl-4 sm:pl-5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 shrink-0">
          <Search className="h-5 w-5" />
        </div>

        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSelectedIndex((prev) => Math.min(prev + 1, filteredTools.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSelectedIndex((prev) => Math.max(prev - 1, -1));
            } else if (e.key === 'Enter') {
              if (selectedIndex >= 0 && selectedIndex < filteredTools.length) {
                e.preventDefault();
                router.push(`/tools/${filteredTools[selectedIndex].slug}`);
                setIsFocused(false);
              }
            }
          }}
          placeholder="Search 50+ tools, compilers, calculators..."
          className="w-full py-3.5 sm:py-4 pl-3 sm:pl-3.5 pr-20 sm:pr-28 text-[15px] sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-transparent outline-none focus:ring-0"
        />

        <div className="absolute right-2.5 sm:right-3.5 flex items-center gap-1.5">
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 shadow-2xs">
            <Command className="h-3 w-3" />K
          </kbd>
          <button
            type="submit"
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#FF8A00] hover:bg-[#ff9e2e] text-slate-950 font-bold text-xs transition active:scale-95 shadow-xs cursor-pointer flex items-center gap-1"
            aria-label="Submit search"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="hidden sm:inline">Go</span>
          </button>
        </div>
      </form>

      {/* Instant Autocomplete Flyout */}
      {isFocused && filteredTools.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] shadow-2xl p-2 z-50 text-left animate-fadeIn">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Matching Tools ({filteredTools.length})
          </div>
          <div className="space-y-1">
            {filteredTools.map((t, idx) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                onMouseDown={() => router.push(`/tools/${t.slug}`)}
                className={`flex items-center justify-between p-2.5 rounded-xl transition ${
                  selectedIndex === idx
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{t.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{t.tagline}</div>
                </div>
                <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/80 px-2 py-0.5 rounded">
                  {t.categoryName}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
