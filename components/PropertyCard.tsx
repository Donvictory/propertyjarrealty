'use client';

import { motion } from 'framer-motion';
import type { Property } from '@/lib/types';

const PropertyCard = ({ property }: { property: Property }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all"
    >
      <div className="relative h-72 w-full overflow-hidden">
        {property.tag && (
          <div className="absolute top-4 left-4 z-10 bg-brand backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
            {property.tag}
          </div>
        )}
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-4 right-4 z-10 bg-brand text-white px-4 py-2 rounded-xl text-lg font-bold">
          {property.price}
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{property.location}</p>
        <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-brand transition-colors">{property.title}</h3>
        {property.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{property.description}</p>
        )}

        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Beds</span>
              <span className="text-sm font-bold text-charcoal">{property.beds}</span>
            </div>
            <div className="w-px h-6 bg-gray-100" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Baths</span>
              <span className="text-sm font-bold text-charcoal">{property.baths}</span>
            </div>
            <div className="w-px h-6 bg-gray-100" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Sqft</span>
              <span className="text-sm font-bold text-charcoal">{property.sqft}</span>
            </div>
          </div>

          <button className="p-3 rounded-full bg-gray-50 text-charcoal hover:bg-brand hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
