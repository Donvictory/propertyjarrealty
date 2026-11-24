import { House, MessageSquareMore, Search, Wallet } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';

/** House with a small magnifier: lucide has no "house search" icon in this version. */
function HouseSearchIcon() {
  return (
    <span className="relative inline-block h-6 w-6" aria-hidden>
      <House size={24} strokeWidth={1.5} />
      <Search size={12} strokeWidth={2.25} className="absolute -bottom-0.5 -right-1" />
    </span>
  );
}

const STEPS = [
  {
    icon: <HouseSearchIcon />,
    title: 'Find a property',
    body: 'Browse openly. Save a shortlist when you sign in.',
    tone: 'bg-sage-100',
    indent: '',
  },
  {
    icon: <MessageSquareMore size={24} strokeWidth={1.5} aria-hidden />,
    title: 'Ask and inspect',
    body: 'Send an enquiry. Arrange a site visit with our team.',
    tone: 'bg-sage-200',
    indent: 'sm:ml-10 lg:ml-14',
  },
  {
    icon: <Wallet size={24} strokeWidth={1.5} aria-hidden />,
    title: 'Choose your plan',
    body: 'Review the terms and pay a deposit on the site.',
    tone: 'bg-sage-300',
    indent: 'sm:ml-20 lg:ml-28',
  },
];

export default function Steps() {
  return (
    <section className="shell py-16 lg:py-20">
      <Reveal from="left">
        <h2 className="max-w-xl text-4xl font-medium leading-[1.1] tracking-[-0.02em] lg:text-[44px]">
          Three steps, with someone to guide you.
        </h2>
      </Reveal>

      <ol className="mt-10 space-y-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className={s.indent}>
            <Reveal from="right" delay={i * 0.12}>
              <div
                className={`group grid items-center gap-x-6 gap-y-3 px-5 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1.6fr)] sm:px-7 lg:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.6fr)] ${s.tone}`}
              >
                <span className="icon-fill h-12 w-12 text-brand [--fill-bg:var(--color-brand)] [--fill-fg:#fff]">
                  {s.icon}
                </span>
                <h3 className="text-2xl font-medium tracking-[-0.01em]">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink/70 sm:text-[15px]">{s.body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
