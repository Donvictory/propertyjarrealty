import type { Metadata } from 'next';
import { getProperties } from '@/lib/properties';
import PropertiesClient from '@/components/PropertiesClient';

export const metadata: Metadata = {
  title: 'Exclusive Properties',
  description: "Browse our curated portfolio of world-class luxury properties across the world's most desirable locations. Filter by type, price, and location.",
  openGraph: {
    title: 'Exclusive Properties | PropertyJar Realty Ltd',
    description: 'Browse our curated portfolio of world-class luxury properties.',
    url: 'https://propertyjarrealty.com/properties',
    images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&h=630&fit=crop', width: 1200, height: 630, alt: 'PropertyJar Luxury Properties' }],
  },
  alternates: { canonical: 'https://propertyjarrealty.com/properties' },
};

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen pt-32 bg-off-white">
      <PropertiesClient properties={properties} />
    </main>
  );
}
