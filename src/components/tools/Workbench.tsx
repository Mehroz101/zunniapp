'use client';

import { useState, useTransition, useEffect } from 'react';
import {
  Play,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Download,
  AlertCircle,
  Clock,
  Code2,
  FileText,
  Sliders,
  Maximize2,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { ToolDefinition, ToolExecutionResult } from '@/lib/tools/types';
import { executeTool } from '@/lib/tools/registry';

interface WorkbenchProps {
  tool: ToolDefinition;
}

export function Workbench({ tool }: WorkbenchProps) {
  const [input, setInput] = useState<string>(tool.sampleInput || '');
  const [output, setOutput] = useState<string>('');
  const [options, setOptions] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.options?.forEach((opt) => {
      initial[opt.id] = opt.defaultValue;
    });
    return initial;
  });
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [telemetry, setTelemetry] = useState<ToolExecutionResult['telemetry'] | null>(null);
  const [error, setError] = useState<{ message: string; line?: number; column?: number } | null>(null);
  const [meta, setMeta] = useState<Record<string, any> | null>(null);
  const [rawView, setRawView] = useState(false);

  // Auto-run with sample input on first mount
  useEffect(() => {
    if (tool.sampleInput) {
      handleExecute(tool.sampleInput, options);
    }
  }, [tool.slug]);

  const handleExecute = (currentInput = input, currentOptions = options) => {
    startTransition(async () => {
      try {
        setError(null);
        const res = await executeTool(tool.slug, currentInput, currentOptions);
        if (res.success) {
          setOutput(res.output);
          setTelemetry(res.telemetry);
          setMeta(res.meta || null);
          setError(null);
        } else {
          setError(res.error || { message: 'Conversion failed' });
          if (res.output) setOutput(res.output);
        }
      } catch (err: any) {
        setError({
          message: err?.message || 'An unexpected runtime execution error occurred.',
        });
      }
    });
  };

  const handleOptionChange = (id: string, value: any) => {
    const updated = { ...options, [id]: value };
    setOptions(updated);
    handleExecute(input, updated);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ext = tool.outputLanguage === 'json' ? 'json' :
                tool.outputLanguage === 'xml' ? 'xml' :
                tool.outputLanguage === 'html' ? 'html' :
                tool.outputLanguage === 'css' ? 'css' :
                tool.outputLanguage === 'typescript' ? 'ts' : 'txt';
    a.download = `${tool.slug}-output.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadSample = () => {
    setInput(tool.sampleInput);
    handleExecute(tool.sampleInput, options);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setTelemetry(null);
    setMeta(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* ── Dynamic Tool Options Ribbon ── */}
      {tool.options && tool.options.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0d16] p-4 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Sliders className="h-3.5 w-3.5 text-cyan-500" />
            <span>Execution Parameters:</span>
          </div>
          {tool.options.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <label className="text-slate-500 dark:text-slate-400 font-medium">
                {opt.label}:
              </label>
              {opt.type === 'select' && (
                <select
                  value={options[opt.id] ?? opt.defaultValue}
                  onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#121624] px-2.5 py-1 text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500"
                >
                  {opt.choices?.map((choice) => (
                    <option key={choice} value={choice}>
                      {choice}
                    </option>
                  ))}
                </select>
              )}
              {opt.type === 'boolean' && (
                <input
                  type="checkbox"
                  checked={Boolean(options[opt.id] ?? opt.defaultValue)}
                  onChange={(e) => handleOptionChange(opt.id, e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
              )}
              {opt.type === 'text' && (
                <input
                  type="text"
                  value={options[opt.id] ?? opt.defaultValue}
                  onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#121624] px-2.5 py-1 text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Dual-Pane Workbench Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ── Left Editor: Input Source ── */}
        <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07090f] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3 bg-slate-50 dark:bg-[#0a0d16]">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-cyan-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {tool.inputLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400 transition"
              >
                <Sparkles className="h-3 w-3" />
                Sample
              </button>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition"
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              placeholder={tool.inputPlaceholder}
              rows={16}
              className="w-full resize-y bg-transparent p-4 font-mono text-xs leading-relaxed text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 bg-slate-50 dark:bg-[#0a0d16] text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>Chars: {input.length}</span>
            <button
              type="button"
              onClick={() => handleExecute(input, options)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition active:scale-95 disabled:opacity-50"
            >
              <Play className="h-3 w-3 fill-current" />
              {isPending ? 'Processing...' : 'Run Tool'}
            </button>
          </div>
        </div>

        {/* ── Right Editor: Formatted Result ── */}
        <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07090f] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3 bg-slate-50 dark:bg-[#0a0d16]">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {tool.outputLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!output}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400 transition disabled:opacity-40"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!output}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400 transition disabled:opacity-40"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>

          {/* Inline Error Boundary Alert */}
          {error && (
            <div className="m-4 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <p className="font-semibold">Syntax / Evaluation Notice</p>
                <p className="mt-0.5 text-rose-600 dark:text-rose-400">{error.message}</p>
                {(error.line !== undefined || error.column !== undefined) && (
                  <p className="mt-1 font-mono text-[11px] opacity-80">
                    Location: Line {error.line ?? '?'}, Column {error.column ?? '?'}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="relative min-h-[320px]">
            <textarea
              readOnly
              value={output}
              placeholder="Output will appear here upon execution..."
              rows={16}
              className="w-full resize-y bg-transparent p-4 font-mono text-xs leading-relaxed text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 bg-slate-50 dark:bg-[#0a0d16] text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              {telemetry && (
                <>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Clock className="h-3 w-3" />
                    {telemetry.executionTimeMs} ms
                  </span>
                  <span>Out: {output.length} chars</span>
                </>
              )}
            </div>
            <span className="text-[10px] uppercase text-slate-400">Deterministic Engine</span>
          </div>
        </div>
      </div>

      {/* ── Specialized Live Interactive Visual Previews ── */}
      {meta && (
        <div className="space-y-4">
          {/* SERP Preview Card */}
          {tool.slug === 'serp-simulator' && meta.title && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07090f] p-6 shadow-sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-cyan-500" />
                Live Google SERP Card Preview
              </h4>
              <div className="max-w-2xl rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#121624] p-4 font-sans">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px]">🌐</div>
                  <span className="truncate">{meta.url}</span>
                </div>
                <h3 className="text-lg font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
                  {meta.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {meta.description}
                </p>
              </div>
            </div>
          )}

          {/* Open Graph Social Card Preview */}
          {tool.slug === 'open-graph-generator' && meta.title && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07090f] p-6 shadow-sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-cyan-500" />
                Live Social Share Preview (Twitter / Facebook / LinkedIn)
              </h4>
              <div className="max-w-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121624]">
                {meta.imageUrl && (
                  <img
                    src={meta.imageUrl}
                    alt={meta.title}
                    className="w-full h-48 object-cover border-b border-slate-200 dark:border-slate-800"
                  />
                )}
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                    {meta.siteName || 'aiiseverything.com'}
                  </p>
                  <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {meta.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {meta.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Heading Hierarchy Node Tree Preview */}
          {tool.slug === 'heading-structure-analyzer' && Array.isArray(meta.headings) && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07090f] p-6 shadow-sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-cyan-500" />
                Visual Heading Document Outline
              </h4>
              <div className="space-y-2 font-mono text-xs">
                {meta.headings.map((h: any, idx: number) => (
                  <div
                    key={idx}
                    style={{ paddingLeft: `${(h.level - 1) * 20}px` }}
                    className="flex items-center gap-2 py-1"
                  >
                    <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                      H{h.level}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200">{h.text || '(Empty Node)'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
