'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bed, Bath, Maximize, X, Mail, User, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Property } from '@/lib/types';
import { sendPropertyInquiry } from '@/app/actions/leads';
import { type Currency, formatDisplay, parsePriceNGN } from '@/lib/currency';

interface CampaignPropertyModalProps {
  property: Property;
  onClose: () => void;
  currency: Currency;
}

const CampaignPropertyModal = ({ property, onClose, currency }: CampaignPropertyModalProps) => {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
          window.open(property.brochureUrl, '_blank');
        }, 500);
      }
    } else {
      alert(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-charcoal/90 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-[3rem] overflow-hidden max-w-5xl w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col md:flex-row max-h-[95vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 z-50 w-12 h-12 bg-white/10 backdrop-blur-xl text-white hover:bg-white hover:text-charcoal rounded-full flex items-center justify-center transition-all duration-300 border border-white/20"
          >
            <X size={20} />
          </button>

          {/* Left: Visual Side */}
          <div className="w-full md:w-1/2 h-80 md:h-auto relative overflow-hidden group">
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              src={property.image} 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
            
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 rounded-full bg-brand/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                  {property.type}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] border border-white/20">
                  {property.tag || 'Exclusive'}
                </span>
              </div>
              <h3 className="text-4xl font-bold mb-2 tracking-tight">{property.title}</h3>
              <p className="text-white/70 text-lg font-light flex items-center gap-2">
                <span className="w-4 h-px bg-brand" /> {property.location}
              </p>
            </div>
          </div>

          {/* Right: Interaction Side */}
          <div className="w-full md:w-1/2 p-10 md:p-16 overflow-y-auto bg-white flex flex-col">
            {!showLeadForm ? (
              <>
                <div className="mb-12">
                  <div className="mb-10">
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-black mb-3">Investment Value</p>
                    <p className="text-5xl font-bold text-charcoal tracking-tighter">
                      {formatDisplay(parsePriceNGN(property.price), currency)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 mb-12">
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

                  <div className="space-y-6">
                    <p className="text-gray-500 text-lg leading-relaxed font-light">
                      {property.description}
                    </p>
                  </div>
                </div>

                <div className="mt-auto space-y-6">
                  <div className="p-6 bg-off-white rounded-3xl border border-gray-100">
                    <p className="text-sm text-charcoal font-medium mb-4 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-brand" />
                      Get the full property portfolio & floor plans
                    </p>
                    <button 
                      onClick={() => setShowLeadForm(true)}
                      className="w-full bg-charcoal text-white py-5 rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                    >
                      Request Full Brochure <ChevronRight size={16} />
                    </button>
                  </div>
                  
                  <div className="flex gap-4">
                    <a 
                      href={`https://wa.me/2349153869750?text=Hello%20PropertyJar%20Realty%2C%20I'm%20interested%20in%20${property.title}`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-2xl text-xs font-bold hover:opacity-90 transition-all uppercase tracking-widest"
                    >
                      WhatsApp
                    </a>
                    <a 
                      href="https://www.instagram.com/propertyjarrealtyltd_?igsh=NWY5aTU1ZGFuc2hh" 
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-3 bg-white border border-gray-100 text-charcoal py-4 rounded-2xl text-xs font-bold hover:bg-gray-50 transition-all uppercase tracking-widest"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-grow flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-24 h-24 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-8">
                      <CheckCircle2 size={48} />
                    </div>
                    <h4 className="text-3xl font-bold text-charcoal mb-4">Request Received</h4>
                    <p className="text-gray-500 text-lg mb-10 max-w-xs mx-auto font-light leading-relaxed">
                      Our elite concierge team has been notified. Your brochure is downloading now.
                    </p>
                    <button 
                      onClick={onClose}
                      className="text-brand font-bold uppercase tracking-widest text-xs hover:underline"
                    >
                      Explore Other Assets
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <button 
                      onClick={() => setShowLeadForm(false)}
                      className="text-gray-400 hover:text-charcoal mb-12 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] group transition-all"
                    >
                      <span className="group-hover:-translate-x-2 transition-transform">←</span> Return to Summary
                    </button>
                    
                    <div className="mb-10">
                      <h4 className="text-4xl font-bold text-charcoal mb-4 tracking-tight">Secure Private Access</h4>
                      <p className="text-gray-500 text-lg font-light leading-relaxed">Please provide your coordinates to receive the confidential property portfolio.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Full Identity</label>
                        <div className="relative">
                          <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            required
                            name="fullName"
                            type="text" 
                            placeholder="Full Name" 
                            className="w-full bg-off-white border-none rounded-2xl pl-14 pr-6 py-5 text-charcoal focus:ring-2 focus:ring-brand/20 transition-all text-base placeholder:text-gray-300"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Digital Address</label>
                        <div className="relative">
                          <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            required
                            name="email"
                            type="email" 
                            placeholder="Email Address" 
                            className="w-full bg-off-white border-none rounded-2xl pl-14 pr-6 py-5 text-charcoal focus:ring-2 focus:ring-brand/20 transition-all text-base placeholder:text-gray-300"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand text-white py-6 rounded-2xl font-bold hover:bg-brand-hover transition-all shadow-2xl shadow-brand/20 active:scale-95 disabled:opacity-50 mt-4 uppercase tracking-[0.2em] text-xs"
                      >
                        {isSubmitting ? 'Verifying...' : 'Request Access Now'}
                      </button>
                      <p className="text-center text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                        Confidentiality Guaranteed
                      </p>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CampaignPropertyModal;
