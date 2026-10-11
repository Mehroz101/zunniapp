import { Zap, ShieldCheck, Cpu, Code2 } from 'lucide-react';

const PILLARS = [
  {
    icon: Zap,
    color: 'text-[#0092c7]',
    title: 'Sub-Millisecond Edge WASM',
    description:
      'Every converter and transcoder compiles directly inside the client sandbox using WebAssembly. Instantaneous results with zero network hops.',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-600',
    title: 'Zero Server Logging & Telemetry',
    description:
      'Your snippets, confidential JSON schemas, and code logic never leave your machine. No storage, no telemetry tracking, complete data privacy.',
  },
  {
    icon: Cpu,
    color: 'text-indigo-600',
    title: 'Deterministic AST Compilers',
    description:
      'Rather than relying purely on hallucination-prone models, our tools use formal syntax tree parsers to guarantee bug-free structural output.',
  },
  {
    icon: Code2,
    color: 'text-purple-600',
    title: 'Open Ecosystem Protocols',
    description:
      'Structured on schema-driven definitions. Build your own custom transformers or connect your local development workflow effortlessly.',
  },
];

export function ValueSection() {
  return (
    <section className="bg-slate-50/60 bg-dot-pattern border-t border-slate-200/80 px-6 sm:px-8 lg:px-12 py-24 sm:py-28" id="values">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-14 text-center">
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-mono text-[#0092c7] shadow-xs">
            <span>ENGINEERING FOUNDATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950">
            Architecture Designed for{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-[#0092c7] bg-clip-text text-transparent">
              Speed & Precision
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-600">
            A minimalist execution environment engineered for senior developers and AI researchers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 ${pillar.color} group-hover:bg-[#00D2FF]/10 transition`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 transition group-hover:text-indigo-600">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-500">
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
