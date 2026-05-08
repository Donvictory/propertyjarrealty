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
    <main className="min-h-screen bg-off-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-charcoal overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand/5 -skew-x-12 translate-x-1/4" />
        <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-4 rounded-full bg-brand/20 border border-brand/30 text-brand text-[10px] font-bold tracking-widest uppercase mb-6">
              2026 Collection
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
              Our <span className="text-brand">Curated</span> <br />
              Property Showcase.
            </h1>
            <p className="text-xl text-white/60 font-light leading-relaxed">
              Explore our exclusive campaign collection. Each property has been hand-selected for its architectural significance and prime location.
            </p>
          </div>
        </div>
      </section>

      {/* Property Grid Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold text-charcoal tracking-tight mb-4">The Selection</h2>
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

      {/* Trust Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-charcoal mb-4 tracking-tight">Direct Connections</h2>
            <p className="text-gray-500">Our agents are standing by to provide personalized tours and investment consultations.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
             <a href="#" className="flex items-center gap-3 px-8 py-4 bg-off-white rounded-2xl border border-gray-100 hover:border-brand/20 transition-all group">
                <span className="text-2xl">📱</span>
                <span className="font-bold text-charcoal group-hover:text-brand transition-colors">Direct WhatsApp</span>
             </a>
             <a href="#" className="flex items-center gap-3 px-8 py-4 bg-off-white rounded-2xl border border-gray-100 hover:border-brand/20 transition-all group">
                <span className="text-2xl">📸</span>
                <span className="font-bold text-charcoal group-hover:text-brand transition-colors">Instagram DM</span>
             </a>
             <a href="#" className="flex items-center gap-3 px-8 py-4 bg-off-white rounded-2xl border border-gray-100 hover:border-brand/20 transition-all group">
                <span className="text-2xl">✉️</span>
                <span className="font-bold text-charcoal group-hover:text-brand transition-colors">Email Listing Agent</span>
             </a>
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
