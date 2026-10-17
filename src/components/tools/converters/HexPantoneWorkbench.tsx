'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Copy,
  Check,
  Trash2,
  ClipboardPaste,
  Sparkles,
  Zap,
  AlertCircle,
  Pipette,
  Layers,
} from 'lucide-react';
import { findNearestPantone, hexToRgb, PantoneMatchResult } from '@/lib/tools/data/pantoneColors';

interface HexPantoneWorkbenchProps {
  initialHex?: string;
}

const PRESET_COLORS = [
  { name: 'Studio Cyan', hex: '#00D2FF' },
  { name: 'Flame Orange', hex: '#FF8A00' },
  { name: 'Coca-Cola Red', hex: '#F40000' },
  { name: 'Tiffany Blue', hex: '#0ABAB5' },
  { name: 'Royal Navy', hex: '#002D62' },
  { name: 'Emerald Gem', hex: '#00965E' },
  { name: 'Ultra Violet', hex: '#582C83' },
  { name: 'Golden Sun', hex: '#FFCD00' },
];

export function HexPantoneWorkbench({ initialHex = '#00D2FF' }: HexPantoneWorkbenchProps) {
  const [hexInput, setHexInput] = useState<string>(initialHex);
  const [matches, setMatches] = useState<PantoneMatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [execTimeMs, setExecTimeMs] = useState<number>(0);

  const resolvePantone = useCallback((hex: string) => {
    const clean = hex.trim().replace(/^#/, '');
    if (!clean) {
      setMatches([]);
      setError(null);
      return;
    }

    const t0 = performance.now();
    const rgb = hexToRgb(clean);
    if (!rgb) {
      setError(`Invalid Hex color "${hex}". Enter a valid 3 or 6 digit hex code (e.g. #FF5733).`);
      setMatches([]);
      return;
    }

    setError(null);
    const results = findNearestPantone(`#${clean}`, 5);
    setMatches(results);
    setExecTimeMs(Math.round((performance.now() - t0) * 100) / 100);
  }, []);

  useEffect(() => {
    resolvePantone(hexInput);
  }, [hexInput, resolvePantone]);

  const handleClear = () => {
    setHexInput('');
    setMatches([]);
    setError(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setHexInput(text.trim());
    } catch {
      // Fallback
    }
  };

  const handleCopyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopySummary = async () => {
    if (matches.length === 0) return;
    const best = matches[0];
    const summary = `Hex: ${formatHex(hexInput)} -> Best Pantone Match: ${best.pantone.name} (${best.pantone.code})
Pantone Hex: ${best.pantone.hex}
RGB: rgb(${best.pantone.rgb.join(', ')})
CMYK: cmyk(${best.pantone.cmyk.join('%, ')}%)
Match Fidelity: ${best.similarity}% (Delta-E: ${best.deltaE})`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // Fallback
    }
  };

  const formatHex = (val: string) => {
    const clean = val.replace(/^#/, '').trim();
    return clean ? `#${clean.toUpperCase()}` : '';
  };

  const primaryMatch = matches.length > 0 ? matches[0] : null;
  const inputRgb = hexToRgb(hexInput);
  const normalizedHex = inputRgb
    ? `#${inputRgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
    : '#000000';

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#05070c] shadow-lg dark:shadow-[0_0_50px_rgba(0,210,255,0.03)] overflow-hidden transition-colors duration-200">
      {/* ── Top Header & Palette Presets ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#080d19] px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Hex to Pantone (PMS) Matcher
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-[#00D2FF] border border-cyan-500/20">
            Perceptual Euclidean ΔE
          </span>
        </div>

        {/* Preset Quick-Click Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
            Quick samples:
          </span>
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.hex}
              type="button"
              onClick={() => setHexInput(preset.hex)}
              title={preset.name}
              className="group flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:text-orange-500 dark:hover:border-[#00D2FF] dark:hover:text-[#00D2FF] transition cursor-pointer"
            >
              <span
                className="h-2.5 w-2.5 rounded-full border border-black/10 shadow-2xs"
                style={{ backgroundColor: preset.hex }}
              />
              <span className="hidden md:inline">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Dual-Pane Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800/80">
        {/* Left Column (5 Cols): Hex Input & Controls */}
        <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between bg-white dark:bg-[#05070c]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Input Hex Color
              </label>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePaste}
                  title="Paste hex from clipboard"
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

            {/* Hex Input Box with Integrated Native Color Picker */}
            <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070b14] px-3 py-2 focus-within:border-orange-500 dark:focus-within:border-[#00D2FF] transition">
              {/* Native Color Picker Trigger */}
              <div className="relative mr-3 flex items-center justify-center">
                <input
                  type="color"
                  value={inputRgb ? normalizedHex : '#000000'}
                  onChange={(e) => setHexInput(e.target.value.toUpperCase())}
                  className="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer"
                  title="Click to open visual color picker"
                />
                <div
                  className="h-8 w-8 rounded-lg border-2 border-white dark:border-slate-800 shadow-sm transition-transform hover:scale-105 cursor-pointer flex items-center justify-center"
                  style={{ backgroundColor: inputRgb ? normalizedHex : '#94a3b8' }}
                >
                  <Pipette className="h-3.5 w-3.5 text-white/80 drop-shadow" />
                </div>
              </div>

              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                placeholder="#00D2FF or 3b82f6..."
                maxLength={9}
                className="w-full bg-transparent font-mono text-base font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none uppercase"
              />
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Input Color Breakdown Card */}
            {inputRgb && (
              <div className="mt-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#070b14] p-4 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Normalized Hex:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{normalizedHex}</span>
                </div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">RGB Channels:</span>
                  <span className="text-slate-900 dark:text-white">rgb({inputRgb.join(', ')})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Calculation Speed:</span>
                  <span className="text-emerald-600 dark:text-[#00D2FF] font-semibold">{execTimeMs} ms</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Matches calibrated against standard Pantone Matching System (PMS) coated formula guide.
          </div>
        </div>

        {/* Right Column (7 Cols): Side-by-Side Swatch & Matched Pantone Cards */}
        <div className="lg:col-span-7 p-4 sm:p-6 bg-slate-50/30 dark:bg-[#05070c] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Visual Swatch Comparison &amp; PMS Result
              </span>

              {primaryMatch && (
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer ${
                    copiedAll
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : 'bg-[#FF8A00] dark:bg-[#00D2FF] text-slate-950 hover:opacity-95 shadow-orange-500/20'
                  }`}
                >
                  {copiedAll ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied Summary!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Full Report</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Side-by-Side Visual Swatches */}
            {primaryMatch && inputRgb ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Input Swatch Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#080d19] shadow-sm">
                  <div
                    className="h-28 w-full transition-colors duration-200"
                    style={{ backgroundColor: normalizedHex }}
                  />
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Input Color
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {normalizedHex}
                    </h4>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                      rgb({inputRgb.join(', ')})
                    </p>
                  </div>
                </div>

                {/* Matched Pantone Authentic Swatch Chip */}
                <div className="overflow-hidden rounded-2xl border-2 border-orange-500/30 dark:border-[#00D2FF]/40 bg-white dark:bg-[#080d19] shadow-md relative">
                  {/* Match Similarity Badge */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 text-white px-2.5 py-0.5 text-[11px] font-black shadow-xs">
                      {primaryMatch.similarity}% Match
                    </span>
                  </div>

                  <div
                    className="h-28 w-full transition-colors duration-200"
                    style={{ backgroundColor: primaryMatch.pantone.hex }}
                  />
                  <div className="p-4 bg-white dark:bg-[#070b14]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF8A00] dark:text-[#00D2FF]">
                      PANTONE® MATCH
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                      {primaryMatch.pantone.code}
                    </h4>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {primaryMatch.pantone.name}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Hex: {primaryMatch.pantone.hex}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(primaryMatch.pantone.code, 'primary')}
                        className="text-[11px] font-bold text-orange-600 dark:text-[#00D2FF] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        {copiedCode === 'primary' ? 'Copied' : 'Copy PMS'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center text-slate-400">
                <Layers className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-xs">Enter a Hex code on the left to see live Pantone side-by-side swatches.</p>
              </div>
            )}

            {/* Runner-up Matches List */}
            {matches.length > 1 && (
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Closest Alternative Pantone Shades
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {matches.slice(1).map((m, idx) => (
                    <div
                      key={m.pantone.code}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#080d19] p-2.5 text-xs transition hover:border-slate-300 dark:hover:border-slate-700"
                    >
                      <div
                        className="h-9 w-9 rounded-lg shrink-0 border border-black/10 shadow-2xs"
                        style={{ backgroundColor: m.pantone.hex }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {m.pantone.code}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {m.similarity}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          Hex: {m.pantone.hex}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(m.pantone.code, `alt-${idx}`)}
                        className="text-[10px] font-semibold text-slate-500 hover:text-orange-500 dark:hover:text-[#00D2FF] px-1.5 py-1 rounded cursor-pointer"
                        title="Copy code"
                      >
                        {copiedCode === `alt-${idx}` ? 'Copied' : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-orange-500 dark:text-[#00D2FF]" />
              <span>Instant client color matching</span>
            </div>
            {primaryMatch && (
              <span>RGB: {primaryMatch.pantone.rgb.join(', ')} · CMYK: {primaryMatch.pantone.cmyk.join('%, ')}%</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
