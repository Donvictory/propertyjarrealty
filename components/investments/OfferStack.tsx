import Link from 'next/link';
import { Check } from 'lucide-react';
import type { CampaignContent } from '@/lib/campaign';
import Reveal from '@/components/motion/Reveal';

type Offer = CampaignContent['offerStack'][number];

/** Order tiers by commitment so the stack rises left to right; unknown tiers keep their order at the end. */
function rank(title = '') {
  const t = title.toLowerCase();
  if (t.includes('entry')) return 0;
  if (t.includes('smart')) return 1;
  if (t.includes('elite')) return 2;
  return 3;
}

const TIER_STYLE = [
  { tile: 'bg-sage-100 text-ink', muted: 'text-ink/70', btn: 'border border-ink/25 btn-ink', height: 'lg:min-h-[400px]', blocks: 1 },
  { tile: 'bg-sage-300 text-ink', muted: 'text-ink/70', btn: 'bg-ink text-paper btn-accent', height: 'lg:min-h-[470px]', blocks: 3 },
  { tile: 'bg-brand text-on-brand', muted: 'text-on-brand/80', btn: 'bg-paper text-brand btn-ink', height: 'lg:min-h-[540px]', blocks: 5 },
  { tile: 'bg-panel text-ink', muted: 'text-muted', btn: 'border border-ink/25 btn-ink', height: 'lg:min-h-[400px]', blocks: 1 },
];

/** Stacked units glyph: one square per unit tier, echoing the site-plan plots. */
function Units({ count, light }: { count: number; light: boolean }) {
  return (
    <span aria-hidden className="flex flex-col-reverse gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`h-2.5 w-7 ${light ? 'bg-on-brand/80' : 'bg-brand'}`} />
      ))}
    </span>
  );
}

export default function OfferStack({ offers }: { offers: Offer[] }) {
  if (!offers || offers.length === 0) return null;
  const sorted = [...offers].sort((a, b) => rank(a.title) - rank(b.title));

  return (
    <section className="shell py-20 lg:py-28">
      <Reveal from="left">
        <h2 className="text-4xl font-medium tracking-[-0.02em] lg:text-5xl">Offer stack</h2>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">The more units you take, the more the offer builds.</p>
      </Reveal>

      <ol className="mt-12 grid items-end gap-4 md:grid-cols-3 lg:gap-5">
        {sorted.map((offer, i) => {
          const style = TIER_STYLE[Math.min(rank(offer.title), 3)];
          const light = style.tile.includes('text-on-brand');
          return (
            <li key={offer.title ?? i} className="h-full md:h-auto">
              <Reveal from={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.06} className="h-full">
                <article className={`flex h-full flex-col p-6 sm:p-8 ${style.tile} ${style.height}`}>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-medium tracking-[-0.01em]">{offer.title}</h3>
                    <Units count={style.blocks} light={light} />
                  </div>
                  <ul className="mt-8 space-y-3">
                    {(offer.points ?? []).map((p) => (
                      <li key={p} className="flex items-start gap-3 text-[15px]">
                        <Check size={18} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0" />
                        <span className={style.muted}>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-10">
                    <Link
                      href={`/contact?subject=${encodeURIComponent(`${offer.title ?? 'Investment'} offer`)}`}
                      className={`btn-fill flex h-12 w-full items-center justify-center text-sm font-medium ${style.btn}`}
                    >
                      Enquire about {offer.title}
                    </Link>
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
