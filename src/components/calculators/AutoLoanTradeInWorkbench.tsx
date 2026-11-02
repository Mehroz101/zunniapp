'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Trash2,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronDown,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Info,
} from 'lucide-react';

export interface CmsCalculatorData {
  title?: string;
  description?: string;
  articleContent?: string;
  faqItems?: Array<{ question: string; answer: string }>;
}

interface AutoLoanTradeInWorkbenchProps {
  cmsData?: CmsCalculatorData | null;
}

export function AutoLoanTradeInWorkbench({ cmsData }: AutoLoanTradeInWorkbenchProps) {
  // ── 1. Reactive Input State with Precision Defaults ──
  const [tradeValue, setTradeValue] = useState<number>(15000);
  const [loanPayoff, setLoanPayoff] = useState<number>(11000);
  const [newPrice, setNewPrice] = useState<number>(32000);
  const [taxRate, setTaxRate] = useState<number>(6);
  const [downPayment, setDownPayment] = useState<number>(1000);

  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ── 2. Instant Mathematical Engine Execution ──
  const math = useMemo(() => {
    const vTrade = Math.max(0, Number(tradeValue) || 0);
    const bLoan = Math.max(0, Number(loanPayoff) || 0);
    const pNew = Math.max(0, Number(newPrice) || 0);
    const tRate = Math.max(0, Number(taxRate) || 0);
    const dCash = Math.max(0, Number(downPayment) || 0);

    // 1. Net Trade-In Equity (E_net)
    const eNet = vTrade - bLoan;
    const isPositiveEquity = eNet >= 0;

    // 2. Taxable Base Price (P_taxable)
    const pTaxable = Math.max(0, pNew - vTrade);

    // 3. Net Sales Tax Liability (T_net)
    const tNet = pTaxable * (tRate / 100);

    // 4. Sales Tax Dollars Saved via Trade Credit (T_saved)
    const tSaved = Math.min(pNew, vTrade) * (tRate / 100);

    // 5. Final Net Amount to Finance (P_financed)
    // When eNet is negative, subtracting a negative rolls over and adds the debt
    const pFinanced = Math.max(0, (pNew + tNet) - eNet - dCash);

    return {
      vTrade,
      bLoan,
      pNew,
      tRate,
      dCash,
      eNet,
      isPositiveEquity,
      pTaxable,
      tNet,
      tSaved,
      pFinanced,
    };
  }, [tradeValue, loanPayoff, newPrice, taxRate, downPayment]);

  // ── 3. Reset Handler ──
  const handleReset = () => {
    setTradeValue(15000);
    setLoanPayoff(11000);
    setNewPrice(32000);
    setTaxRate(6);
    setDownPayment(1000);
  };

  // ── 4. Clipboard Copy Summary ──
  const handleCopyResult = async () => {
    const lines = [
      '== Auto Loan Trade–In Equity Calculator Result ==',
      `Final Net Financed Principal: $${math.pFinanced.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `Net Trade-In Equity: ${math.isPositiveEquity ? '+' : '-'}$${Math.abs(math.eNet).toLocaleString('en-US', { minimumFractionDigits: 2 })} (${math.isPositiveEquity ? 'Positive Equity' : 'Underwater Rollover'})`,
      `Sales Tax Dollars Saved: $${math.tSaved.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      `Net Sales Tax Owed: $${math.tNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      `Taxable Base Price: $${math.pTaxable.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      `Dealer Trade-In Value: $${math.vTrade.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      `Current Loan Payoff: $${math.bLoan.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      `New Vehicle Price: $${math.pNew.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      `Cash Down Payment: $${math.dCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      '',
      `Calculated via FreeToolsStore (${typeof window !== 'undefined' ? window.location.href : 'https://freetoolsstore.online'})`,
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Default Editorial FAQ items
  const defaultFaqs = [
    {
      question: 'What is the difference between positive and negative equity on a trade-in?',
      answer:
        'Positive equity occurs when your vehicle market trade-in value exceeds your remaining auto loan payoff balance (Trade Value > Payoff). Positive equity acts like a cash down payment, directly decreasing the amount you need to borrow. Negative equity (being "underwater" or "upside-down") occurs when your loan payoff exceeds the dealer appraisal. This deficit is rolled over and added to your new vehicle loan, increasing your borrowing costs and total interest paid.',
    },
    {
      question: 'How does the state sales tax trade-in credit work?',
      answer:
        'In most US states (42+ states), sales tax is calculated only on the difference between the purchase price of the new car and the trade-in allowance (P_new - V_trade). For instance, on a $32,000 new vehicle with a $15,000 trade-in and a 6% tax rate, you only pay tax on $17,000 ($1,020 instead of $1,920). You directly save $900 in state sales taxes via the trade-in tax credit.',
    },
    {
      question: 'Can I trade in a vehicle if I am underwater on the loan?',
      answer:
        'Yes. Dealerships routinely roll negative equity into the financing of a new vehicle, subject to lender maximum Loan-to-Value (LTV) limits (typically 120% to 140%). However, rolling negative debt means you begin the new auto loan significantly underwater, pay interest on your prior vehicle debt, and should strongly consider GAP insurance to protect against total loss.',
    },
    {
      question: 'How do I obtain my accurate 10-day auto loan payoff balance?',
      answer:
        'Log in to your current auto lender account online or call their customer service to request an official "10-day loan payoff quote". This quote includes the remaining principal balance plus per diem interest calculated through the next 10 days, allowing sufficient time for the dealership to send the payoff check and release the vehicle title lien.',
    },
    {
      question: 'Is it better to trade in or sell my car privately?',
      answer:
        'A private party sale usually nets 10% to 20% higher market value than wholesale dealer appraisals. However, trading in saves significant time, eliminates advertising and stranger test drives, handles title transfer and loan payoff directly, and offers state sales tax credits that frequently close the pricing gap between wholesale and private party numbers.',
    },
  ];

  const activeFaqs = cmsData?.faqItems && cmsData.faqItems.length > 0 ? cmsData.faqItems : defaultFaqs;

  return (
    <div className="w-full">
      {/* ── BREADCRUMBS & TOP HEADER (UPPER FOLD) ── */}
      <div className="mb-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">
            Home
          </Link>
          <span className="text-slate-300 dark:text-slate-600">&gt;</span>
          <Link href="/calculators?tab=financial" className="hover:text-slate-900 dark:hover:text-white transition">
            Loans
          </Link>
          <span className="text-slate-300 dark:text-slate-600">&gt;</span>
          <span className="text-slate-900 dark:text-slate-200 font-semibold truncate">
            Auto Loan Trade–In Equity Calculator
          </span>
        </nav>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
          Auto Loan Trade–In Equity Calculator
        </h1>
        <p className="mt-3.5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-4xl font-normal leading-relaxed">
          Determines auto loan trade-in equity from relevant inputs and returns a dedicated result for borrowing and repayment planning.
        </p>
      </div>

      {/* ── DUAL-PANE INTERACTIVE WORKBENCH (UPPER FOLD MATCHING SPECIFICATION) ── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mb-16">
        {/* ── LEFT PANE: INPUT CARD ── */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c1220] p-6 sm:p-8 shadow-xs transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">
              Input
            </h2>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
              title="Reset all inputs to defaults"
              aria-label="Reset inputs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5">
            {/* 1. Dealer Trade-In Market Value ($) */}
            <div className="space-y-1.5">
              <label htmlFor="vTrade" className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                Dealer Trade–In Market Value ($) *
              </label>
              <div className="relative">
                <input
                  id="vTrade"
                  type="number"
                  min="0"
                  step="500"
                  value={tradeValue}
                  onChange={(e) => setTradeValue(Number(e.target.value))}
                  placeholder="15000"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/70 px-4 py-3 text-sm font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-orange-500 dark:focus:border-[#FF8A00] focus:ring-2 focus:ring-orange-500/10 transition"
                />
              </div>
            </div>

            {/* 2. Current Auto Loan Payoff Balance ($) */}
            <div className="space-y-1.5">
              <label htmlFor="bLoan" className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                Current Auto Loan Payoff Balance ($) *
              </label>
              <div className="relative">
                <input
                  id="bLoan"
                  type="number"
                  min="0"
                  step="500"
                  value={loanPayoff}
                  onChange={(e) => setLoanPayoff(Number(e.target.value))}
                  placeholder="11000"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/70 px-4 py-3 text-sm font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-orange-500 dark:focus:border-[#FF8A00] focus:ring-2 focus:ring-orange-500/10 transition"
                />
              </div>
            </div>

            {/* 3. New Vehicle Purchase Price ($) */}
            <div className="space-y-1.5">
              <label htmlFor="pNew" className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                New Vehicle Purchase Price ($) *
              </label>
              <div className="relative">
                <input
                  id="pNew"
                  type="number"
                  min="0"
                  step="500"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  placeholder="32000"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/70 px-4 py-3 text-sm font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-orange-500 dark:focus:border-[#FF8A00] focus:ring-2 focus:ring-orange-500/10 transition"
                />
              </div>
            </div>

            {/* 4. State Sales Tax Rate (%) */}
            <div className="space-y-1.5">
              <label htmlFor="tRate" className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                State Sales Tax Rate (%) *
              </label>
              <div className="relative">
                <input
                  id="tRate"
                  type="number"
                  min="0"
                  max="25"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  placeholder="6"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/70 px-4 py-3 text-sm font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-orange-500 dark:focus:border-[#FF8A00] focus:ring-2 focus:ring-orange-500/10 transition"
                />
              </div>
            </div>

            {/* 5. Additional Cash Down Payment ($) */}
            <div className="space-y-1.5">
              <label htmlFor="dCash" className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                Additional Cash Down Payment ($) *
              </label>
              <div className="relative">
                <input
                  id="dCash"
                  type="number"
                  min="0"
                  step="100"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  placeholder="1000"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/70 px-4 py-3 text-sm font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-orange-500 dark:focus:border-[#FF8A00] focus:ring-2 focus:ring-orange-500/10 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANE: RESULT CARD ── */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c1220] p-6 sm:p-8 shadow-xs flex flex-col justify-between transition-all">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">
                Result
              </h2>

              <button
                type="button"
                onClick={handleCopyResult}
                className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 text-xs font-semibold tracking-tight transition active:scale-95 shadow-xs flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>
            </div>

            {/* Inner Result Display Canvas */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/50 p-5 sm:p-6 mb-6">
              {/* Primary Financed Amount */}
              <div className="text-center sm:text-left">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                  Final Net Amount to Finance
                </span>
                <div className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
                  ${math.pFinanced.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold font-mono border ${
                      math.isPositiveEquity
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
                    }`}
                  >
                    {math.isPositiveEquity ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>
                      {math.isPositiveEquity ? '+' : '-'}${Math.abs(math.eNet).toLocaleString('en-US', { minimumFractionDigits: 2 })} (
                      {math.isPositiveEquity ? 'Positive Equity Applied' : 'Underwater Rolled into Loan'})
                    </span>
                  </span>
                </div>
              </div>

              {/* 4 Metric Chips */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-200/70 dark:border-slate-800/70">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase block">
                    Sales Tax Saved
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    ${math.tSaved.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase block">
                    Net Sales Tax Owed
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                    ${math.tNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase block">
                    Taxable Base Price
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                    ${math.pTaxable.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase block">
                    Cash Down Payment
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                    -${math.dCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Itemized Ledger Table */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400">
                <span>New Vehicle Purchase Price:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">${math.pNew.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400">
                <span>Less Trade-In Market Credit:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">-${math.vTrade.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400">
                <span>Current Auto Loan Payoff (Debt):</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">+${math.bLoan.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400">
                <span>Net Sales Tax (after Trade Credit):</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">+${math.tNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400">
                <span>Cash Down Payment Applied:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">-${math.dCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between pt-2 font-bold text-sm text-slate-950 dark:text-white">
                <span>Total Amount to Finance:</span>
                <span className="text-orange-600 dark:text-[#FF8A00]">${math.pFinanced.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LOWER FOLD: DYNAMIC CMS EDITORIAL CONTENT WITH COMPLETE DO-FOLLOW LINK CONTROL ── */}
      <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 max-w-5xl mx-auto">
        {cmsData?.articleContent ? (
          /* Dynamic CMS Managed Body */
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: cmsData.articleContent }}
          />
        ) : (
          /* Comprehensive Canonical Editorial Guide & Mathematical Reference */
          <div className="space-y-12 text-slate-700 dark:text-slate-300 leading-relaxed">
            {/* 1. Introduction */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-700 dark:text-[#FF8A00] border border-orange-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Financial Engineering Guide</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                How Auto Loan Trade-In Equity &amp; Financing Economics Work
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                When trading in a motor vehicle with an existing lien, your trade-in allowance does not simply get deducted from the sticker price. Instead, the transaction involves a dual-track accounting calculation: resolving the lienholder payoff on your current automobile and establishing the net capitalized cost of your new vehicle purchase.
              </p>
              <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                Whether you possess <strong className="text-slate-900 dark:text-slate-100">Positive Equity</strong> or are <strong className="text-slate-900 dark:text-slate-100">Underwater (Negative Equity)</strong> drastically alters your borrowing requirements, monthly payment schedule, and loan-to-value (LTV) risk. Use our companion{' '}
                <Link href="/calculators/loan-calculator" className="font-semibold text-orange-600 dark:text-[#FF8A00] underline hover:opacity-80">
                  Loan &amp; EMI Amortization Calculator
                </Link>{' '}
                to simulate exact amortization schedules once your net financed principal is established.
              </p>
            </div>

            {/* 2. The Sales Tax Advantage */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>The State Sales Tax Trade-In Advantage</span>
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                In over 42 US states, vehicle trade-ins enjoy a substantial tax shelter known as the <em>Trade-In Sales Tax Credit</em>. Instead of taxing the full retail MSRP ($P_{'{new}'}$), the state department of revenue taxes only the net purchase difference ($P_{'{taxable}'}$):
              </p>
              <div className="my-4 p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-slate-100">
                P_taxable = max(0, P_new - V_trade)
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                For example, if you purchase a new SUV for $32,000 and trade in your sedan for $15,000 at a 6.0% state tax rate, you only owe tax on the $17,000 difference ($1,020). Without the trade-in credit, you would owe $1,920. Trading in saves you <strong className="text-emerald-600 dark:text-emerald-400">$900.00 in cash</strong> on sales taxes alone.
              </p>
            </div>

            {/* 3. Mathematical Formula Walkthrough */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white tracking-tight">
                Mathematical Execution Formulas
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                The calculator evaluates the following deterministic system of equations in real time:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <div className="text-xs font-mono text-orange-600 dark:text-[#FF8A00] font-bold uppercase mb-1">
                    1. Net Trade Equity (E_net)
                  </div>
                  <div className="font-mono text-sm text-slate-900 dark:text-white font-semibold">
                    E_net = V_trade - B_loan
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    If positive, subtracted from loan. If negative, added to loan debt.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <div className="text-xs font-mono text-orange-600 dark:text-[#FF8A00] font-bold uppercase mb-1">
                    2. Net Sales Tax Liability (T_net)
                  </div>
                  <div className="font-mono text-sm text-slate-900 dark:text-white font-semibold">
                    T_net = max(0, P_new - V_trade) * (Tax_rate / 100)
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Actual state tax assessed after applying trade allowance.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <div className="text-xs font-mono text-orange-600 dark:text-[#FF8A00] font-bold uppercase mb-1">
                    3. Sales Tax Dollars Saved (T_saved)
                  </div>
                  <div className="font-mono text-sm text-slate-900 dark:text-white font-semibold">
                    T_saved = min(P_new, V_trade) * (Tax_rate / 100)
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Direct cash savings generated by your trade-in tax shelter.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <div className="text-xs font-mono text-orange-600 dark:text-[#FF8A00] font-bold uppercase mb-1">
                    4. Final Financed Principal (P_financed)
                  </div>
                  <div className="font-mono text-sm text-slate-900 dark:text-white font-semibold">
                    P_financed = (P_new + T_net) - E_net - D_cash
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Total debt borrowed through auto lender.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Comparison Table: Trade-In vs Private Party Sale */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white tracking-tight mb-4">
                Strategic Decision Matrix: Dealer Trade-In vs. Private Party Sale
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3 sm:p-4">Decision Metric</th>
                      <th className="p-3 sm:p-4">Dealer Trade-In</th>
                      <th className="p-3 sm:p-4">Private Party Sale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      <td className="p-3 sm:p-4 font-semibold text-slate-900 dark:text-slate-200">Gross Sale Price</td>
                      <td className="p-3 sm:p-4 text-slate-600 dark:text-slate-400">Wholesale appraisal (typically 10-15% lower)</td>
                      <td className="p-3 sm:p-4 text-emerald-600 dark:text-emerald-400 font-medium">Retail value (typically 10-15% higher)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      <td className="p-3 sm:p-4 font-semibold text-slate-900 dark:text-slate-200">Sales Tax Credit</td>
                      <td className="p-3 sm:p-4 text-emerald-600 dark:text-emerald-400 font-medium">Yes — Saves up to $1,000+ in state taxes</td>
                      <td className="p-3 sm:p-4 text-slate-600 dark:text-slate-400">No sales tax credit in most jurisdictions</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      <td className="p-3 sm:p-4 font-semibold text-slate-900 dark:text-slate-200">Loan Payoff Process</td>
                      <td className="p-3 sm:p-4 text-emerald-600 dark:text-emerald-400 font-medium">Instant — Dealership pays off lender directly</td>
                      <td className="p-3 sm:p-4 text-slate-600 dark:text-slate-400">Complex — Buyer must wait for title release</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      <td className="p-3 sm:p-4 font-semibold text-slate-900 dark:text-slate-200">Transaction Time</td>
                      <td className="p-3 sm:p-4 text-emerald-600 dark:text-emerald-400 font-medium">Immediate same-day execution</td>
                      <td className="p-3 sm:p-4 text-slate-600 dark:text-slate-400">2 to 6 weeks on average</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      <td className="p-3 sm:p-4 font-semibold text-slate-900 dark:text-slate-200">Negative Equity Option</td>
                      <td className="p-3 sm:p-4 text-slate-600 dark:text-slate-400">Rolled directly into new financing</td>
                      <td className="p-3 sm:p-4 text-rose-600 dark:text-rose-400">You must pay cash out-of-pocket to clear title</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Editorial Cross-Links */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-950 dark:text-white">
                  Explore More Financial &amp; Developer Tools
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Access our full collection of 20+ specialized financial models, AST transpilers, and utilities.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/calculators"
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 transition"
                >
                  All Calculators
                </Link>
                <Link
                  href="/tools"
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Code Converters
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── FAQ ACCORDION SECTION (UPPER & LOWER FOLD SEO) ── */}
        <div className="mt-14 pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-orange-600 dark:text-[#FF8A00]" />
              <span>Frequently Asked Questions</span>
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Essential answers regarding auto loan payoffs, trade allowances, and state tax exemptions.
            </p>
          </div>

          <div className="space-y-3">
            {activeFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 hover:text-orange-600 dark:hover:text-[#FF8A00] transition"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? 'rotate-180 text-orange-600 dark:text-[#FF8A00]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
