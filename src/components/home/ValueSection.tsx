import { Zap, ShieldCheck, Cpu, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    color: 'text-amber-500',
    title: 'Zero Latency & 100% Free',
    description:
      'Every tool executes client-side or on dedicated Edge workers. No paywalls, no credits, no surprise subscriptions.',
  },
  {
    icon: Cpu,
    color: 'text-[#0092c7]',
    title: 'Schema-Driven Engine',
    description:
      'All utilities are dynamic and rendered directly from MongoDB schemas. New tools launch instantly without code redeployment.',
  },
  {
    icon: Sparkles,
    color: 'text-indigo-600',
    title: 'Engineered for Builders',
    description:
      'From formatting data to testing neural prompts, each workflow is crafted for maximum speed, simplicity, and accuracy.',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-600',
    title: 'Privacy & Client-Side First',
    description:
      'Your snippets, data, and converted code stay in your browser. Sensitive documents never leave your local session.',
  },
];

export function ValueSection() {
  return (
    <section className="bg-white border-t border-slate-100 px-6 py-24" id="values">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            Why{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-[#0092c7] bg-clip-text text-transparent">
              AIIsEverything?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-600">
            Built for developers, writers, students, and businesses navigating an AI-first world.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 shadow-xs transition-all duration-300 hover:bg-white hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div>
                  <div
                    className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs ${feat.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500">
                    {feat.description}
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
