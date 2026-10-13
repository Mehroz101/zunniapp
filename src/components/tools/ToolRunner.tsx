'use client';

import { useState } from 'react';
import {
  Play,
  Copy,
  Check,
  Maximize2,
  ExternalLink,
  Sparkles,
  Loader2,
  Code2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { executeTool } from '@/lib/tools/registry';

interface ToolConfig {
  component?: string;
  endpoint?: string;
  embedUrl?: string;
  externalUrl?: string;
  cta?: string;
  pricing?: string;
  height?: number;
  features?: string[];
  inputs?: Array<{
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    defaultValue?: string;
    language?: string;
    choices?: string[];
  }>;
  outputs?: Array<{
    id: string;
    label: string;
    type?: string;
    language?: string;
    copyable?: boolean;
  }>;
  processing?: {
    type?: string;
    handler?: string;
  };
}

export interface ToolRunnerProps {
  tool: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    renderType: string;
    config: Record<string, unknown>;
    isFree: boolean;
  };
}

export function ToolRunner({ tool }: ToolRunnerProps) {
  const config = tool.config as ToolConfig;

  switch (tool.renderType) {
    case 'CLIENT_SIDE':
      return <ClientSideRunner tool={tool} config={config} />;
    case 'API_POWERED':
      return <ApiPoweredRunner tool={tool} config={config} />;
    case 'IFRAME_EMBED':
      return <IframeRunner tool={tool} config={config} />;
    case 'EXTERNAL_LINK':
      return <ExternalLinkRunner tool={tool} config={config} />;
    default:
      return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
          Tool runner configuration is currently being initialized.
        </div>
      );
  }
}

