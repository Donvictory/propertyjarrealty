'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import properties from '@/data/properties.json';
import type { Property } from '@/lib/types';
import CampaignPropertyModal from '@/components/CampaignPropertyModal';

export default function CampaignPage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

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
                Why Invest in <br />
                <span className="text-brand">Lagos?</span>
              </h2>
              
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
                Why smart investors are looking at Lagos
              </h3>

              <ul className="space-y-4">
                {[
                  "Lagos = fastest-growing real estate hub in West Africa",
                  "High rental demand (shortlet & residential)",
                  "Entry prices significantly lower than UK property market",
                  "Strong appreciation potential in developing corridors"
                ].map((item, idx) => (
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
                  <span className="text-brand tracking-tighter">15% – 30%</span>
                  <span className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-[0.2em] mt-6 block">
                    Depending on investment type
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
            <div className="flex gap-4 p-2 bg-white rounded-2xl shadow-sm border border-gray-100">
              <button className="px-6 py-2 rounded-xl bg-brand text-white font-bold text-sm shadow-md">All Properties</button>
              <button className="px-6 py-2 rounded-xl text-gray-400 font-bold text-sm hover:text-charcoal transition-colors">Residential</button>
              <button className="px-6 py-2 rounded-xl text-gray-400 font-bold text-sm hover:text-charcoal transition-colors">Luxury</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {properties.map((property, index) => (
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
            ))}
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
            {/* Option 1 */}
            <div className="space-y-4">
              <h3 className="font-bold text-charcoal text-sm uppercase tracking-widest">Option 1: Shortlet Apartments</h3>
              <ul className="space-y-2 text-sm text-gray-500 uppercase font-medium tracking-wide">
                <li>• Entry: ₦XXM</li>
                <li>• ROI: 20-30%</li>
                <li>• Target: Airbnb / Business Travelers</li>
              </ul>
            </div>

            {/* Option 3 (Moved to match screenshot layout) */}
            <div className="space-y-4">
              <h3 className="font-bold text-charcoal text-sm uppercase tracking-widest">Option 3: Off-plan Developments</h3>
              <ul className="space-y-2 text-sm text-gray-500 uppercase font-medium tracking-wide">
                <li>• Flexible Payment Plan</li>
                <li>• Capital Appreciation before completion</li>
              </ul>
            </div>

            {/* Option 2 */}
            <div className="space-y-4">
              <h3 className="font-bold text-charcoal text-sm uppercase tracking-widest">Option 2: Land Banking</h3>
              <ul className="space-y-2 text-sm text-gray-500 uppercase font-medium tracking-wide">
                <li>• Entry: ₦XM</li>
                <li>• Appreciation: 2x-5x in 2-4 years</li>
              </ul>
            </div>

            {/* Architectural Graphic Placeholder (Matching screenshot) */}
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
            {/* Entry Investor */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-[#00FF85]" />
                <h3 className="text-2xl font-bold text-charcoal uppercase tracking-tighter">Entry Investor</h3>
              </div>
              <ul className="space-y-4 text-sm text-charcoal font-bold uppercase tracking-widest">
                <li>• 1 Plot / 1 Unit</li>
                <li>• 6-12 Months Payment</li>
                <li>• Clear Appreciation Angle</li>
              </ul>
            </div>

            {/* Elite Investor */}
            <div className="space-y-8 lg:row-span-2 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-charcoal uppercase tracking-tighter">Elite Investor</h3>
              <ul className="space-y-4 text-sm text-charcoal font-bold uppercase tracking-widest">
                <li>• 4-5+ Units</li>
                <li>• Bulk Discount</li>
                <li>• Priority Allocation</li>
                <li>• Optional JV Conversation</li>
              </ul>
            </div>

            {/* Smart Investor */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-[#FFD600]" />
                <h3 className="text-2xl font-bold text-charcoal uppercase tracking-tighter">Smart Investor</h3>
              </div>
              <ul className="space-y-4 text-sm text-charcoal font-bold uppercase tracking-widest">
                <li>• 2-3 Units</li>
                <li>• Discount Bundle</li>
                <li>• Rental/Shortlet Angle</li>
              </ul>
            </div>
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
