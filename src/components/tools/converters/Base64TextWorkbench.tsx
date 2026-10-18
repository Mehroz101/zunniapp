'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Copy,
  Check,
  Trash2,
  ClipboardPaste,
  ArrowRightLeft,
  Zap,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { decodeBase64ToText, encodeTextToBase64, Base64Options } from '@/lib/tools/engines/utilityConverters';

interface Base64TextWorkbenchProps {
  initialInput?: string;
}

export function Base64TextWorkbench({
  initialInput = 'SGVsbG8sIFdvcmxkISBXZWxjb21lIHRvIEFpVG9vbHMgU3R1ZGlvLg==',
}: Base64TextWorkbenchProps) {
  const [direction, setDirection] = useState<'base64-to-text' | 'text-to-base64'>('base64-to-text');
  const [input, setInput] = useState<string>(initialInput);
  const [output, setOutput] = useState<string>('');
  const [urlSafe, setUrlSafe] = useState(false);
  const [wrapLines, setWrapLines] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [execTimeMs, setExecTimeMs] = useState<number>(0);

  const performConversion = useCallback((val: string, dir: 'base64-to-text' | 'text-to-base64', isUrlSafe: boolean, isWrap: boolean) => {
    if (!val) {
      setOutput('');
      setError(null);
      return;
    }

    const t0 = performance.now();
    try {
      if (dir === 'base64-to-text') {
        const decoded = decodeBase64ToText(val);
        setOutput(decoded);
        setError(null);
      } else {
        const encoded = encodeTextToBase64(val, { urlSafe: isUrlSafe, wrapLines: isWrap });
        setOutput(encoded);
        setError(null);
      }
      setExecTimeMs(Math.round((performance.now() - t0) * 100) / 100);
    } catch (err: any) {
      setError(err?.message || 'Invalid Base64 sequence: malformed characters or padding.');
      setOutput('');
    }
  }, []);

  useEffect(() => {
    performConversion(input, direction, urlSafe, wrapLines);
  }, [input, direction, urlSafe, wrapLines, performConversion]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInput(text);
    } catch {
      // Fallback
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSwapDirection = () => {
    const next = direction === 'base64-to-text' ? 'text-to-base64' : 'base64-to-text';
    setDirection(next);
    if (output) setInput(output);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#05070c] shadow-lg dark:shadow-[0_0_50px_rgba(0,210,255,0.03)] overflow-hidden transition-colors duration-200">
      {/* ── Top Toolbar & Format Toggles ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#080d19] px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSwapDirection}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:border-orange-500 hover:text-orange-500 dark:hover:border-[#00D2FF] dark:hover:text-[#00D2FF] transition cursor-pointer shadow-2xs"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-orange-500 dark:text-[#00D2FF]" />
            <span>
              {direction === 'base64-to-text' ? 'Base64 → Text' : 'Text → Base64'}
            </span>
          </button>

          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
            RFC 4648 UTF-8 Compliant
          </span>
        </div>

        {direction === 'text-to-base64' && (
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={urlSafe}
                onChange={(e) => setUrlSafe(e.target.checked)}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <span>URL-Safe (- and _)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={wrapLines}
                onChange={(e) => setWrapLines(e.target.checked)}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <span>Wrap Lines (76 chars)</span>
            </label>
          </div>
        )}
      </div>

      {/* ── Responsive Dual-Pane Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800/80">
        {/* Left Pane: Input */}
        <div className="flex flex-col p-4 sm:p-6 bg-white dark:bg-[#05070c]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {direction === 'base64-to-text' ? 'Base64 Encoded Input' : 'Plain Text Input'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {input.length} chars
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 transition cursor-pointer"
              >
                <ClipboardPaste className="h-3 w-3 text-slate-500" />
                <span>Paste</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                title="Clear input"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 transition cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              direction === 'base64-to-text'
                ? 'Paste Base64 string here (e.g. SGVsbG8gV29ybGQ=)...'
                : 'Enter plain text to encode to Base64...'
            }
            rows={10}
            className="w-full flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070b14] p-4 font-mono text-[16px] sm:text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-orange-500 dark:focus:border-[#00D2FF] focus:outline-none transition leading-relaxed min-h-[220px]"
          />

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Pane: Output */}
        <div className="flex flex-col p-4 sm:p-6 bg-slate-50/30 dark:bg-[#05070c]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {direction === 'base64-to-text' ? 'Decoded Plain Text' : 'Base64 Output'}
              </span>
              {output.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-[#00D2FF] border border-orange-500/20 dark:border-[#00D2FF]/20">
                  {output.length} chars
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
              className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-[#FF8A00] dark:bg-[#00D2FF] text-slate-950 hover:opacity-95 shadow-orange-500/20'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>
          </div>

          <textarea
            readOnly
            value={output}
            placeholder="Decoded text will appear instantly as you type..."
            rows={10}
            className="w-full flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] p-4 font-mono text-[16px] sm:text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none leading-relaxed min-h-[220px]"
          />

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-orange-500 dark:text-[#00D2FF]" />
              <span>Instant client execution · Zero data transmitted</span>
            </div>
            {execTimeMs > 0 && (
              <span>{execTimeMs} ms</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
