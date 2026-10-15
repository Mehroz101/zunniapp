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
        setMessage(data.message || 'Thank you for subscribing! Check your inbox soon.');
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
            placeholder="Enter your email address..."
            disabled={status === 'loading'}
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:opacity-50 transition shadow-xs"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || !email.trim()}
          className="flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-slate-950/15 transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#00D2FF]" />
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5 text-[#00D2FF]" />
              <span>Subscribe Free</span>
            </>
          )}
        </button>
      </form>

      {/* Animated Success Toast Message */}
      {status === 'success' && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Animated Error Toast Message */}
      {status === 'error' && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
