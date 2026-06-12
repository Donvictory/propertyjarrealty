'use client';

import { motion } from 'framer-motion';
import type { Property } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;

  displayPrice?: string;
  displayPricingOptions?: { size: string; price: string }[];
  currency?: 'NGN' | 'USD' | 'GBP';
}

const PropertyCard = ({ property, displayPrice, displayPricingOptions, currency }: PropertyCardProps) => {
  const shownPrice = displayPrice ?? property.price;
  const pricingOptions = displayPricingOptions ?? property.pricingOptions;
  const isConverted = currency && currency !== 'NGN';

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full relative"
    >
      {}
      {}
      <div className="relative 
       w-full overflow-hidden shrink-0">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {property.tag && (
            <div className="bg-brand/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest text-white">
              {property.tag}
            </div>
          )}
          {isConverted && (
            <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-brand border border-brand/20 shadow-sm animate-pulse">
              {currency} Equivalence
            </div>
          )}
        </div>

        <Image
          src={property.image}
          alt={property.title}
          width={500}
          height={500}
          unoptimized
          className="w-full h-full object-contain aspect-[4/5] transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 items-end">
          {pricingOptions ? (
            pricingOptions.slice(0, 2).map((opt, i) => (
              <div key={i} className="bg-brand text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-md border border-white/10 uppercase tracking-tight">
                {opt.size}: {opt.price}
              </div>
            ))
          ) : (
            <div className="bg-brand text-white px-4 py-2 rounded-xl text-lg font-bold shadow-lg">
              {shownPrice}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow text-center">
        <h3 className="text-lg font-serif font-bold text-charcoal mb-4 leading-tight group-hover:text-brand transition-colors">
          {property.title}
        </h3>

        <div className="mt-auto flex flex-col items-center gap-4">
          <Link
            href={`https://wa.me/2349153869750?text=I'm interested in ${property.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#14b8a6] text-white py-3 px-4.5 rounded-sm font-semibold hover:bg-[#0d9488] transition-all shadow-md active:scale-95 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            Contact via WhatsApp
          </Link>

          <div className="flex items-center justify-center gap-4">
            <Link 
              href={`https://wa.me/2349153869750?text=I'm interested in ${property.title}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full flex items-center justify-center text-charcoal/80 hover:bg-brand hover:text-white transition-all border border-neutral-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </Link>
            <Link 
              href="https://www.instagram.com/propertyjarrealtyltd_?igsh=NWY5aTU1ZGFuc2hh" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full flex items-center justify-center text-charcoal/80 hover:bg-brand hover:text-white transition-all border border-neutral-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
