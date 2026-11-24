import type { Metadata } from 'next';
import Link from 'next/link';
import { getProperties } from '@/lib/properties';
import { toPropertyCard } from '@/lib/property-display';
import PropertiesBrowser from '@/components/property/PropertiesBrowser';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Properties',
  description: 'Land, residential and commercial property in Lagos and beyond. Compare prices, locations and payment plans.',
  openGraph: {
    title: 'Properties | PropertyJar Realty Ltd',
    description: 'Land, residential and commercial property in Lagos and beyond.',
    url: 'https://propertyjarrealty.com/properties',
  },
  alternates: { canonical: 'https://propertyjarrealty.com/properties' },
};

export default async function PropertiesPage() {
  const properties = await getProperties();
  const cards = properties.map(toPropertyCard);

  return (
    <main className="shell pb-16 pt-14 lg:pt-20">
      <header>
        <p className="eyebrow text-muted">Property collection</p>
        <h1 className="mt-5 text-[40px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[52px]">
          Space for your next chapter.
        </h1>
        <p className="mt-6 text-lg text-muted">Land, residential and commercial property in Lagos and beyond.</p>
      </header>

      <div className="mt-14">
        <PropertiesBrowser properties={cards} />
      </div>

      <section className="mt-20 flex flex-col gap-4 bg-panel px-6 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <h2 className="text-2xl font-medium tracking-[-0.01em]">Not sure where to begin?</h2>
        <Link href="/contact" className="font-medium text-brand hover:underline hover:underline-offset-4 sm:mr-40">
          Talk to our team →
        </Link>
      </section>
    </main>
  );
}