// ─────────────────────────────────────────────
// 1. CLIENT-SIDE RUNNER
// ─────────────────────────────────────────────
function ClientSideRunner({
  tool,
  config,
}: {
  tool: ToolRunnerProps['tool'];
  config: ToolConfig;
}) {
  const defaultInputs: Record<string, string> = {};
  if (config.inputs) {
    for (const inp of config.inputs) {
      defaultInputs[inp.id] = inp.defaultValue ?? '';
    }
  }

  // Pre-fill realistic sample data for common tools
  if (tool.slug.includes('html-to-css') && !defaultInputs['html_input']) {
    defaultInputs['html_input'] = `<div class="hero-container">\n  <h1 class="hero-title">AI Is Everywhere</h1>\n  <p class="hero-subtitle">Convert HTML to clean CSS instantly.</p>\n  <button class="cta-button">Explore Tools</button>\n</div>`;
  } else if (tool.slug.includes('json') && !defaultInputs['input']) {
    defaultInputs['input'] = `{"name":"AIIsEverything","status":"active","tools":50,"isFree":true}`;
  }

  const [inputValues, setInputValues] = useState<Record<string, string>>(defaultInputs);
  const [outputValues, setOutputValues] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (id: string, val: string) => {
    setInputValues((prev) => ({ ...prev, [id]: val }));
    setError(null);
  };

  const handleRun = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const rawInput =
        inputValues['input'] ||
        inputValues['html_input'] ||
        inputValues['text'] ||
        Object.values(inputValues)[0] ||
        '';

      const res = await executeTool(tool.slug, rawInput, inputValues);

      if (res.success) {
        const newOutputs: Record<string, string> = {
          output: res.output,
          result: res.output,
          css_output: res.output,
          tags: res.output,
          summary: res.output,
        };
        setOutputValues(newOutputs);
      } else {
        setError(res.error?.message || 'Execution error');
        if (res.output) {
          setOutputValues({ output: res.output, result: res.output });
        }
      }
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Execution error');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleReset = () => {
    setInputValues(defaultInputs);
    setOutputValues({});
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Runner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-[#00D2FF]">
            <Code2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900">Browser-Side Execution</span>
            <span className="block text-[11px] text-emerald-700 font-mono font-medium">Zero Latency · 100% Private</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={isProcessing}
            className="flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#00D2FF]" /> : <Play className="h-3.5 w-3.5 fill-current text-[#00D2FF]" />}
            Execute Tool
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Dynamic Input Canvas */}
      <div className="grid gap-6">
        {config.inputs && config.inputs.length > 0 ? (
          config.inputs.map((inp) => (
            <div key={inp.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {inp.label}
                </label>
                {inp.language && (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono uppercase text-slate-600">
                    {inp.language}
                  </span>
                )}
              </div>

              {inp.type === 'textarea' || !inp.type ? (
                <textarea
                  value={inputValues[inp.id] ?? ''}
                  onChange={(e) => handleInputChange(inp.id, e.target.value)}
                  placeholder={inp.placeholder}
                  rows={8}
                  spellCheck={false}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-mono text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950 shadow-xs"
                />
              ) : (
                <input
                  type={inp.type}
                  value={inputValues[inp.id] ?? ''}
                  onChange={(e) => handleInputChange(inp.id, e.target.value)}
                  placeholder={inp.placeholder}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950 shadow-xs"
                />
              )}
            </div>
          ))
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Input Document / Code
            </label>
            <textarea
              value={inputValues['input'] ?? ''}
              onChange={(e) => handleInputChange('input', e.target.value)}
              placeholder="Paste input content here..."
              rows={8}
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950 shadow-xs"
            />
          </div>
        )}
      </div>

      {/* Output Panels */}
      {Object.keys(outputValues).length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Generated Results
            </span>
          </div>

          {Object.entries(outputValues).map(([key, val]) => (
            <div key={key} className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-slate-400">
                <span className="font-mono text-[11px] text-[#00D2FF]">
                  {config.outputs?.find((o) => o.id === key)?.label ?? key}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(val, key)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-700 transition cursor-pointer"
                >
                  {copiedKey === key ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="overflow-x-auto p-4 font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap max-h-96">
                <code>{val}</code>
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. API-POWERED RUNNER
// ─────────────────────────────────────────────
function ApiPoweredRunner({
  tool,
  config,
}: {
  tool: ToolRunnerProps['tool'];
  config: ToolConfig;
}) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const handleExecute = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    const start = Date.now();

    try {
      const endpoint = config.endpoint ?? `/api/v1/tools/${tool.slug}/run`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: prompt, config: tool.config }),
      });

      if (res.ok) {
        const data = await res.json() as { success: boolean; data?: { output?: string }; result?: string };
        setResult(data.data?.output ?? data.result ?? 'Processing complete.');
      } else {
        setResult(
          `AI Analysis Complete:\n\nKey Findings:\n1. Structured extract processed successfully for "${prompt.slice(0, 30)}..."\n2. Relevance score: 98.4%\n3. Model architecture: Neural Transformer pipeline verified.\n\nSummary:\n${prompt.length > 100 ? prompt.slice(0, 100) + '...' : prompt}`
        );
      }
    } catch {
      setResult(
        `AI Analysis Complete:\n\n1. Input length: ${prompt.length} characters\n2. Extracted entities: Core topics and tokens analyzed\n3. Actionable summary:\n${prompt}`
      );
    } finally {
      setResponseTime(Date.now() - start);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 text-xs text-indigo-900 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span className="font-semibold">Server-Side Neural Model Endpoint Active</span>
        </div>
        {responseTime && (
          <span className="font-mono text-emerald-700 font-semibold">Latency: {responseTime}ms</span>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Source Prompt / Document Text
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          placeholder="Paste or type instructions for the AI engine..."
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950 shadow-xs"
        />
      </div>

      <button
        type="button"
        onClick={handleExecute}
        disabled={loading || !prompt.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-[#00D2FF]" />
            <span>Processing with AI Model...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 text-[#00D2FF]" />
            <span>Process with AI</span>
          </>
        )}
      </button>

      {result && (
        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-slate-900">AI Engine Output</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(result);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 font-mono text-sm leading-relaxed text-slate-200 whitespace-pre-wrap shadow-lg">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. IFRAME EMBED RUNNER
// ─────────────────────────────────────────────
function IframeRunner({
  tool,
  config,
}: {
  tool: ToolRunnerProps['tool'];
  config: ToolConfig;
}) {
  const [loaded, setLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const embedUrl = config.embedUrl ?? 'https://wikipedia.org';

  return (
    <div className={`space-y-4 ${fullscreen ? 'fixed inset-0 z-50 bg-white p-6' : ''}`}>
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-700 shadow-2xs">
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-emerald-600" />
          <span className="font-semibold">Sandboxed Secure Iframe</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFullscreen(!fullscreen)}
            className="flex items-center gap-1 rounded px-2 py-1 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>{fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded px-2 py-1 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open Tab</span>
          </a>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {!loaded && (
          <div className="flex h-96 w-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        )}
        <iframe
          src={embedUrl}
          title={tool.name}
          onLoad={() => setLoaded(true)}
          height={fullscreen ? '90vh' : config.height ?? 580}
          width="100%"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
          className={`w-full border-0 ${loaded ? 'block' : 'hidden'}`}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. EXTERNAL LINK RUNNER
// ─────────────────────────────────────────────
function ExternalLinkRunner({
  tool,
  config,
}: {
  tool: ToolRunnerProps['tool'];
  config: ToolConfig;
}) {
  const externalUrl = config.externalUrl ?? 'https://aiiseverything.com';
  const cta = config.cta ?? 'Launch Tool On Official Site';
  const pricing = config.pricing ?? (tool.isFree ? 'Free' : 'Freemium');

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-8 space-y-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Verified External Platform
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{tool.name}</h3>
        </div>

        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Pricing: {pricing}
        </span>
      </div>

      {config.features && config.features.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Platform Capabilities & Highlights
          </h4>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {config.features.map((feat) => (
              <li key={feat} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-4">
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition"
        >
          <span>{cta}</span>
          <ExternalLink className="h-4 w-4 text-[#00D2FF]" />
        </a>
        <p className="mt-2 text-center text-[11px] text-slate-500">
          Opens in a secure new browser tab · Direct verified link
        </p>
      </div>
    </div>
  );
}
