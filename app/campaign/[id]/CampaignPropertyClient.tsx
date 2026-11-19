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
import Link from 'next/link';

interface CampaignPropertyClientProps {
  property: Property;
}

export default function CampaignPropertyClient({ property }: CampaignPropertyClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const images = property.images && property.images.length > 0 ? property.images : [property.image];

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const currency = (searchParams.get('curr') as Currency) || 'NGN';
  const isShortlet = property.type?.toLowerCase().includes('shortlet') || property.category === 'shortlet';

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
        setTimeout(async () => {
          try {
            const response = await fetch(property.brochureUrl!);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;

            const fileName = property.brochureUrl!.split('/').pop() || `${property.title.replace(/\s+/g, '_')}_Brochure.pdf`;
            link.download = decodeURIComponent(fileName);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
          } catch (error) {
            console.error('Blob download failed, falling back to direct link download', error);
            const link = document.createElement('a');
            link.href = property.brochureUrl!;
            const fileName = property.brochureUrl!.split('/').pop() || 'brochure.pdf';
            link.download = decodeURIComponent(fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }, 500);
      }
    } else {
      alert(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <main className="min-h-screen pt-24 bg-off-white selection:bg-brand selection:text-white relative">
      <div className="container mx-auto px-6 pb-20">

        { }
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

          { }
          <div className="lg:col-span-7 space-y-12">

            { }
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[16/10] rounded-lg overflow-hidden shadow-2xl mb-4 group"
            >
              <img
                src={images[activeImageIdx] || property.image}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length)}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                  </button>
                  <button
                    onClick={() => setActiveImageIdx((prev) => (prev + 1) % images.length)}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </button>
                  <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`h-2 rounded-full transition-all ${idx === activeImageIdx ? 'w-6 bg-white shadow' : 'w-2 bg-white/60 hover:bg-white'
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute top-8 md:top-12 right-8 md:right-12">
                <span className="px-4 py-1.5 rounded-full bg-charcoal/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/20">
                  {property.type}
                </span>
              </div>
            </motion.div>

            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${idx === activeImageIdx ? 'border-brand scale-[1.02] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt={`${property.title} - ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

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

            { }
            <div className="bg-white p-10 rounded-lg shadow-xl border border-gray-100">
              <div className="grid grid-cols-3 gap-8 mb-10 pb-10 border-b border-gray-50">
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-off-white flex items-center justify-center text-brand">
                    <Bed size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Beds</p>
                    <p className="text-lg font-bold text-charcoal">{property.beds ?? '—'}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-off-white flex items-center justify-center text-brand">
                    <Bath size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Baths</p>
                    <p className="text-lg font-bold text-charcoal">{property.baths ?? '—'}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-off-white flex items-center justify-center text-brand">
                    <Maximize size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Sqft</p>
                    <p className="text-lg font-bold text-charcoal">{property.sqft ?? '—'}</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-brand max-w-none">
                <h3 className="text-xl font-bold text-charcoal mb-4 uppercase tracking-tight">Executive Summary</h3>
                <p className="text-gray-500 text-lg leading-relaxed font-light">
                  {property.description}
                </p>

                {property.shortLetDetails?.checkIn && (
                  <div className="mt-6 p-4 rounded-xl bg-off-white border border-gray-100 flex items-center justify-between not-prose">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Check-in</p>
                      <p className="text-sm font-bold text-charcoal">{property.shortLetDetails.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Check-out</p>
                      <p className="text-sm font-bold text-charcoal">{property.shortLetDetails.checkOut}</p>
                    </div>
                  </div>
                )}

                {property.highlights && property.highlights.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-100 not-prose">
                    <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">Features & Amenities</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {property.highlights.map((hl, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-brand text-xs">✨</span>
                          <span>{hl.replace(/^✨\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          { }
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">

              { }
              <div className="bg-white p-10 rounded-lg shadow-xl border border-gray-100">
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

              {/* Primary Action — Brochure Lead Modal or Direct Booking */}
              {!isShortlet && property.brochureUrl ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowLeadForm(true)}
                    className="w-full bg-charcoal text-white py-5 rounded-2xl font-semibold hover:bg-black transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-wider text-sm group"
                  >
                    <span>Download Full Brochure</span>
                    <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                  </button>
                  <p className="text-center text-xs text-gray-400 font-medium tracking-wide">
                    Confidential floor plans and market analysis
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link
                    href={`https://wa.me/2349153869750?text=${encodeURIComponent(
                      isShortlet
                        ? `Hello PropertyJar Realty, I would like to book ${property.title}.`
                        : `Hello PropertyJar Realty, I'm interested in ${property.title}.`
                    )}`}
                    target="_blank"
                    className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-semibold hover:bg-[#20ba59] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-wider text-sm"
                  >
                    <span>{isShortlet ? 'Reserve on WhatsApp' : 'Inquire on WhatsApp'}</span>
                  </Link>
                  <p className="text-center text-xs text-gray-400 font-medium tracking-wide">
                    {isShortlet
                      ? 'Direct booking and reservation confirmation'
                      : 'Direct inquiry and private consultation'}
                  </p>
                </div>
              )}

              { }
              <div className="flex gap-4">
                <Link
                  href={`https://wa.me/2349153869750?text=${encodeURIComponent(
                    property.type?.toLowerCase().includes('shortlet') || property.category === 'shortlet'
                      ? `Hello PropertyJar Realty, I would like to book ${property.title}.`
                      : `Hello PropertyJar Realty, I'm interested in ${property.title}.`
                  )}`}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-2xl text-[10px] font-bold hover:opacity-90 transition-all uppercase tracking-widest shadow-lg text-center"
                >
                  WhatsApp
                </Link>
                <Link
                  href="https://www.instagram.com/propertyjarrealtyltd_?igsh=NWY5aTU1ZGFuc2hh"
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-3 bg-white border border-gray-100 text-charcoal py-4 rounded-2xl text-[10px] font-bold hover:bg-gray-50 transition-all uppercase tracking-widest shadow-lg text-center"
                >
                  Instagram
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      { }
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
              className="relative bg-white rounded-lg overflow-hidden max-w-lg w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] p-10 md:p-14"
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
