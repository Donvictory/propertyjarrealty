'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import type { Property } from '@/lib/types';
import type { CampaignContent } from '@/lib/campaign';
import CampaignPropertyModal from '@/components/CampaignPropertyModal';

export default function CampaignPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [content, setContent] = useState<CampaignContent | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        console.error('Error fetching campaign data:', err);
        setError(err.message);
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

  if (!content && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <p className="text-gray-500">Failed to load campaign content.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 bg-off-white">
      <Navbar />

      {/* Why Invest Section */}
      <section className="py-4 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-charcoal">
                {content?.whyInvestTitle.split(' ').map((word, i) => 
                  word === 'Lagos?' ? <span key={i} className="text-brand">{word}</span> : word + ' '
                )}
              </h2>
              
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
                {content?.whyInvestSubtitle}
              </h3>

              <ul className="space-y-4">
                {content?.whyInvestPoints.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0" />
                    <p className="text-lg text-gray-600 font-light leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:pl-16"
            >
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="w-16 h-px bg-gray-200 mb-8" />
                <h4 className="text-3xl md:text-6xl font-bold text-charcoal leading-tight">
                  Projected ROI: <br />
                  <span className="text-brand tracking-tighter">{content?.projectedRoi}</span>
                  <span className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-[0.2em] mt-6 block">
                    {content?.roiSubtext}
                  </span>
                </h4>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Property Grid Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold text-charcoal tracking-tight mb-4">The Selection</h1>
              <p className="text-gray-500">
                Click on any property below to view its full summary, download a detailed brochure, and connect directly with our luxury realtors.
              </p>
            </div>
            <div className="flex gap-2 md:gap-4 p-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex-wrap">
              {['All', 'Residential', 'Commercial', 'Luxury'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
                    filter === f 
                      ? 'bg-brand text-white shadow-md' 
                      : 'text-gray-400 hover:text-charcoal'
                  }`}
                >
                  {f === 'All' ? 'All Properties' : f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {error ? (
              <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">!</div>
                <p className="text-red-600 font-bold mb-2">Unable to load selection</p>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 text-brand font-bold hover:underline"
                >
                  Try Again
                </button>
              </div>
            ) : loading ? (
              <div className="col-span-full py-20 text-center">
                <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400 font-medium">Loading selection...</p>
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
                  onClick={() => setSelectedProperty(property as Property)}
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

                    <div className="absolute bottom-8 left-8 right-8">
                      <p className="text-brand font-bold text-xs uppercase tracking-widest mb-1">{property.tag ?? 'Exclusive'}</p>
                      <h3 className="text-2xl font-bold text-white mb-2">{property.title}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-white/70 text-sm">{property.location}</p>
                        <p className="text-white font-bold text-lg">{property.price}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-brand font-bold text-sm group-hover:gap-4 transition-all px-4">
                    View Property Summary <span>→</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Investment Options Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-charcoal uppercase tracking-[0.3em] mb-2">Investment Options</h2>
            <div className="w-16 h-0.5 bg-brand mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {content?.investmentOptions.map((opt, i) => (
              <div key={i} className="space-y-4">
                <h3 className="font-bold text-charcoal text-sm uppercase tracking-widest">{opt.title}</h3>
                <ul className="space-y-2 text-sm text-gray-500 uppercase font-medium tracking-wide">
                  {opt.points.map((p, j) => (
                    <li key={j}>• {p}</li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Architectural Graphic Placeholder */}
            <div className="lg:col-span-3 flex justify-end mt-8">
              <div className="max-w-xs text-right">
                 <div className="border border-gray-200 p-4 rounded-xl mb-4 bg-off-white">
                    <img 
                      src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=400&h=300&fit=crop" 
                      alt="Floor plan concept" 
                      className="w-full h-32 object-cover opacity-50 grayscale"
                    />
                 </div>
                 <p className="text-[10px] uppercase font-bold text-charcoal tracking-widest mb-1">Function in Form</p>
                 <p className="text-[8px] uppercase text-gray-400 leading-tight">Every piece of furniture serves a purpose</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Stack Section */}
      <section className="py-24 bg-off-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-charcoal uppercase tracking-[0.3em] mb-2">Offer Stack</h2>
            <div className="w-16 h-0.5 bg-brand mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-16">
            {content?.offerStack.map((offer, i) => (
              <div key={i} className={`space-y-8 ${offer.title === 'Elite Investor' ? 'lg:row-span-2 flex flex-col justify-center' : ''}`}>
                <div className="flex items-center gap-4">
                  {offer.color && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: offer.color }} />}
                  <h3 className="text-2xl font-bold text-charcoal uppercase tracking-tighter">{offer.title}</h3>
                </div>
                <ul className="space-y-4 text-sm text-charcoal font-bold uppercase tracking-widest">
                  {offer.points.map((p, j) => (
                    <li key={j}>• {p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {selectedProperty && (
        <CampaignPropertyModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </main>
  );
}
