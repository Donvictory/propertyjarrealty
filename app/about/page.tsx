import Image from 'next/image';
import Link from 'next/link';
import { Compass, Crown, Landmark, Zap } from 'lucide-react';
import PageIntro from '@/components/site/PageIntro';
import Reveal from '@/components/motion/Reveal';

const SPECIALISMS = [
  { icon: Landmark, title: 'Land banking', body: 'Strategic acquisition of high-growth land in developing corridors.' },
  { icon: Zap, title: 'Smart estates', body: 'Modern, tech-integrated communities designed for the next generation.' },
  { icon: Crown, title: 'Luxury apartments', body: 'Bespoke urban living spaces featuring world-class amenities.' },
  { icon: Compass, title: 'Off-plan opportunities', body: "Exclusive early-access to the city's most anticipated projects." },
];

const APPROACH = [
  { title: 'Structured investments', body: 'Financial modeling for clear entry and exit paths.' },
  { title: 'Verified properties', body: '100% legal clearance and documentation guaranteed.' },
  { title: 'Profitable exit strategies', body: 'Ensuring your ROI is realized through market-leading data.' },
];

export default function AboutPage() {
  return (
    <main>
      <div className="shell pt-14 lg:pt-20">
        <PageIntro
          eyebrow="About PropertyJar"
          title={
            <>
              Hi, I&rsquo;m Jaiyesinmi MA, founder of
              <br className="hidden lg:block" /> PropertyJar Realty Ltd.
            </>
          }
        />
      </div>

      {/* Founder spread: round photo over an offset brand circle, letter set like a magazine feature. */}
      <section className="shell mt-16 grid gap-14 pb-24 lg:mt-20 lg:grid-cols-12 lg:gap-12 lg:pb-32">
        <Reveal from="left" className="lg:col-span-5">
          <figure>
            <div className="relative pb-6 pl-6">
            <div aria-hidden className="absolute bottom-0 left-0 aspect-square w-[calc(100%-1.5rem)] rounded-full bg-brand" />
            <div className="relative aspect-square overflow-hidden rounded-full bg-panel">
              <Image
                src="/About-Image.jpeg"
                alt="Jaiyesinmi MA, Founder and CEO of PropertyJar Realty"
                fill
                priority
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="rounded-none object-cover object-[center_25%]"
              />
            </div>
            </div>
            <figcaption className="mt-6 flex items-baseline justify-between gap-4 pl-6">
              <span className="text-lg font-medium">Jaiyesinmi MA</span>
              <span className="text-sm text-muted">Founder &amp; CEO</span>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal from="right" className="lg:col-span-7 lg:pl-6">
          <p className="text-2xl font-medium leading-snug tracking-[-0.01em] lg:text-[32px] lg:leading-[1.25]">
            At PropertyJar Realty, we specialize in bridging the gap for UK-based and international investors looking
            to tap into the high-growth potential of the Lagos real estate market.
          </p>
          <div className="mt-10 gap-10 border-t border-line pt-8 text-[15px] leading-relaxed text-muted lg:columns-2 [&>p+p]:mt-5">
            <p>
              Our firm provides a sophisticated, data-driven approach to property acquisition, ensuring that every
              investment is backed by a clear entry and exit strategy tailored to long-term wealth preservation.
            </p>
            <p>
              We understand that investing from abroad requires an unparalleled level of trust and transparency. That
              is why we have built a reputation for excellence, offering seamless end-to-end guidance—from initial
              property identification to secure closing and management.
            </p>
            <p>
              Whether you are looking to diversify your portfolio into a fast-growing emerging market or seeking
              exclusive residential assets, we provide the local expertise and global standards necessary to navigate
              the Lagos landscape with absolute confidence. If you are ready for secure, premium real estate
              opportunities, you are in the right place.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Specialisms: dark band */}
      <section className="bg-ink text-paper">
        <div className="shell py-20 lg:py-24">
          <Reveal from="left">
            <h2 className="text-4xl font-medium tracking-[-0.02em] lg:text-5xl">We specialize in</h2>
            <p className="mt-5 max-w-lg leading-relaxed text-paper/70">
              Discover our core pillars of expertise in the Lagos real estate market, designed to maximize your
              investment potential.
            </p>
          </Reveal>
          {/* Frames stay put; each cell's content slides in on its own and settles into its frame. */}
          <ul className="mt-14 grid gap-px overflow-hidden bg-paper/15 sm:grid-cols-2 lg:grid-cols-4">
            {SPECIALISMS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="group bg-ink">
                <Reveal from="right" delay={(i % 4) * 0.04} distance={1 + (i % 4) * 0.2} className="h-full">
                  <div className="p-6 lg:p-8">
                    <span className="icon-fill h-12 w-12 border border-paper/25 text-paper [--fill-bg:var(--color-brand)] [--fill-fg:#fff]">
                      <Icon size={22} strokeWidth={1.5} aria-hidden />
                    </span>
                    <h3 className="mt-8 text-xl font-medium">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-paper/65">{body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The PropertyJar Way: centred statement over three principles */}
      <section className="shell py-24 lg:py-32">
        <Reveal from="left">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-muted">The PropertyJar Way</p>
            <h2 className="mt-5 text-4xl font-medium leading-[1.1] tracking-[-0.02em] lg:text-[52px]">
              Our approach is simple yet uncompromising.
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted">
              PropertyJar Realty Ltd is focused on helping local and international investors access high-growth
              property opportunities through a rigorous, verification-first model.
            </p>
          </div>
        </Reveal>
        <ul className="mt-16 grid overflow-hidden border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-line">
          {APPROACH.map((a, i) => (
            <li key={a.title} className="border-b border-line last:border-b-0 sm:border-b-0">
              <Reveal from={i === 0 ? 'left' : 'right'} delay={i * 0.04} distance={1 + i * 0.2} className="h-full">
                <div className="px-2 py-8 sm:px-8">
                  <h3 className="text-xl font-medium">{a.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{a.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Commitment: closing statement under the mark */}
      <section className="bg-sage-100">
        <div className="shell py-20 text-center lg:py-24">
          <Reveal from="left">
            <Image src="/brand/pjr-mark.png" alt="" width={64} height={64} className="mx-auto h-16 w-16 rounded-none" />
            <h2 className="mt-8 text-sm font-medium text-muted">Our commitment</h2>
            <blockquote className="mx-auto mt-5 max-w-3xl text-2xl font-medium leading-snug tracking-[-0.01em] lg:text-[34px] lg:leading-[1.25]">
              &ldquo;At PropertyJar Realty, we bridge the gap between global investors and the vibrant Lagos real
              estate market. Our mission is to provide transparency, security, and exceptional returns for every client
              we serve.&rdquo;
            </blockquote>
            <Link
              href="/contact"
              className="btn-fill btn-brand mt-10 inline-flex h-12 items-center bg-brand px-8 text-sm font-medium text-white"
            >
              Work with us
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
