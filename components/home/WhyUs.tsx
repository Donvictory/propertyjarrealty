import { Bell, FileCheck, Wallet } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';

const REASONS = [
  {
    icon: FileCheck,
    title: 'Know what you are buying',
    body: 'Review location, plot size, title information and payment terms.',
  },
  {
    icon: Wallet,
    title: 'Choose how you pay',
    body: 'Compare outright and instalment options before committing.',
  },
  {
    icon: Bell,
    title: 'Stay informed',
    body: 'Keep your enquiries, saved properties and payments in one account.',
  },
];

export default function WhyUs() {
  return (
    <section className="bg-panel">
      <div className="shell grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-16 lg:py-16">
        <Reveal from="left">
          <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.02em] lg:text-[40px]">
            Details first.
            <br />
            Decisions after.
          </h2>
        </Reveal>

        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-8">
          {REASONS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="group">
              {/* Each reason travels on its own; later ones start further out and land after. */}
              <Reveal from="right" delay={i * 0.05} distance={1 + i * 0.25} className="h-full">
                <div className="border-t border-line pt-5">
                  <span className="icon-fill h-11 w-11 border border-line text-brand [--fill-bg:var(--color-brand)] [--fill-fg:#fff]">
                    <Icon size={20} strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-medium">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
