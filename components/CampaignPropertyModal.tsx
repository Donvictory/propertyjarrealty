'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Property } from '@/lib/types';

interface CampaignPropertyModalProps {
  property: Property;
  onClose: () => void;
}

const CampaignPropertyModal = ({ property, onClose }: CampaignPropertyModalProps) => {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // In a real app, this would trigger a file download
    setTimeout(() => {
      alert('Brochure download started! (Simulated)');
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-charcoal/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-[2.5rem] overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-30 w-10 h-10 bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-charcoal rounded-full flex items-center justify-center transition-all"
          >
            ✕
          </button>

          {/* Left: Image Side */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative">
            <img 
              src={property.image} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <span className="inline-block px-3 py-1 rounded-full bg-brand text-[10px] font-bold uppercase tracking-widest mb-2">
                {property.type}
              </span>
              <h3 className="text-3xl font-bold">{property.title}</h3>
              <p className="text-white/80">{property.location}</p>
            </div>
          </div>

          {/* Right: Content Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
            {!showLeadForm ? (
              <>
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Price</p>
                      <p className="text-4xl font-bold text-brand">{property.price}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-off-white p-4 rounded-2xl text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Beds</p>
                      <p className="text-lg font-bold text-charcoal">{property.beds}</p>
                    </div>
                    <div className="bg-off-white p-4 rounded-2xl text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Baths</p>
                      <p className="text-lg font-bold text-charcoal">{property.baths}</p>
                    </div>
                    <div className="bg-off-white p-4 rounded-2xl text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Sqft</p>
                      <p className="text-lg font-bold text-charcoal">{property.sqft}</p>
                    </div>
                  </div>

                  <p className="text-gray-500 leading-relaxed mb-8">
                    {property.description}
                  </p>
                </div>

                <div className="mt-auto space-y-4">
                  <span className='text-gray-600 font-medium text-center'>
                    Need full details about this property? Click the button below to get it for free
                  </span>
                  <button 
                    onClick={() => setShowLeadForm(true)}
                    className="w-full bg-brand text-white py-4 rounded-2xl font-bold hover:bg-brand-hover transition-all shadow-lg active:scale-95"
                  >
                    Download Brochure PDF
                  </button>
                  
                  <div className="flex gap-4">
                    <a 
                      href="https://wa.me/1234567890" 
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-2xl text-sm font-bold hover:opacity-90 transition-all"
                    >
                      WhatsApp
                    </a>
                    <a 
                      href="https://instagram.com" 
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white py-3 rounded-2xl text-sm font-bold hover:opacity-90 transition-all"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col justify-center">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                      ✓
                    </div>
                    <h4 className="text-2xl font-bold text-charcoal mb-2">Thank You!</h4>
                    <p className="text-gray-500 mb-8">Your brochure is being prepared for download.</p>
                    <button 
                      onClick={onClose}
                      className="text-brand font-bold hover:underline"
                    >
                      Return to Listings
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <button 
                      onClick={() => setShowLeadForm(false)}
                      className="text-gray-400 hover:text-charcoal mb-8 flex items-center gap-2 text-sm font-bold"
                    >
                      ← Back to Summary
                    </button>
                    <h4 className="text-2xl font-bold text-charcoal mb-2">Get the Brochure</h4>
                    <p className="text-gray-500 mb-8 text-sm">Please provide your details to download the full property details and floor plans.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe" 
                          className="w-full bg-off-white border border-gray-100 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-brand transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com" 
                          className="w-full bg-off-white border border-gray-100 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-brand transition-colors"
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand text-white py-4 rounded-2xl font-bold hover:bg-brand-hover transition-all shadow-lg active:scale-95 disabled:opacity-50 mt-4"
                      >
                        {isSubmitting ? 'Processing...' : 'Request Download'}
                      </button>
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
