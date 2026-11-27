import Link from 'next/link';
import HeroReveal from '@/components/motion/HeroReveal';
import HeroVideo from './HeroVideo';

export default function HomeHero() {
  return (
    <section className="stay-dark relative isolate flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden bg-ink text-paper">
      <HeroVideo />
      {/* Scrims keep the copy readable over any frame of footage. */}
      <div aria-hidden className="absolute inset-0 bg-ink/45" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/80 to-transparent" />

      <div className="shell relative flex flex-1 flex-col pb-10 pt-14 lg:pt-16">
        <div className="flex flex-1 items-center py-16">
          <HeroReveal className="max-w-3xl">
            <h1 className="text-[34px] leading-[1.04] sm:text-5xl lg:text-[68px]">
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
                className="inline-flex h-12 items-center bg-brand px-8 text-sm font-medium text-on-brand btn-fill btn-brand"
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
          </HeroReveal>
        </div>

      </div>
    </section>
  );
}
