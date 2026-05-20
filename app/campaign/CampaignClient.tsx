'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import type { Property } from '@/lib/types';
import type { CampaignContent } from '@/lib/campaign';
import { 
  type Currency, 
  CURRENCY_LABELS, 
  formatDisplay, 
  parsePriceNGN 
} from '@/lib/currency';

interface CampaignClientProps {
  properties: Property[];
  initialContent: CampaignContent | null;
}

export default function CampaignClient({ properties, initialContent }: CampaignClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [currency, setCurrency] = useState<Currency>('NGN');

  const filteredProperties = properties.filter(p => {
    if (filter === 'All') return true;
    const type = p.type?.toLowerCase() || '';
    const title = p.title?.toLowerCase() || '';
    const description = p.description?.toLowerCase() || '';

    if (filter === 'Residential') return type.includes('residential');
    if (filter === 'Commercial') return type.includes('commercial');
    if (filter === 'Luxury') return title.includes('luxury') || description.includes('luxury');
    return true;
  });

  return (
    <main className="min-h-screen pt-24 bg-off-white">

      {/* Why Invest Section */}
      <section className="py-1 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-medium text-neutral-800 mb-6 tracking-tight text-charcoal">
                {initialContent?.whyInvestTitle?.split(' ').map((word, i) => 
                  word === 'Lagos?' ? <span key={i} className="text-brand">{word}</span> : word + ' '
                ) ?? ''}
              </h2>
              
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
                {initialContent?.whyInvestSubtitle}
              </h3>

              <ul className="space-y-4">
                {initialContent?.whyInvestPoints?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0" />
                    <p className="text-lg text-gray-700 leading-relaxed">{item}</p>
                  </li>
                )) ?? null}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:pl-16"
            >
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="w-16 h-px bg-gray-200 mb-8" />
                <h4 className="text-3xl md:text-4xl font-medium text-neutral-800 leading-tight">
                  Projected ROI: <br />
                  <span className="text-brand tracking-tighter">{initialContent?.projectedRoi}</span>
                  <span className="text-base md:text-lg text-gray-400 font-bold uppercase tracking-[0.2em] mt-6 block">
                    {initialContent?.roiSubtext}
                  </span>
                </h4>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Property Grid Section */}
      <section className="py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl font-medium text-neutral-800 tracking-tight mb-4">The Selection</h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Explore our curated selection of high-yield assets. Select a property to view its full investment summary and request the confidential brochure.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Category Filter */}
              <div className="flex flex-col gap-1.5 min-w-[200px]">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Category Filter</label>
                <div className="relative group">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none w-full bg-white border border-gray-100 text-charcoal text-sm font-bold rounded-2xl px-6 py-3.5 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all shadow-sm cursor-pointer hover:border-brand/50"
                  >
                    {['All', 'Residential', 'Commercial', 'Luxury'].map((f) => (
                      <option key={f} value={f}>{f === 'All' ? 'All Categories' : f}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </span>
                </div>
              </div>

              {/* Currency Selector */}
              <div className="flex flex-col gap-1.5 min-w-[200px]">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Market Currency</label>
                <div className="relative group">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="appearance-none w-full bg-white border border-gray-100 text-charcoal text-sm font-bold rounded-2xl px-6 py-3.5 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all shadow-sm cursor-pointer hover:border-brand/50"
                  >
                    {(Object.keys(CURRENCY_LABELS) as Currency[]).map((c) => (
                      <option key={c} value={c}>{CURRENCY_LABELS[c]}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProperties.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-medium">No properties found in this category.</p>
              </div>
            ) : (
              filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/campaign/${property.id}?curr=${currency}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-6 right-6">
                      <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
                        {property.type}
                      </span>
                    </div>
                  </div>
                  <div className="px-2 mb-6">
                    <h3 className="text-2xl font-bold text-charcoal mb-2">{property.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500 text-sm">{property.location}</p>
                      <p className="text-brand font-bold text-lg">
                        {formatDisplay(parsePriceNGN(property.price), currency)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-brand font-bold text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all px-2">
                    View Summary <span>→</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Investment Options Section */}
      <section className="py-4 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-neutral-800 uppercase tracking-[0.3em] mb-2">Investment Options</h2>
            <div className="w-16 h-0.5 bg-brand mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialContent?.investmentOptions?.map((opt, i) => (
              <div key={i} className="bg-off-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-brand/20 transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand mb-6 shadow-sm group-hover:scale-110 transition-transform font-bold">
                  {i === 0 ? '01' : i === 1 ? '02' : '03'}
                </div>
                <h3 className="font-bold text-charcoal text-lg uppercase tracking-tight mb-4">{opt.title}</h3>
                <ul className="space-y-3">
                  {opt.points?.map((p, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-500 font-medium leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                      {p}
                    </li>
                  )) ?? null}
                </ul>
              </div>
            )) ?? null}
          </div>
        </div>
      </section>

      {/* Offer Stack Section */}
      <section id="offer-stack" className="py-4 bg-off-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-neutral-800 uppercase tracking-[0.3em] mb-2">Offer Stack</h2>
            <div className="w-16 h-0.5 bg-brand mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {initialContent?.offerStack?.map((offer, i) => {
              const isElite = offer.title?.includes('Elite') ?? false;
              const isSmart = offer.title?.includes('Smart') ?? false;
              return (
                <div 
                  key={i} 
                  className={`relative p-10 rounded-[3rem] border transition-all duration-500 flex flex-col h-full group
                    ${isElite 
                      ? 'bg-charcoal border-brand shadow-2xl lg:-mt-6 lg:mb-6 z-10' 
                      : 'bg-white border-gray-100 hover:border-brand/30 shadow-sm'}`}
                >
                  {isElite && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2 rounded-full whitespace-nowrap shadow-xl">
                      Most Exclusive
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className={`text-3xl font-bold uppercase tracking-tighter ${isElite ? 'text-white' : 'text-charcoal'}`}>
                      {offer.title}
                    </h3>
                    <div className="w-10 h-1 bg-brand mt-2" />
                  </div>

                  <ul className="space-y-5 mb-10 flex-grow">
                    {offer.points?.map((p, j) => (
                      <li key={j} className={`flex items-start gap-3 text-sm font-medium leading-relaxed ${isElite ? 'text-white/70' : 'text-gray-500'}`}>
                        <CheckCircle2 size={18} className="text-brand flex-shrink-0 mt-0.5" />
                        {p}
                      </li>
                    )) ?? null}
                  </ul>

                  <button 
                    onClick={() => {
                      router.push('/contact');
                    }}
                    className={`w-full py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95
                    ${isElite 
                      ? 'bg-brand text-white hover:bg-brand-hover' 
                      : isSmart
                        ? 'bg-charcoal text-white hover:bg-black'
                        : 'bg-off-white text-charcoal hover:bg-gray-100'}`}
                  >
                    Inquire Now
                  </button>
                </div>
              );
            }) ?? null}
          </div>
        </div>
      </section>

    </main>
  );
}
