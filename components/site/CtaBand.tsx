import Link from 'next/link';
import Reveal from '@/components/motion/Reveal';

type Props = {
  title: React.ReactNode;
  body?: React.ReactNode;
  cta: { label: string; href: string; external?: boolean };
  /** "panel" (default) for inner pages; "sage" with a larger heading for the home page. */
  tone?: 'panel' | 'sage';
};

/** The closing banner used at the bottom of most pages. */
export default function CtaBand({ title, body, cta, tone = 'panel' }: Props) {
  const external = cta.external ?? cta.href.startsWith('http');
  const sage = tone === 'sage';
  return (
    <section
      className={`flex flex-col gap-8 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between ${
        sage ? 'bg-sage-200 lg:px-10 lg:py-14' : 'bg-panel lg:px-8 lg:py-12'
      }`}
    >
      <Reveal from="left" className="max-w-3xl">
        <h2
          className={`font-medium tracking-[-0.02em] ${
            sage ? 'text-4xl leading-[1.08] lg:text-[48px]' : 'text-3xl lg:text-[34px]'
          }`}
        >
          {title}
        </h2>
        {body && <div className="mt-4 text-sm leading-relaxed text-ink/85">{body}</div>}
      </Reveal>
      <Reveal from="right" className="shrink-0 self-start lg:self-auto">
        <Link
          href={cta.href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="btn-fill btn-brand inline-flex h-12 items-center bg-brand px-8 text-sm font-medium text-white lg:min-w-60"
        >
          {cta.label}
        </Link>
      </Reveal>
    </section>
  );
}
