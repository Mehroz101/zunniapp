'use client';

import { useEffect, useState } from 'react';
import { AlignLeft } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -65% 0%',
        threshold: 0.1,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 shadow-xs">
      <div className="mb-4 flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <AlignLeft className="h-4 w-4 text-indigo-600" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Table of Contents
        </h3>
      </div>

      <ul className="space-y-1.5 text-xs">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={`${item.level === 3 ? 'pl-3.5' : 'pl-0'}`}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(item.id);
                  if (target) {
                    const top = target.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top, behavior: 'smooth' });
                    setActiveId(item.id);
                  }
                }}
                className={`group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all ${
                  isActive
                    ? 'bg-indigo-50 font-semibold text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-indigo-600 scale-125'
                      : 'bg-slate-300 group-hover:bg-slate-400'
                  }`}
                />
                <span className="truncate">{item.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
