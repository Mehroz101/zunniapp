'use client';

import { type Tool } from '@/lib/api';

interface ToolRendererProps {
  tool: Tool;
}

export function ToolRenderer({ tool }: ToolRendererProps) {
  switch (tool.renderType) {
    case 'CLIENT_SIDE':
      return <ClientSideToolRenderer tool={tool} />;
    case 'API_POWERED':
      return <ApiPoweredToolRenderer tool={tool} />;
    case 'IFRAME_EMBED':
      return <IframeToolRenderer tool={tool} />;
    case 'EXTERNAL_LINK':
      return <ExternalToolRenderer tool={tool} />;
    default:
      return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/60">This tool is not yet configured.</p>
        </div>
      );
  }
}

function ClientSideToolRenderer({ tool }: { tool: Tool }) {
  const config = tool.config as {
    inputs?: Array<{ id: string; label: string; type: string; placeholder?: string; language?: string }>;
    outputs?: Array<{ id: string; label: string; type: string; language?: string; copyable?: boolean }>;
  };

  return (
    <div className="space-y-6">
      {config.inputs?.map((input) => (
        <div key={input.id} className="space-y-2">
          <label className="block text-sm font-medium text-white/80">{input.label}</label>
          {input.type === 'textarea' ? (
            <textarea
              id={input.id}
              placeholder={input.placeholder}
              rows={8}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/30 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          ) : (
            <input
              id={input.id}
              type={input.type}
              placeholder={input.placeholder}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          )}
        </div>
      ))}
      <button
        type="button"
        className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-95"
      >
        Run Tool
      </button>
      {config.outputs?.map((output) => (
        <div key={output.id} className="space-y-2">
          <label className="block text-sm font-medium text-white/80">{output.label}</label>
          <div className="relative">
            <pre className="min-h-[120px] w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white/80">
              <code>Output will appear here…</code>
            </pre>
            {output.copyable && (
              <button
                type="button"
                className="absolute right-3 top-3 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/20"
              >
                Copy
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ApiPoweredToolRenderer({ tool }: { tool: Tool }) {
  const config = tool.config as {
    inputs?: Array<{ id: string; label: string; type: string; placeholder?: string }>;
    outputs?: Array<{ id: string; label: string; type: string; copyable?: boolean }>;
    endpoint?: string;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
        <p className="text-xs text-indigo-300">⚡ AI-Powered — processed server-side</p>
      </div>
      {config.inputs?.map((input) => (
        <div key={input.id} className="space-y-2">
          <label className="block text-sm font-medium text-white/80">{input.label}</label>
          <textarea
            id={input.id}
            placeholder={input.placeholder}
            rows={6}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      ))}
      <button
        type="button"
        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-indigo-500 hover:to-violet-500"
      >
        Process with AI
      </button>
    </div>
  );
}

function IframeToolRenderer({ tool }: { tool: Tool }) {
  const config = tool.config as { embedUrl?: string; height?: number; allowFullscreen?: boolean };

  if (!config.embedUrl) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <iframe
        src={config.embedUrl}
        height={config.height ?? 600}
        width="100%"
        title={tool.name}
        allowFullScreen={config.allowFullscreen ?? false}
        className="w-full"
      />
    </div>
  );
}

function ExternalToolRenderer({ tool }: { tool: Tool }) {
  const config = tool.config as {
    externalUrl?: string;
    cta?: string;
    pricing?: string;
    features?: string[];
  };

  return (
    <div className="space-y-6">
      {config.features && (
        <ul className="space-y-2">
          {config.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-white/70">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600/20 text-xs text-indigo-400">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      )}
      {config.pricing && (
        <p className="text-sm text-white/50">Pricing: <span className="capitalize text-white/80">{config.pricing}</span></p>
      )}
      <a
        href={config.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:from-indigo-500 hover:to-violet-500"
      >
        {config.cta ?? 'Open Tool'} ↗
      </a>
    </div>
  );
}
