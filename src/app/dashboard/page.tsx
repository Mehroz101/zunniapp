'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  Cpu,
  Database,
  Layers,
  Activity,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { BrandLogo } from '@/components/brand/BrandLogo';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [revalidateStatus, setRevalidateStatus] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRevalidateCache = async () => {
    setIsRevalidating(true);
    setRevalidateStatus(null);
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer toolty_secure_revalidate_secret_2026',
        },
      });
      const data = await res.json();
      if (res.ok && data.revalidated) {
        setRevalidateStatus('Edge cache and static ISR pages revalidated successfully.');
      } else {
        setRevalidateStatus(`Revalidation triggered (${res.status}).`);
      }
    } catch (err: any) {
      setRevalidateStatus(`Notice: ${err.message || 'Triggered revalidation.'}`);
    } finally {
      setIsRevalidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070c] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-[#070b13]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <BrandLogo size={28} />
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ADMIN MASTER GATE ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 transition"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-3 py-1.5 rounded-lg transition active:scale-95 cursor-pointer disabled:opacity-60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Welcome Banner */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c1220] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-600 dark:text-[#FF8A00] font-semibold mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>AUTHENTICATED MASTER CONSOLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Welcome, Administrator
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono">
              Signed in as: <span className="font-bold text-slate-900 dark:text-white">zunnorainrajpoot7@gmail.com</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRevalidateCache}
              disabled={isRevalidating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF8A00] hover:bg-[#ff9e2e] text-slate-950 font-bold text-xs font-mono shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRevalidating ? 'animate-spin' : ''}`} />
              <span>{isRevalidating ? 'Purging Cache...' : 'Purge Edge ISR Cache'}</span>
            </button>
          </div>
        </div>

        {revalidateStatus && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{revalidateStatus}</span>
          </div>
        )}

        {/* Telemetry Metrics Grid */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] shadow-2xs">
            <div className="flex items-center justify-between mb-3 text-slate-400">
              <span className="text-xs font-mono uppercase tracking-wider">Active Tools</span>
              <Cpu className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-3xl font-black text-slate-950 dark:text-white">49+</div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
              100% Server & Client Ready
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] shadow-2xs">
            <div className="flex items-center justify-between mb-3 text-slate-400">
              <span className="text-xs font-mono uppercase tracking-wider">Calculators</span>
              <Activity className="w-4 h-4 text-[#FF8A00]" />
            </div>
            <div className="text-3xl font-black text-slate-950 dark:text-white">19</div>
            <span className="text-[11px] text-slate-500 font-mono mt-1 block">
              Finance & Scientific Suites
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] shadow-2xs">
            <div className="flex items-center justify-between mb-3 text-slate-400">
              <span className="text-xs font-mono uppercase tracking-wider">Runtime Server</span>
              <Database className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-slate-950 dark:text-white">Hostinger</div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
              Node.js Standalone Runner
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] shadow-2xs">
            <div className="flex items-center justify-between mb-3 text-slate-400">
              <span className="text-xs font-mono uppercase tracking-wider">Security State</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">Locked</div>
            <span className="text-[11px] text-slate-500 font-mono mt-1 block">
              HMAC-SHA256 Signed Session
            </span>
          </div>
        </div>

        {/* Quick Management Panels */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Panel 1: Security & Master Credentials */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220]">
            <h3 className="text-base font-bold text-slate-950 dark:text-white mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FF8A00]" />
              <span>Authentication Gate Status</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Unbypassable Next.js edge middleware is strictly protecting all `/dashboard`, `/admin`, and mutating APIs.
            </p>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-500">Authorized Master Email:</span>
                <span className="font-bold text-slate-900 dark:text-white">zunnorainrajpoot7@gmail.com</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-500">Session Cookie Name:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">admin_session (Strict, HttpOnly)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-500">Token Algorithm:</span>
                <span className="font-bold text-slate-900 dark:text-white">HMAC-SHA256 (Web Crypto Native)</span>
              </div>
            </div>
          </div>

          {/* Panel 2: Quick Links & Actions */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220]">
            <h3 className="text-base font-bold text-slate-950 dark:text-white mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>Platform Quick Actions</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Direct access to live platform directories and endpoints.
            </p>
            <div className="space-y-2.5">
              <Link
                href="/tools"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-orange-500/50 transition"
              >
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">Explore Developer Tools Suite</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/calculators/finance"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-orange-500/50 transition"
              >
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">Financial Calculation Workbenches</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/api/health"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-orange-500/50 transition"
              >
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">Inspect Health API Endpoint</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
