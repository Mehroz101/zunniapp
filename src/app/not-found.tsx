import Link from 'next/link';
import { ArrowLeft, BookOpen, Compass, Home, Search, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-orange-500/30 selection:text-orange-950 dark:selection:text-orange-200">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-28 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-gradient-to-tr from-[#FF8A00]/10 via-amber-500/10 to-orange-500/10 rounded-full blur-[120px] dark:opacity-60" />
        </div>

        <div className="relative z-10 max-w-xl w-full text-center space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-xs font-mono text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            HTTP 404 · RESOURCE_NOT_FOUND
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Page Not{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
              Found
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The article, route, or tool you are searching for might have been updated, unpublished, or has not been indexed yet.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/blog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 text-xs font-semibold shadow-sm transition-all"
            >
              <BookOpen className="h-4 w-4 text-[#FF8A00]" />
              Browse AI Articles
            </Link>

            <Link
              href="/ai-tools"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-all"
            >
              <Compass className="h-4 w-4" />
              Explore Free AI Tools
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-all text-slate-600 dark:text-slate-300"
            >
              <Home className="h-4 w-4" />
              Homepage
            </Link>
          </div>

          {/* Popular Categories */}
          <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Popular Publications & Topics
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { name: 'AI News', href: '/news' },
                { name: 'Technical Guides', href: '/guides' },
                { name: 'Code Converters', href: '/ai-tools/coding' },
                { name: 'AI Glossary', href: '/glossary' },
                { name: 'Tool Comparisons', href: '/compare' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
