import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { getProperties } from '@/lib/properties';

export const metadata: Metadata = {
  title: 'Properties — PropertyJar Realty',
  description: 'Browse our exclusive portfolio of luxury properties across the world\'s most desirable locations.',
};

const PROPERTY_TYPES = ['All', 'Residential', 'Commercial', 'Industrial', 'Land'];
const PRICE_RANGES = ['All Prices', 'Under $2M', '$2M – $5M', '$5M – $10M', '$10M+'];

export default function PropertiesPage() {
  const properties = getProperties();

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-charcoal overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop)' }}
        />
        <div className="relative container mx-auto px-6 text-white">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand mb-4 block">Our Portfolio</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Exclusive <span className="italic font-light">Properties</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl">
            Discover our curated selection of world-class properties — each one a testament to exceptional architecture and unparalleled lifestyle.
          </p>
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
