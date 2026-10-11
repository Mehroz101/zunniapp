import { Zap, ShieldCheck, Cpu, Code2 } from 'lucide-react';

const PILLARS = [
  {
    icon: Zap,
    color: 'text-[#00D2FF]',
    title: 'Sub-Millisecond Edge WASM',
    description:
      'Every converter and transcoder compiles directly inside the client sandbox using WebAssembly. Instantaneous results with zero network hops.',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-400',
    title: 'Zero Server Logging & Telemetry',
    description:
      'Your snippets, confidential JSON schemas, and code logic never leave your machine. No storage, no telemetry tracking, complete data privacy.',
  },
  {
    icon: Cpu,
    color: 'text-indigo-400',
    title: 'Deterministic AST Compilers',
    description:
      'Rather than relying purely on hallucination-prone models, our tools use formal syntax tree parsers to guarantee bug-free structural output.',
  },
  {
    icon: Code2,
    color: 'text-purple-400',
    title: 'Open Ecosystem Protocols',
    description:
      'Structured on schema-driven definitions. Build your own custom transformers or connect your local development workflow effortlessly.',
  },
];

export function ValueSection() {
  return (
    <section className="bg-[#07090e] border-t border-white/[0.06] px-4 sm:px-6 lg:px-10 py-24 sm:py-28" id="values">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 text-center">
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-mono text-[#00D2FF]">
            <span>ENGINEERING FOUNDATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Architecture Designed for{' '}
            <span className="bg-gradient-to-r from-[#00D2FF] via-[#38bdf8] to-indigo-400 bg-clip-text text-transparent">
              Speed & Precision
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-400">
            A minimalist execution environment engineered for senior developers and AI researchers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#00D2FF]/40 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
              >
                <div>
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-[#00D2FF] group-hover:border-[#00D2FF]/40 group-hover:bg-[#00D2FF]/10 transition">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white transition group-hover:text-[#00D2FF]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-400">
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
