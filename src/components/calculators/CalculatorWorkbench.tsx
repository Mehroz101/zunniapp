'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  Copy,
  Check,
  Share2,
  Calculator,
  ChevronDown,
  Info,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { CALCULATORS_REGISTRY, type CalculatorDefinition } from '@/lib/config/calculators';

interface CalculatorWorkbenchProps {
  slug: string;
  calculator?: CalculatorDefinition;
}

export function CalculatorWorkbench({ slug, calculator: propCalc }: CalculatorWorkbenchProps) {
  const calculator = propCalc || CALCULATORS_REGISTRY[slug];

  // Initialize input state with defaults
  const initialInputs = useMemo(() => {
    if (!calculator) return {};
    const map: Record<string, any> = {};
    calculator.fields.forEach((f) => {
      map[f.id] = f.defaultValue;
    });
    return map;
  }, [calculator]);

  const [inputs, setInputs] = useState<Record<string, any>>(initialInputs);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Synchronize inputs if calculator slug changes
  useEffect(() => {
    setInputs(initialInputs);
  }, [initialInputs]);

  if (!calculator) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold">Calculator not found</h2>
        <Link href="/calculators" className="text-orange-500 hover:underline mt-2 inline-block">
          Return to Calculators Directory
        </Link>
      </div>
    );
  }

  // Execute mathematical calculation
  const result = useMemo(() => {
    try {
      return calculator.calculate(inputs);
    } catch {
      return {
        primaryValue: 'Calculation Pending',
        primaryLabel: 'Result',
        primarySubtext: 'Please adjust input fields',
        summary: [],
        breakdown: [],
      };
    }
  }, [calculator, inputs]);

  // Handle single input change
  const handleChange = (id: string, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Reset to default
  const handleReset = () => {
    setInputs(initialInputs);
  };

  // Copy result summary to clipboard
  const handleCopySummary = async () => {
    const lines = [
      `== ${calculator.title} Summary ==`,
      `${result.primaryLabel}: ${result.primaryValue}`,
      result.primarySubtext ? `(${result.primarySubtext})` : '',
      '',
      ...result.summary.map((s) => `${s.label}: ${s.value}`),
      '',
      `Calculated on AiTools Studio (${window.location.href})`,
    ].filter(Boolean);

    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFinancial = calculator.category === 'financial';

  return (
    <div className="w-full">
      {/* ── Breadcrumb & Navigation Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <Link
          href="/calculators"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Calculators</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {calculator.categoryLabel}
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-semibold">
            ● INSTANT WASM ENGINE
          </span>
        </div>
      </div>

      {/* ── Calculator Header ── */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
          {calculator.title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          {calculator.description}
        </p>
      </div>

      {/* ── Main Dual-Pane Workbench Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* ── Left Column: Inputs & Variables ── */}
        <div className="lg:col-span-6 xl:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Calculator className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-slate-950 dark:text-white">Input Parameters</h2>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
              title="Reset all fields to defaults"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-6">
            {calculator.fields.map((field) => {
              const val = inputs[field.id] ?? field.defaultValue;

              return (
                <div key={field.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={field.id}
                      className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200"
                    >
                      {field.label}
                    </label>
                    {field.type === 'slider' && (
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {val} {field.unit}
                      </span>
                    )}
                  </div>

                  {field.type === 'slider' ? (
                    <div className="space-y-2">
                      <input
                        id={field.id}
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step || 1}
                        value={val}
                        onChange={(e) => handleChange(field.id, Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500">
                        <span>{field.min} {field.unit}</span>
                        <span>{field.max} {field.unit}</span>
                      </div>
                    </div>
                  ) : field.type === 'select' ? (
                    <div className="relative">
                      <select
                        id={field.id}
                        value={val}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-amber-500 dark:focus:border-amber-400 transition"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="relative flex items-center">
                      <input
                        id={field.id}
                        type={typeof field.defaultValue === 'number' ? 'number' : 'text'}
                        value={val}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        onChange={(e) =>
                          handleChange(
                            field.id,
                            typeof field.defaultValue === 'number' ? Number(e.target.value) : e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 px-4 py-3 text-sm font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-amber-500 dark:focus:border-amber-400 transition"
                      />
                      {field.unit && (
                        <span className="absolute right-3.5 text-xs font-mono font-semibold text-slate-400 dark:text-slate-500">
                          {field.unit}
                        </span>
                      )}
                    </div>
                  )}

                  {field.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {field.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right Column: Results & Telemetry ── */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-6">
          {/* Primary Highlight Metric Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 p-6 sm:p-8 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-3">
              <span className="uppercase tracking-wider font-semibold">{result.primaryLabel}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Instant
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-950 dark:text-white">
              {result.primaryValue}
            </div>

            {result.primarySubtext && (
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                {result.primarySubtext}
              </p>
            )}

            {/* Visual Breakdown Progress Bar */}
            {result.breakdown && result.breakdown.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <span>Proportional Breakdown</span>
                  <span className="font-mono text-[11px]">100% Total</span>
                </div>

                <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  {result.breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${Math.max(4, item.percentage)}%` }}
                      className={`h-full ${item.color || 'bg-amber-500'} transition-all duration-300`}
                      title={`${item.label}: ${item.percentage}%`}
                    />
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-600 dark:text-slate-400">
                  {result.breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color || 'bg-amber-500'}`} />
                      <span>{item.label}:</span>
                      <strong className="font-mono text-slate-900 dark:text-slate-200">{item.amount || `${item.percentage}%`}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Copy / Export Action Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopySummary}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2.5 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Summary Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Summary</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Detailed Summary Data Table */}
          {result.summary && result.summary.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-xs">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 font-bold">
                Analytical Summary
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {result.summary.map((row, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{row.label}</span>
                    <span className="font-mono font-bold text-slate-950 dark:text-white">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Below the Fold: Step-by-Step Formula Explanation ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-xs mb-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Mathematical Formula & Methodology</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Underlying equations and mathematical logic governing this engine</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {calculator.formulaSteps.map((fStep) => (
            <div
              key={fStep.step}
              className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-4"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold mb-1">
                Step 0{fStep.step}
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 mb-2">
                {fStep.title}
              </h3>
              <div className="my-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800">
                <code>{fStep.formula}</code>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {fStep.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Below the Fold: 3-Step Practical Usage Guide ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-xs mb-10">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white mb-6">How to Use This Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {calculator.usageGuide.map((uStep) => (
            <div key={uStep.step} className="space-y-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-bold font-mono">
                {uStep.step}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{uStep.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{uStep.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Below the Fold: Semantic FAQ Accordion for Programmatic SEO ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {calculator.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 transition"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
