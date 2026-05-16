'use client';

import { useState, useEffect } from 'react';
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

export default function CampaignPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [content, setContent] = useState<CampaignContent | null>(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>('NGN');

  useEffect(() => {
    async function fetchData() {
      try {
        const [propRes, contentRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/campaign')
        ]);

        if (!propRes.ok || !contentRes.ok) throw new Error('Failed to fetch data');
        
        const [propData, contentData] = await Promise.all([
          propRes.json(),
          contentRes.json()
        ]);

        setProperties(propData);
        setContent(contentData);
      } catch (err) {
        console.error('Error fetching campaign data:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const campaignProperties = Array.isArray(properties) 
    ? (properties.some(p => p.isCampaign === true) 
        ? properties.filter(p => p.isCampaign === true) 
        : properties) // Fallback to all if none are marked yet
    : [];

  const filteredProperties = campaignProperties.filter(p => {
    if (filter === 'All') return true;
    const type = p.type?.toLowerCase() || '';
    const title = p.title?.toLowerCase() || '';
    const description = p.description?.toLowerCase() || '';

    if (filter === 'Residential') return type.includes('residential');
    if (filter === 'Commercial') return type.includes('commercial');
    if (filter === 'Luxury') return title.includes('luxury') || description.includes('luxury');
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="flex flex-col items-center gap-8">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-brand/20 rounded-full" />
            <div className="absolute inset-0 border-t-2 border-brand rounded-full animate-spin" />
            <div className="absolute inset-4 bg-brand/10 rounded-full animate-pulse" />
          </div>
          <p className="text-charcoal font-bold animate-pulse uppercase tracking-[0.4em] text-[10px]">PropertyjarRealty Ltd</p>
        </div>
      </div>
    );
  }

  if (!content && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <p className="text-gray-500">Failed to load campaign content.</p>
      </div>
    );
  }

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
                {content?.whyInvestTitle.split(' ').map((word, i) => 
                  word === 'Lagos?' ? <span key={i} className="text-brand">{word}</span> : word + ' '
                )}
              </h2>
              
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
                {content?.whyInvestSubtitle}
              </h3>

              <ul className="space-y-4">
                {content?.whyInvestPoints.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0" />
                    <p className="text-lg text-gray-700 leading-relaxed">{item}</p>
                  </li>
                ))}
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
                  <span className="text-brand tracking-tighter">{content?.projectedRoi}</span>
                  <span className="text-base md:text-lg text-gray-400 font-bold uppercase tracking-[0.2em] mt-6 block">
                    {content?.roiSubtext}
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
            {error ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-red-600 font-bold mb-2">Unable to load selection</p>
                <button onClick={() => window.location.reload()} className="text-brand font-bold hover:underline">Try Again</button>
              </div>
            ) : filteredProperties.length === 0 ? (
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
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    <div className="absolute top-6 right-6">
                      <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
                        {property.type}
                      </span>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h3 className="text-2xl font-bold mb-2">{property.title}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-white/70 text-sm">{property.location}</p>
                        <p className="text-white font-bold text-lg">
                          {formatDisplay(parsePriceNGN(property.price), currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-brand font-bold text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all px-4">
                    Secure Private Summary <span>→</span>
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
            {content?.investmentOptions.map((opt, i) => (
              <div key={i} className="bg-off-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-brand/20 transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand mb-6 shadow-sm group-hover:scale-110 transition-transform font-bold">
                  {i === 0 ? '01' : i === 1 ? '02' : '03'}
                </div>
                <h3 className="font-bold text-charcoal text-lg uppercase tracking-tight mb-4">{opt.title}</h3>
                <ul className="space-y-3">
                  {opt.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-500 font-medium leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
            {content?.offerStack.map((offer, i) => {
              const isElite = offer.title.includes('Elite');
              const isSmart = offer.title.includes('Smart');
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
                    {offer.points.map((p, j) => (
                      <li key={j} className={`flex items-start gap-3 text-sm font-medium leading-relaxed ${isElite ? 'text-white/70' : 'text-gray-500'}`}>
                        <CheckCircle2 size={18} className="text-brand flex-shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => {
                      const contactSection = document.getElementById('consultation');
                      contactSection?.scrollIntoView({ behavior: 'smooth' });
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
            })}
          </div>
        </div>
      </section>

      {/* Direct Consultation Section */}
      <section id="consultation" className="py-4 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-brand rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-8 leading-tight">
                  Direct <span className="italic font-light serif text-white/80">Private</span> <br />
                  Consultation.
                </h2>
                <p className="text-white/70 text-xl font-light mb-12 max-w-lg leading-relaxed">
                  Connect directly with our luxury real estate specialists to discuss your investment strategy and secure the best entry terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <a 
                    href="https://wa.me/2349153869750?text=Hello%20PropertyJar%20Realty%2C%20I'm%20interested%20in%20the%20investment%20campaign."
                    target="_blank"
                    className="bg-white text-brand px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all shadow-xl active:scale-95 text-center"
                  >
                    Direct WhatsApp
                  </a>
                  <a 
                    href="/contact"
                    className="bg-brand-hover border border-white/20 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-brand transition-all shadow-xl active:scale-95 text-center"
                  >
                    Book Appointment
                  </a>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="aspect-square bg-white/10 backdrop-blur-xl rounded-[3rem] border border-white/10 flex flex-col items-center justify-center text-center p-12">
                  <div className="w-24 h-24 bg-brand text-white rounded-full flex items-center justify-center mb-8 shadow-2xl">
                    <CheckCircle2 size={48} />
                  </div>
                  <h4 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Verified Assets</h4>
                  <p className="text-white/60 font-light italic leading-relaxed">
                    Every property in our selection has undergone rigorous 100% verification for title, compliance, and growth potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
