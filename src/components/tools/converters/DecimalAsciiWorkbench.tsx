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
} from 'lucide-react';
import {
  convertDecimalToAscii,
  convertAsciiToDecimal,
  DecimalToAsciiOptions,
} from '@/lib/tools/engines/utilityConverters';

interface DecimalAsciiWorkbenchProps {
  initialInput?: string;
}

export function DecimalAsciiWorkbench({
  initialInput = '72 101 108 108 111 44 32 87 111 114 108 100 33',
}: DecimalAsciiWorkbenchProps) {
  const [direction, setDirection] = useState<'decimal-to-ascii' | 'ascii-to-decimal'>('decimal-to-ascii');
  const [input, setInput] = useState<string>(initialInput);
  const [output, setOutput] = useState<string>('');
  const [delimiter, setDelimiter] = useState<DecimalToAsciiOptions['delimiter']>('space');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [execTimeMs, setExecTimeMs] = useState<number>(0);

  const performConversion = useCallback(
    (val: string, dir: 'decimal-to-ascii' | 'ascii-to-decimal', delim: any) => {
      if (!val) {
        setOutput('');
        setError(null);
        return;
      }

      const t0 = performance.now();
      try {
        if (dir === 'decimal-to-ascii') {
          const res = convertDecimalToAscii(val);
          setOutput(res);
          setError(null);
        } else {
          const res = convertAsciiToDecimal(val, { delimiter: delim });
          setOutput(res);
          setError(null);
        }
        setExecTimeMs(Math.round((performance.now() - t0) * 100) / 100);
      } catch (err: any) {
        setError(err?.message || 'Invalid decimal code sequence.');
        setOutput('');
      }
    },
    []
  );

  useEffect(() => {
    performConversion(input, direction, delimiter);
  }, [input, direction, delimiter, performConversion]);

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
    const nextDir = direction === 'decimal-to-ascii' ? 'ascii-to-decimal' : 'decimal-to-ascii';
    setDirection(nextDir);
    if (output) setInput(output);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#05070c] shadow-lg dark:shadow-[0_0_50px_rgba(0,210,255,0.03)] overflow-hidden transition-colors duration-200">
      {/* ── Top Header Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#080d19] px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSwapDirection}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:border-orange-500 hover:text-orange-500 dark:hover:border-[#00D2FF] dark:hover:text-[#00D2FF] transition cursor-pointer shadow-2xs"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-orange-500 dark:text-[#00D2FF]" />
            <span>
              {direction === 'decimal-to-ascii' ? 'Decimal → ASCII' : 'ASCII → Decimal'}
            </span>
          </button>

          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
            Unicode CodePoint &amp; ASCII Table
          </span>
        </div>

        {direction === 'ascii-to-decimal' && (
          <div className="flex items-center gap-1.5 text-xs">
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Output Delimiter:
            </label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as any)}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 font-medium focus:border-orange-500 dark:focus:border-[#00D2FF] focus:outline-none"
            >
              <option value="space">Space (72 101)</option>
              <option value="comma">Comma (72, 101)</option>
              <option value="newline">New Line</option>
            </select>
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
                {direction === 'decimal-to-ascii' ? 'Decimal Character Codes Input' : 'ASCII / Text Input'}
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
              direction === 'decimal-to-ascii'
                ? 'Enter decimal numbers separated by spaces or commas (e.g. 72 101 108 108 111)...'
                : 'Enter ASCII or UTF-8 text to convert to decimal numbers...'
            }
            rows={10}
            className="w-full flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070b14] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-orange-500 dark:focus:border-[#00D2FF] focus:outline-none transition leading-relaxed min-h-[220px]"
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
                {direction === 'decimal-to-ascii' ? 'Converted ASCII / UTF-8 Text' : 'Decimal Numbers Output'}
              </span>
              {output.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-[#00D2FF] border border-orange-500/20 dark:border-[#00D2FF]/20">
                  {output.length} length
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer ${
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
            placeholder="Converted text will appear instantly as you type..."
            rows={10}
            className="w-full flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none leading-relaxed min-h-[220px]"
          />

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-orange-500 dark:text-[#00D2FF]" />
              <span>Instant client execution · Full Unicode codepoint safety</span>
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
