'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Play,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Download,
  AlertCircle,
  Clock,
  Sliders,
  Trash2,
  Zap,
  Upload,
  ArrowRightLeft,
  FileCode,
  CheckCircle2,
} from 'lucide-react';
import { ToolDefinition, ToolExecutionResult } from '@/lib/tools/types';
import { executeTool } from '@/lib/tools/registry';

interface WorkbenchProps {
  tool: ToolDefinition;
}

export function Workbench({ tool }: WorkbenchProps) {
  const isDualInput = tool.slug === 'json-patch-applier';

  const defaultSampleParts = (tool.sampleInput || '').split(/\n---\n/);
  const initialInput1 = defaultSampleParts[0] || '';
  const initialInput2 = defaultSampleParts[1] || '';

  const [input1, setInput1] = useState<string>(initialInput1);
  const [input2, setInput2] = useState<string>(initialInput2);
  const [singleInput, setSingleInput] = useState<string>(tool.sampleInput || '');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const [options, setOptions] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.options?.forEach((opt) => {
      initial[opt.id] = opt.defaultValue;
    });
    return initial;
  });

  const [copied, setCopied] = useState(false);
  const [telemetry, setTelemetry] = useState<ToolExecutionResult['telemetry'] | null>(null);
  const [error, setError] = useState<{ message: string; line?: number; column?: number } | null>(null);
  const [meta, setMeta] = useState<Record<string, any> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stable ref for options to avoid stale closure
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const getCombinedInput = useCallback((): string => {
    if (isDualInput) {
      return `${input1.trim()}\n---\n${input2.trim()}`;
    }
    return singleInput;
  }, [isDualInput, input1, input2, singleInput]);

  const handleRun = useCallback(
    async (customInput?: string, customOptions?: Record<string, any>) => {
      const rawPayload = customInput !== undefined ? customInput : getCombinedInput();
      const resolvedOptions = customOptions ?? optionsRef.current;

      setIsRunning(true);
      setError(null);

      try {
        const res = await executeTool(tool.slug, rawPayload, resolvedOptions);
        if (res.success) {
          setOutput(res.output);
          setTelemetry(res.telemetry);
          setMeta(res.meta || null);
          setError(null);
        } else {
          setError(res.error || { message: 'Conversion or validation failed' });
          if (res.output) setOutput(res.output);
          else setOutput('');
        }
      } catch (err: any) {
        setError({
          message: err?.message || 'An unexpected runtime execution error occurred.',
        });
      } finally {
        setIsRunning(false);
      }
    },
    [tool.slug, getCombinedInput]
  );

  // Synchronize and auto-execute whenever tool.slug changes
  useEffect(() => {
    const parts = (tool.sampleInput || '').split(/\n---\n/);
    setInput1(parts[0] || '');
    setInput2(parts[1] || '');
    setSingleInput(tool.sampleInput || '');
    setOutput('');
    setError(null);
    setTelemetry(null);
    setMeta(null);

    const initialOpts: Record<string, any> = {};
    tool.options?.forEach((opt) => {
      initialOpts[opt.id] = opt.defaultValue;
    });
    setOptions(initialOpts);
    optionsRef.current = initialOpts;

    if (tool.sampleInput) {
      handleRun(tool.sampleInput, initialOpts);
    }
  }, [tool.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOptionChange = (id: string, value: any) => {
    const updated = { ...optionsRef.current, [id]: value };
    setOptions(updated);
    optionsRef.current = updated;
    handleRun(undefined, updated);
  };

  const handleClear = () => {
    setInput1('');
    setInput2('');
    setSingleInput('');
    setOutput('');
    setError(null);
    setTelemetry(null);
    setMeta(null);
  };

  const handleLoadSample = () => {
    if (isDualInput) {
      const parts = (tool.sampleInput || '').split(/\n---\n/);
      setInput1(parts[0] || '');
      setInput2(parts[1] || '');
    } else {
      setSingleInput(tool.sampleInput || '');
    }
    handleRun(tool.sampleInput);
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
    const ext =
      tool.outputLanguage === 'json'
        ? 'json'
        : tool.outputLanguage === 'xml'
        ? 'xml'
        : tool.outputLanguage === 'html'
        ? 'html'
        : tool.outputLanguage === 'css'
        ? 'css'
        : tool.outputLanguage === 'typescript'
        ? 'ts'
        : tool.outputLanguage === 'markdown'
        ? 'md'
        : 'txt';
    a.download = `${tool.slug}-result.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (typeof text === 'string') {
        if (isDualInput) {
          setInput1(text);
        } else {
          setSingleInput(text);
        }
        handleRun(text);
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be re-uploaded
    e.target.value = '';
  };

  const handleCopyToInput = () => {
    if (!output) return;
    if (isDualInput) {
      setInput1(output);
    } else {
      setSingleInput(output);
    }
    handleRun(output);
  };

  // Keyboard shortcut listener: Ctrl+Enter or Cmd+Enter to run
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  const currentInputLength = isDualInput ? input1.length + input2.length : singleInput.length;
  const currentLinesCount = (isDualInput ? input1 : singleInput).split(/\r?\n/).length;

  return (
    <div className="w-full space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept=".txt,.json,.xml,.html,.css,.js,.ts,.tsx,.jsx,.sql,.yaml,.yml,.csv,.svg,.md"
      />

      {/* ── Optional Parameter Ribbon ── */}
      {tool.options && tool.options.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-neutral-200/80 dark:border-slate-800 bg-white dark:bg-[#07090f] p-4 text-xs shadow-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Sliders className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
            <span>Options:</span>
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
                  className="rounded-lg border border-neutral-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 text-slate-900 dark:text-slate-100 outline-none focus:border-orange-500 cursor-pointer"
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
                  className="h-4 w-4 rounded border-neutral-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
              )}
              {opt.type === 'text' && (
                <input
                  type="text"
                  value={options[opt.id] ?? opt.defaultValue}
                  onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                  className="rounded-lg border border-neutral-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 text-slate-900 dark:text-slate-100 outline-none focus:border-orange-500 min-w-[140px]"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Two-Pane Tool Canvas ── */}
      <div className="rounded-2xl border border-neutral-200/80 dark:border-slate-800/80 bg-white dark:bg-[#07090f] p-5 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
          
          {/* ── Left Pane: Input ── */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {tool.inputLabel || 'Input'}
                </h3>
                <span className="font-mono text-[10.5px] text-slate-400 dark:text-slate-500">
                  {currentLinesCount} lines · {currentInputLength} chars
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload a file to process"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer shadow-2xs"
                >
                  <Upload className="h-3 w-3 text-orange-500 dark:text-[#FF8A00]" />
                  <span>Upload</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadSample}
                  title="Load pre-configured sample payload"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer shadow-2xs"
                >
                  <Sparkles className="h-3 w-3 text-[#FF8A00]" />
                  <span>Sample</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear input payload"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:text-rose-600 dark:hover:text-rose-400 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 transition cursor-pointer shadow-2xs"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {isDualInput ? (
              // Dual-Card Inputs for JSON Patch Applier
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex justify-between items-center">
                    <span>Original JSON Document</span>
                    <span className="text-[10px] text-slate-500">{input1.length} chars</span>
                  </div>
                  <textarea
                    value={input1}
                    onChange={(e) => {
                      setInput1(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={`{\n  "title": "My Task",\n  "tags": ["personal"]\n}`}
                    rows={8}
                    spellCheck={false}
                    className="w-full rounded-xl border border-neutral-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0a0f1d] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-orange-500 focus:outline-none transition leading-relaxed"
                  />
                </div>

                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex justify-between items-center">
                    <span>RFC 6902 Patch Operations (Array)</span>
                    <span className="text-[10px] text-slate-500">{input2.length} chars</span>
                  </div>
                  <textarea
                    value={input2}
                    onChange={(e) => {
                      setInput2(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={`[\n  { "op": "add", "path": "/tags/-", "value": "work" },\n  { "op": "replace", "path": "/title", "value": "Finish Seeding" }\n]`}
                    rows={8}
                    spellCheck={false}
                    className="w-full rounded-xl border border-neutral-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0a0f1d] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-orange-500 focus:outline-none transition leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              // Single Input Tool
              <div className="flex-1 flex flex-col">
                <textarea
                  value={singleInput}
                  onChange={(e) => {
                    setSingleInput(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={tool.inputPlaceholder}
                  rows={18}
                  spellCheck={false}
                  className="w-full flex-1 rounded-xl border border-neutral-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0a0f1d] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-orange-500 focus:outline-none transition leading-relaxed min-h-[360px]"
                />
              </div>
            )}
          </div>

          {/* ── Middle Separator ── */}
          <div className="hidden lg:flex items-center justify-center px-1">
            <div className="flex flex-col items-center gap-1.5 text-neutral-300 dark:text-slate-700 py-6">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-slate-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-slate-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-slate-700" />
            </div>
          </div>

          {/* ── Right Pane: Result ── */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {tool.outputLabel || 'Result'}
                </h3>
                {telemetry && (
                  <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full shadow-2xs">
                    <Clock className="h-2.5 w-2.5" />
                    {telemetry.executionTimeMs}ms
                  </span>
                )}
                {output && !error && (
                  <span className="font-mono text-[10.5px] text-slate-400 dark:text-slate-500">
                    {output.length} chars
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {output && !error && !isDualInput && (
                  <button
                    type="button"
                    onClick={handleCopyToInput}
                    title="Send output back into input (for reversible or iterative transforms)"
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition active:scale-95 cursor-pointer"
                  >
                    <ArrowRightLeft className="h-3 w-3 text-orange-500 dark:text-[#FF8A00]" />
                    <span className="hidden sm:inline">Use as Input</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!output}
                  title="Download Output"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition active:scale-95 disabled:opacity-40 cursor-pointer"
                >
                  <Download className="h-3 w-3 text-orange-500 dark:text-[#FF8A00]" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!output}
                  className="rounded-lg bg-[#0c1222] hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-950 px-3 py-1 text-xs font-semibold shadow-xs transition active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Running indicator */}
            {isRunning && (
              <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 font-medium">
                <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                Executing engine...
              </div>
            )}

            {/* Error Notification Alert */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-50 dark:bg-rose-950/20 p-3.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                <div>
                  <p className="font-semibold">Execution Notice</p>
                  <p className="mt-0.5">{error.message}</p>
                  {error.line && (
                    <p className="mt-1 font-mono text-[11px] text-rose-500 dark:text-rose-400">
                      Line {error.line}
                      {error.column ? `, Column ${error.column}` : ''}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Read-Only Monospace Result Box */}
            <div className="flex-1 flex flex-col">
              <textarea
                readOnly
                value={output}
                placeholder="Execution result will appear here..."
                rows={18}
                spellCheck={false}
                className="w-full flex-1 rounded-xl border border-neutral-200 dark:border-slate-800 bg-white dark:bg-[#060811] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none leading-relaxed min-h-[360px]"
              />
            </div>
          </div>
        </div>

        {/* ── Sticky Bottom Action Bar ── */}
        <div className="mt-8 pt-6 border-t border-neutral-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Zap className="h-4 w-4 text-orange-500 dark:text-orange-400 shrink-0" />
            <span>Instant execution — your data never leaves your browser.</span>
            <kbd className="hidden sm:inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 ml-2">
              Ctrl + Enter to run
            </kbd>
            {telemetry && (
              <span className="hidden md:inline-flex items-center gap-1 ml-2 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Clock className="h-3 w-3" />
                {telemetry.executionTimeMs} ms
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleRun()}
            disabled={isRunning}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF8A00] hover:bg-[#ff9e2e] text-slate-950 px-6 py-2.5 text-xs font-bold transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isRunning ? (
              <>
                <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run Tool</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
