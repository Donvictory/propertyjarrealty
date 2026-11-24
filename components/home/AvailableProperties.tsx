import Link from 'next/link';
import { getProperties } from '@/lib/properties';
import { toPropertyCard, type PropertyCardData } from '@/lib/property-display';
import Reveal from '@/components/motion/Reveal';
import PropertyCarousel from './PropertyCarousel';

async function loadCards(): Promise<PropertyCardData[] | null> {
  try {
    const properties = await getProperties();
    return properties.map(toPropertyCard);
  } catch (err) {
    console.error('[home] Failed to load properties', err);
    return null;
  }
}

export default async function AvailableProperties() {
  const cards = await loadCards();

  return (
    <section className="shell py-20 lg:py-28">
      <Reveal from="left">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-4xl font-medium tracking-[-0.02em] lg:text-5xl">Find your next address.</h2>
          <Link
            href="/properties"
            className="inline-flex h-11 shrink-0 items-center self-start border border-line px-5 text-sm font-medium btn-fill btn-ink sm:self-auto"
          >
            View all properties
          </Link>
        </div>
      </Reveal>

      <Reveal from="right" className="mt-10">
        {cards && cards.length > 0 ? (
          <PropertyCarousel properties={cards} />
        ) : (
          <div className="rounded-xl bg-panel px-6 py-12 text-center">
            <p className="text-lg font-medium">Listings are being updated.</p>
            <p className="mt-2 text-sm text-muted">
              Tell us what you are looking for and we will share what is available.{' '}
              <Link href="/contact" className="text-brand underline underline-offset-4">
                Contact the team
              </Link>
            </p>
          </div>
        )}
      </Reveal>
    </section>
  );
}
