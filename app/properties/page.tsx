import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { getProperties } from '@/lib/properties';

import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Exclusive Properties',
  description: 'Browse our curated portfolio of world-class luxury properties across the world\'s most desirable locations. Filter by type, price, and location.',
  openGraph: {
    title: 'Exclusive Properties | PropertyJar Realty Ltd',
    description: 'Browse our curated portfolio of world-class luxury properties.',
    url: 'https://propertyjarrealty.com/properties',
    images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&h=630&fit=crop', width: 1200, height: 630, alt: 'PropertyJar Luxury Properties' }],
  },
  alternates: { canonical: 'https://propertyjarrealty.com/properties' },
};

const PROPERTY_TYPES = ['All', 'Residential', 'Commercial', 'Industrial', 'Land'];
const PRICE_RANGES = ['All Prices', 'Under $2M', '$2M – $5M', '$5M – $10M', '$10M+'];

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen pt-32 bg-off-white">
      <Navbar />

      {/* Header Section */}
      <section className="bg-off-white pt-12 pb-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
                Our <span className="text-brand">Exclusive</span> Properties
              </h1>
              <p className="mt-4 text-gray-500 leading-relaxed">
                Discover a curated selection of the most prestigious properties in the world's most desirable locations.
              </p>
            </div>
            <Link 
              href="/campaign" 
              className="inline-flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-brand-hover transition-all shadow-lg active:scale-95 whitespace-nowrap"
            >
              Check our campaign <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-off-white border-b border-gray-200 sticky top-[72px] z-40">
        <div className="container mx-auto px-6 py-4 flex flex-wrap gap-3 items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mr-2">Type:</span>
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              className="px-4 py-1.5 rounded-full text-xs font-bold border border-gray-200 bg-white hover:bg-brand hover:text-white hover:border-brand transition-all first:bg-brand first:text-white first:border-brand"
            >
              {type}
            </button>
          ))}
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4 mr-2">Price:</span>
          <select className="px-4 py-1.5 rounded-full text-xs font-bold border border-gray-200 bg-white focus:outline-none focus:border-brand transition-all">
            {PRICE_RANGES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <span className="ml-auto text-xs text-gray-400 font-medium">{properties.length} listings found</span>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-32">
              <p className="text-gray-400 text-lg">No properties found.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
