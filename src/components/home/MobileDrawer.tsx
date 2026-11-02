'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, Boxes, BookOpen, ChevronDown, Zap, ArrowRight } from 'lucide-react';
import { MEGA_MENUS } from './navData';
import { AiLogo } from './Navbar';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden pointer-events-auto">
      {/* Frosted Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-[88vw] max-w-[400px] bg-white dark:bg-[#080d1a] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-50 animate-fadeIn overflow-x-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#060a14]">
          <AiLogo />
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close Navigation Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF8A00] pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>Directory &amp; Navigation</span>
            <span className="text-[10px] text-slate-400">Live Suite</span>
          </div>

          {/* Dedicated Primary AI Links */}
          <div className="space-y-2">
            <Link
              href="/ai-tools"
              onClick={onClose}
              className="min-h-[44px] flex items-center justify-between p-3.5 rounded-2xl bg-[#FF8A00]/10 border border-[#FF8A00]/20 text-slate-950 dark:text-white font-bold text-sm transition hover:bg-[#FF8A00]/20 cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#FF8A00]" />
                <span>AI Tools Directory</span>
              </span>
              <ArrowRight className="w-4 h-4 text-[#FF8A00]" />
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/toolkits"
                onClick={onClose}
                className="min-h-[44px] flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs hover:border-orange-500/40"
              >
                <Boxes className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>AI Toolkits</span>
              </Link>
              <Link
                href="/guides"
                onClick={onClose}
                className="min-h-[44px] flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs hover:border-orange-500/40"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>AI Guides</span>
              </Link>
            </div>
          </div>

          {/* Accordion Categories */}
          <div className="space-y-1">
            {MEGA_MENUS.map((menu) => {
              const isExpanded = expandedSection === menu.key;
              return (
                <div key={menu.key} className="border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={menu.href}
                      onClick={onClose}
                      className="min-h-[44px] flex items-center flex-1 text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-[#FF8A00]"
                    >
                      {menu.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setExpandedSection(isExpanded ? null : menu.key)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                      aria-label={`Toggle ${menu.label} subcategories`}
                      aria-expanded={isExpanded}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#FF8A00]' : ''}`}
                      />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-1 pl-2 space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/50 animate-fadeIn">
                      {menu.categories.map((category) => (
                        <div key={category.title} className="space-y-1">
                          <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
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
                                  className="min-h-[40px] flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-[#FF8A00] transition"
                                >
                                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#FF8A00] shrink-0">
                                    <Icon className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="truncate">{item.name}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Quick Action */}
          <div className="pt-2">
            <Link
              href="/tools"
              onClick={onClose}
              className="min-h-[44px] w-full rounded-xl font-mono text-xs font-bold text-slate-950 bg-[#FF8A00] hover:bg-[#ff9e2e] flex items-center justify-center gap-2 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>Launch Universal Directory</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
