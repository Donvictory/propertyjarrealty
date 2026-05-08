'use client';

import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import Link from 'next/link';
import type { Property } from '@/lib/types';

const properties: Property[] = [
  {
    id: '1',
    title: 'The Glass House',
    location: 'Malibu, California',
    price: '$8,500,000',
    beds: 5,
    baths: 6,
    sqft: '6,500',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    tag: 'Exclusive',
    type: 'Residential',
    description: 'A breathtaking glass-walled estate perched on the Malibu cliffside with panoramic ocean views.',
  },
  {
    id: '2',
    title: 'Mountain Retreat',
    location: 'Aspen, Colorado',
    price: '$5,200,000',
    beds: 4,
    baths: 4,
    sqft: '4,200',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2065&auto=format&fit=crop',
    tag: 'New Listing',
    type: 'Residential',
    description: 'A luxurious mountain chalet nestled among Aspen\'s snow-capped peaks.',
  },
  {
    id: '3',
    title: 'Modern Oasis',
    location: 'Miami, Florida',
    price: '$12,000,000',
    beds: 6,
    baths: 8,
    sqft: '8,900',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
    tag: 'Featured',
    type: 'Residential',
    description: 'An ultra-modern waterfront masterpiece with infinity pool and private dock.',
  },
  {
    id: '4',
    title: 'The Penthouse',
    location: 'New York, NY',
    price: '$15,750,000',
    beds: 3,
    baths: 4,
    sqft: '3,500',
    image: 'https://images.unsplash.com/photo-1512915922686-57c11f9ad6b3?q=80&w=2070&auto=format&fit=crop',
    type: 'Residential',
    description: 'Manhattan\'s crown jewel — a full-floor penthouse with 360° skyline views.',
  },
  {
    id: '5',
    title: 'Desert Villa',
    location: 'Palm Springs, CA',
    price: '$3,800,000',
    beds: 4,
    baths: 3,
    sqft: '3,200',
    image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2074&auto=format&fit=crop',
    type: 'Residential',
    description: 'A mid-century modern desert gem with stunning mountain views.',
  },
  {
    id: '6',
    title: 'Coastal Manor',
    location: 'Hamptons, NY',
    price: '$9,200,000',
    beds: 7,
    baths: 6,
    sqft: '7,800',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop',
    tag: 'Sold',
    type: 'Residential',
    description: 'A grand coastal estate steps from the beach featuring formal gardens.',
  },
];

const FeaturedProperties = () => {
  return (
    <section id="properties" className="py-24 bg-off-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block">Our Portfolio</span>
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">Featured <span className="italic font-light">Properties</span></h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/properties"
              className="flex items-center gap-2 text-brand font-bold hover:gap-4 transition-all group"
            >
              View All Properties
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
