import Link from 'next/link';
import Reveal from '@/components/motion/Reveal';
import HeroVideo from './HeroVideo';

export default function HomeHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden bg-ink text-paper">
      <HeroVideo />
      {/* Scrims keep the copy readable over any frame of footage. */}
      <div aria-hidden className="absolute inset-0 bg-ink/45" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/80 to-transparent" />

      <div className="shell relative flex flex-1 flex-col pb-10 pt-14 lg:pt-16">
        <p className="eyebrow text-paper/80">PropertyJar Realty / Lagos</p>

        <div className="flex flex-1 items-center py-16">
          <Reveal from="left" className="max-w-2xl">
            <h1 className="text-[44px] font-medium leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[80px]">
              A place to own.
              <br />
              A plan to grow.
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-paper/85 sm:text-lg">
              Land, homes and commercial property.
              <br className="hidden sm:block" /> Clear terms, from your first enquiry to allocation.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/properties"
                className="inline-flex h-12 items-center bg-brand px-8 text-sm font-medium text-white btn-fill btn-brand"
              >
                Explore properties
              </Link>
              <Link
                href="/campaign"
                className="inline-flex h-12 items-center border border-paper/40 px-8 text-sm font-medium text-paper btn-fill btn-paper"
              >
                Investment options
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="flex items-center justify-between border-t border-paper/20 pt-6">
          <p className="eyebrow text-paper/75">01 / Property, with a clear plan</p>
          <p className="eyebrow hidden text-paper/60 sm:block">Scroll ↓</p>
        </div>
      </div>
    </section>
  );
}
