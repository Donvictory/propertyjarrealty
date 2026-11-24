import Image from 'next/image';
import Link from 'next/link';
import FavouriteButton from './FavouriteButton';
import type { Currency } from '@/lib/currency';
import { formatCardPrice, type PropertyCardData } from '@/lib/property-display';

type Props = {
  property: PropertyCardData;
  currency?: Currency;
  /** "compact" = home carousel (kind / location on one line); "full" = listing grid. */
  variant?: 'compact' | 'full';
  sizes?: string;
};

export default function PropertyCard({ property: p, currency = 'NGN', variant = 'full', sizes }: Props) {
  const href = `/campaign/${p.id}`;
  const full = variant === 'full';

  return (
    <article className="group flex h-full flex-col border border-line p-4 transition-colors duration-300 hover:border-ink/40 sm:p-5">
      {/* Image and favourite are siblings: a link can't contain another link. */}
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-[3/2] overflow-hidden bg-panel">
          <Image
            src={p.image}
            alt=""
            fill
            sizes={sizes ?? '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw'}
            unoptimized={p.image.endsWith('.svg')}
            className="rounded-none object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </Link>
        {/* Wrapper does the positioning: btn-fill sets position:relative on the button itself. */}
        <span className="absolute right-3 top-3">
          <FavouriteButton propertyId={p.id} title={p.title} />
        </span>
      </div>

      <p className="eyebrow mt-5 text-muted">{full ? p.kind : `${p.kind} / ${p.location}`}</p>
      <h3 className={`font-medium tracking-[-0.01em] ${full ? 'mt-3 text-[22px]' : 'mt-2 text-2xl'}`}>
        <Link href={href} className="hover:text-brand">
          {p.title}
        </Link>
      </h3>
      {full && <p className="eyebrow mt-2 text-muted">{p.location}</p>}
      <p className={`text-lg font-medium ${full ? 'mt-4' : 'mt-1'}`}>
        <span className="font-normal text-muted">Price: </span>
        <span className="text-brand">{formatCardPrice(p, currency)}</span>
      </p>
      <p className={`min-h-5 text-sm text-muted ${full ? 'mt-2' : 'mt-1'}`}>{p.details}</p>

      <div className="mt-auto pt-6">
        <Link
          href={href}
          className="btn-fill btn-ink flex h-11 w-full items-center justify-center border border-line px-4 text-sm font-medium"
        >
          View property
        </Link>
      </div>
    </article>
  );
}
