'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does instant WASM execution guarantee snippet privacy?',
    answer:
      'All code converters, formatters, and transpilers run within a secure WebAssembly (WASM) browser runtime. Your source code, JSON schemas, and confidential queries are processed in your local browser memory and never transmitted to external servers or logged in telemetry databases.',
  },
  {
    question: 'Are code conversions deterministic or AI-generated?',
    answer:
      'We combine formal Abstract Syntax Tree (AST) transpilers with neural heuristics. Where deterministic conversion is mandatory (such as CSS to HTML structure, JSON to YAML, and TypeScript interfaces), standard AST parsers ensure 100% syntactic correctness without hallucinations.',
  },
  {
    question: 'What is the maximum token count for the Prompt Optimizer?',
    answer:
      'The Prompt Optimizer uses a high-speed Byte-Pair Encoding (BPE) tokenizer capable of parsing prompt payloads up to 128k tokens in real-time, analyzing token density, redundant stopwords, and context utilization.',
  },
  {
    question: 'Can I integrate these developer utilities into local CLI workflows?',
    answer:
      'Yes. Our backend provides open REST endpoints with standard JSON specifications, and we provide headless CLI scripts for embedding in GitHub Actions, pre-commit hooks, and terminal scripts.',
  },
  {
    question: 'Do I need an account or API key to use these tools?',
    answer:
      'No. The entire suite of developer utilities, AST converters, and prompt optimization rudders is completely open with zero signup barriers, paywalls, or rate-limiting credit systems.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white border-t border-slate-200/80 px-6 sm:px-8 lg:px-12 py-24 sm:py-28" id="faqs">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-mono text-orange-600 shadow-xs">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>KNOWLEDGE MATRIX</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base text-slate-600">
            Everything you need to know about our privacy-first local architecture and tooling suite.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer transition hover:bg-slate-50/60"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-orange-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-4 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
