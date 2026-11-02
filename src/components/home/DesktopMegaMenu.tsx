'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MEGA_MENUS } from './navData';

interface DesktopMegaMenuProps {
  menuKey: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export function DesktopMegaMenu({
  menuKey,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: DesktopMegaMenuProps) {
  const activeMenu = MEGA_MENUS.find((m) => m.key === menuKey);

  if (!activeMenu) return null;

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50 w-[800px] max-w-[calc(100vw-32px)] animate-fadeIn transition-all duration-200 pointer-events-auto"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-white/95 dark:bg-[#070b13]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/80 rounded-2xl p-5 overflow-hidden transition-all duration-200">
        {/* Header Banner */}
        <div className="mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-mono font-bold border border-[#FF8A00]/20">
              {activeMenu.label.charAt(0)}
            </span>
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF8A00]">
                {activeMenu.headline}
              </div>
              <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                {activeMenu.subheadline}
              </div>
            </div>
          </div>
        </div>

        {/* Staggered Mega-Menu Grid (2 Columns) */}
        <div className="grid grid-cols-2 gap-4">
          {activeMenu.categories.map((category) => (
            <div key={category.title} className="space-y-1.5">
              <div className="px-2 text-[10.5px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {category.title}
              </div>
              <div className="space-y-0.5">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      {/* Clean Micro-Icon Container with Light Orange Ambient Glow */}
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 group-hover:text-[#FF8A00] group-hover:bg-[#FF8A00]/10 dark:group-hover:shadow-[0_0_12px_rgba(255,138,0,0.25)] shrink-0 transition-all duration-200">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-[#FF8A00] transition truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-snug mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Mega-Menu Footer Link */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-2">
          <Link
            href={activeMenu.footerHref}
            onClick={onClose}
            className="text-xs font-bold text-[#FF8A00] hover:underline flex items-center gap-1.5"
          >
            <span>{activeMenu.footerText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/toolkits"
              onClick={onClose}
              className="text-[11px] font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
            >
              AI Toolkits
            </Link>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <Link
              href="/guides"
              onClick={onClose}
              className="text-[11px] font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
            >
              AI Guides
            </Link>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              Zero Server Latency
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
