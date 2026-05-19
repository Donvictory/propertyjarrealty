'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bed, 
  Bath, 
  Maximize, 
  Mail, 
  User, 
  CheckCircle2, 
  ArrowLeft,
  MapPin,
  Download,
  X
} from 'lucide-react';
import type { Property } from '@/lib/types';
import { sendPropertyInquiry } from '@/app/actions/leads';
import { type Currency, formatDisplay, parsePriceNGN } from '@/lib/currency';

interface CampaignPropertyClientProps {
  property: Property;
}

export default function CampaignPropertyClient({ property }: CampaignPropertyClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const currency = (searchParams.get('curr') as Currency) || 'NGN';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append('propertyTitle', property.title);
    formData.append('propertyLocation', property.location);

    const result = await sendPropertyInquiry(formData);
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      if (property.brochureUrl) {
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = property.brochureUrl!;
          link.target = '_blank';
          link.download = '';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 500);
      }
    } else {
      alert(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <main className="min-h-screen pt-24 bg-off-white selection:bg-brand selection:text-white relative">
      <div className="container mx-auto px-6 pb-20">
        
        {/* Back Button */}
        <button 
          onClick={() => {
            router.push('/campaign');
            window.scrollTo(0, 0);
          }}
          className="flex items-center gap-2 text-gray-400 hover:text-charcoal transition-all mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Return to Selection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Content Area */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Main Visual */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl mb-8"
            >
              <img 
                src={property.image} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-8 md:top-12 right-8 md:right-12">
                <span className="px-4 py-1.5 rounded-full bg-charcoal/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/20">
                  {property.type}
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="px-2 md:px-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-charcoal mb-4 tracking-tighter leading-none">
                {property.title}
              </h1>
              <div className="flex items-center gap-3 text-gray-500 text-lg md:text-xl font-light mb-12">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                  <MapPin size={20} />
                </div>
                {property.location}
              </div>
            </motion.div>

            {/* Metrics & Description */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
              <div className="grid grid-cols-3 gap-8 mb-10 pb-10 border-b border-gray-50">
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-off-white flex items-center justify-center text-brand">
                    <Bed size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Beds</p>
                    <p className="text-lg font-bold text-charcoal">{property.beds}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-off-white flex items-center justify-center text-brand">
                    <Bath size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Baths</p>
                    <p className="text-lg font-bold text-charcoal">{property.baths}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-off-white flex items-center justify-center text-brand">
                    <Maximize size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Sqft</p>
                    <p className="text-lg font-bold text-charcoal">{property.sqft}</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-brand max-w-none">
                <h3 className="text-xl font-bold text-charcoal mb-4 uppercase tracking-tight">Executive Summary</h3>
                <p className="text-gray-500 text-lg leading-relaxed font-light">
                  {property.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Lead & Conversion Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              
              {/* Financial Box */}
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-black mb-3">Investment Value</p>
                <p className="text-5xl font-bold text-charcoal tracking-tighter mb-8">
                  {formatDisplay(parsePriceNGN(property.price), currency)}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-brand/5 rounded-2xl border border-brand/10">
                    <CheckCircle2 size={18} className="text-brand" />
                    <span className="text-sm font-bold text-charcoal">Verified Title & Documents</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-brand/5 rounded-2xl border border-brand/10">
                    <CheckCircle2 size={18} className="text-brand" />
                    <span className="text-sm font-bold text-charcoal">Pre-Approved for Investment</span>
                  </div>
                </div>
              </div>

              {/* Primary Call to Action */}
              <div className="space-y-4">
                <button 
                  onClick={() => setShowLeadForm(true)}
                  className="w-full bg-charcoal text-white py-6 rounded-[2rem] font-bold hover:bg-black transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] group"
                >
                  Download Full Brochure 
                  <Download size={18} className="group-hover:translate-y-1 transition-transform" />
                </button>
                <p className="text-center text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                  confidential floor plans & market analysis
                </p>
              </div>

              {/* Direct Support */}
              <div className="flex gap-4">
                <a 
                  href={`https://wa.me/2349153869750?text=Hello%20PropertyJar%20Realty%2C%20I'm%20interested%20in%20${property.title}`}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-2xl text-[10px] font-bold hover:opacity-90 transition-all uppercase tracking-widest shadow-lg text-center"
                >
                  WhatsApp
                </a>
                <a 
                  href="https://www.instagram.com/propertyjarrealtyltd_?igsh=NWY5aTU1ZGFuc2hh" 
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-3 bg-white border border-gray-100 text-charcoal py-4 rounded-2xl text-[10px] font-bold hover:bg-gray-50 transition-all uppercase tracking-widest shadow-lg text-center"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Modal Overlay */}
      <AnimatePresence>
        {showLeadForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setShowLeadForm(false)}
              className="absolute inset-0 bg-charcoal/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[3rem] overflow-hidden max-w-lg w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] p-10 md:p-14"
            >
              <button 
                onClick={() => setShowLeadForm(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-charcoal transition-colors"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>

              {isSuccess ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-3xl font-bold text-charcoal mb-4 tracking-tight">Request Received</h4>
                  <p className="text-gray-500 text-lg mb-10 font-light leading-relaxed">
                    Your download is processing
                  </p>
                  <button 
                    onClick={() => setShowLeadForm(false)}
                    className="bg-charcoal text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-10 text-center">
                    <h4 className="text-3xl font-bold text-charcoal mb-4 tracking-tight">Download Brochure</h4>
                    <p className="text-gray-500 text-base font-light leading-relaxed">
                      Please provide your details to receive the full brochure and market analysis.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Full Name</label>
                      <div className="relative">
                        <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          required
                          name="fullName"
                          type="text" 
                          placeholder="e.g. John Doe" 
                          className="w-full bg-off-white border-none rounded-2xl pl-14 pr-6 py-4 text-charcoal focus:ring-2 focus:ring-brand/20 transition-all text-sm placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Email Address</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          required
                          name="email"
                          type="email" 
                          placeholder="e.g. john@example.com" 
                          className="w-full bg-off-white border-none rounded-2xl pl-14 pr-6 py-4 text-charcoal focus:ring-2 focus:ring-brand/20 transition-all text-sm placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand text-white py-5 rounded-2xl font-bold hover:bg-brand-hover transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-4 uppercase tracking-widest text-[10px]"
                    >
                      {isSubmitting ? 'Verifying...' : 'Download Brochure Now'}
                    </button>
                    <p className="text-center text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                      Confidentiality Guaranteed
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
