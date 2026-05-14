'use client';

import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import Link from 'next/link';
import type { Property } from '@/lib/types';

import propertiesData from '@/data/properties.json';

const properties = propertiesData as Property[];

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
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block">Our Portfolio</span>
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
