'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = (await res.json()) as { success: boolean; message: string };

      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Subscribed successfully to the developer telemetry dispatch.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Unable to connect to the server.');
    }
  };

  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            required
            placeholder="developer@domain.com"
            disabled={status === 'loading'}
            className="w-full rounded-full border border-white/10 bg-white/[0.03] px-5 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-[#00D2FF]/60 focus:outline-none focus:ring-1 focus:ring-[#00D2FF]/40 disabled:opacity-50 transition shadow-sm font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || !email.trim()}
          className="flex items-center justify-center gap-2 rounded-full bg-[#00D2FF] px-7 py-3.5 text-xs sm:text-sm font-semibold text-black shadow-[0_0_20px_rgba(0,210,255,0.3)] transition hover:bg-[#38bdf8] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-mono"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-black" />
              <span>Transmitting...</span>
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5 text-black" />
              <span>SUBSCRIBE FREE</span>
            </>
          )}
        </button>
      </form>

      {/* Animated Success Message */}
      {status === 'success' && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
