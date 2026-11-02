'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { BrandLogo } from '@/components/brand/BrandLogo';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid administrator credentials');
      }

      // Successful login -> Navigate to protected dashboard
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0c1220] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 dark:shadow-black/50">
      {errorMessage && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
            Master Admin Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20 transition-all font-sans"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
            Master Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20 transition-all font-sans"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-[#FF8A00] hover:bg-[#ff9e2e] active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Master Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-center text-[11px] font-mono text-slate-400 dark:text-slate-500">
        Protected by HTTP-Only HMAC-SHA256 encrypted session tokens.
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070c] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/[0.05] rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Top Header & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-5">
            <BrandLogo size={36} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/50 text-[#FF8A00] text-[11px] font-mono font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ENTERPRISE ADMIN GATEWAY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Admin Access Portal
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Sign in with authorized master credentials to manage the platform.
          </p>
        </div>

        {/* Card Box with Suspense */}
        <Suspense fallback={
          <div className="bg-white dark:bg-[#0c1220] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-8 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#FF8A00]" />
            <span className="text-xs font-mono">Loading authentication gate...</span>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
