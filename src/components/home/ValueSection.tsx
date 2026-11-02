import { Zap, ShieldCheck, Cpu, Code2 } from 'lucide-react';

const PILLARS = [
  {
    icon: Zap,
    color: 'text-orange-500',
    title: 'Ultra-Low Latency Execution',
    description:
      'Every converter and utility executes instantly on your device. High-throughput performance with zero waiting and zero network roundtrips.',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-600',
    title: 'Complete Privacy & Security',
    description:
      'Your snippets, confidential schemas, and proprietary code logic never leave your device. Complete end-to-end client confidentiality.',
  },
  {
    icon: Cpu,
    color: 'text-orange-600',
    title: 'Deterministic Accuracy',
    description:
      'Engineered with formal syntax tree parsers and precision logic to guarantee reliable, production-ready output on every run.',
  },
  {
    icon: Code2,
    color: 'text-amber-600',
    title: 'Modern Developer Ergonomics',
    description:
      'Designed with intuitive keyboard workflows, copy-ready exports, and seamless integrations into your daily engineering toolchain.',
  },
];

export function ValueSection() {
  return (
    <section className="bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-200/80 dark:border-slate-800/80 px-6 sm:px-8 lg:px-12 py-20 sm:py-24 transition-colors duration-200" id="values">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-14 text-center">
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1 text-xs font-mono text-orange-600 dark:text-[#FF8A00] shadow-xs">
            <span>ENGINEERING FOUNDATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-slate-900 dark:text-slate-50">
            Architecture Designed for{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF8A00] bg-clip-text text-transparent">
              Speed &amp; Precision
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed text-[15px] sm:text-base">
            A minimalist execution environment engineered for senior developers and AI researchers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 shadow-xs transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-500/40 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 ${pillar.color} group-hover:bg-orange-500/10 transition`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold tracking-[-0.01em] text-slate-900 dark:text-slate-100 transition group-hover:text-orange-600 dark:group-hover:text-orange-400">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
