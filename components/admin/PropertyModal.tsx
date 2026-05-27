'use client';

import { useState } from 'react';
import type { Property } from '@/lib/types';

interface PropertyModalProps {
  property?: Property | null;
  onClose: () => void;
  onSaved: (property: Property) => void;
}

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Industrial', 'Land'];
const TAGS = ['', 'Exclusive', 'New Listing', 'Featured', 'Sold', 'Hot Deal'];

interface PropertyFormState extends Omit<Property, 'id' | 'beds' | 'baths'> {
  beds: string;
  baths: string;
}

const EMPTY: PropertyFormState = {
  title: '',
  location: '',
  price: '',
  beds: '',
  baths: '',
  sqft: '',
  image: '',
  tag: '',
  type: 'Residential',
  description: '',
  isCampaign: false,
  brochureUrl: '',
};

export default function PropertyModal({ property, onClose, onSaved }: PropertyModalProps) {
  const isEdit = !!property;
  const [form, setForm] = useState<PropertyFormState>(() => {
    if (property) {
      return {
        ...property,
        beds: property.beds !== undefined && property.beds !== null ? String(property.beds) : '',
        baths: property.baths !== undefined && property.baths !== null ? String(property.baths) : '',
        sqft: property.sqft || '',
      } as PropertyFormState;
    }
    return {
      ...EMPTY,
    };
  });
  const [pricingOptions, setPricingOptions] = useState<{ size: string; price: string }[]>(() => {
    const existing = property?.pricingOptions || [];
    const base = [...existing];
    while (base.length < 2) {
      base.push({ size: '', price: '' });
    }
    return base.slice(0, 2);
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'brochure') {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image') setUploadingImage(true);
    if (type === 'brochure') setUploadingBrochure(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload file');
      }

      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        [type === 'image' ? 'image' : 'brochureUrl']: data.url,
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      if (type === 'image') setUploadingImage(false);
      if (type === 'brochure') setUploadingBrochure(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEdit ? `/api/properties/${property!.id}` : '/api/properties';
      const method = isEdit ? 'PUT' : 'POST';

      const finalPricing = pricingOptions.filter(
        (opt) => opt.size.trim() !== '' && opt.price.trim() !== ''
      );

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          beds: form.beds !== '' && form.beds !== undefined && form.beds !== null ? Number(form.beds) : null,
          baths: form.baths !== '' && form.baths !== undefined && form.baths !== null ? Number(form.baths) : null,
          sqft: form.sqft || null,
          tag: form.tag || null,
          isCampaign: !!form.isCampaign,
          brochureUrl: form.brochureUrl || '',
          pricingOptions: finalPricing,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save property');
      }

      const saved: Property = await res.json();
      onSaved(saved);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm placeholder:text-gray-400 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all';
  const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5';

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {}
      <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={onClose} />

      {}
      <div className="relative bg-white border border-gray-100 w-full rounded-2xl sm:rounded-3xl sm:max-w-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] flex flex-col"
        style={{ maxHeight: 'calc(100dvh - 56px)' }}
      >

        {}
        <div className="border-b border-gray-50 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-charcoal">{isEdit ? 'Edit Property' : 'Add New Property'}</h2>
            <p className="text-gray-400 text-xs mt-0.5">{isEdit ? `Editing: ${property!.title}` : 'Fill in the details below'}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-charcoal transition-all text-xl leading-none flex-shrink-0"
          >
            ×
          </button>
        </div>

        {}
        <form onSubmit={handleSubmit} className="overflow-y-auto overscroll-contain p-6 space-y-5 flex-1">
          {}
          <div>
            <label className={labelClass} htmlFor="pm-title">Property Title</label>
            <input id="pm-title" name="title" required value={form.title} onChange={handleChange} placeholder="e.g. The Glass House" className={inputClass} />
          </div>

          {}
          <div>
            <label className={labelClass} htmlFor="pm-location">Location</label>
            <input id="pm-location" name="location" required value={form.location} onChange={handleChange} placeholder="e.g. Malibu, California" className={inputClass} />
          </div>

          {}
          <div>
            <label className={labelClass} htmlFor="pm-price">Price</label>
            <input id="pm-price" name="price" required value={form.price} onChange={handleChange} placeholder="e.g. $8,500,000" className={inputClass} />
          </div>

          {}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass} htmlFor="pm-beds">Beds (optional)</label>
              <input id="pm-beds" name="beds" type="number" value={form.beds} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="pm-baths">Baths (optional)</label>
              <input id="pm-baths" name="baths" type="number" value={form.baths} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="pm-sqft">Sqft (optional)</label>
              <input id="pm-sqft" name="sqft" value={form.sqft} onChange={handleChange} placeholder="e.g. 6,500" className={inputClass} />
            </div>
          </div>

          {}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="pm-type">Property Type</label>
              <select id="pm-type" name="type" value={form.type} onChange={handleChange} className={inputClass}>
                {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="pm-tag">Tag (optional)</label>
              <select id="pm-tag" name="tag" value={form.tag ?? ''} onChange={handleChange} className={inputClass}>
                {TAGS.map((t) => <option key={t} value={t}>{t || '— None —'}</option>)}
              </select>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-1">Pricing & Sizing Options (optional)</h4>
              <p className="text-gray-400 text-xs">Add up to 2 custom size/price variations (e.g. &quot;500 SQM&quot; and &quot;₦150,000,000&quot;) to display as pill tags on the property card.</p>
            </div>
            
            <div className="space-y-3">
              {pricingOptions.map((opt, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-3 items-end">
                  <div>
                    <label className={labelClass} htmlFor={`po-size-${idx}`}>Size {idx + 1}</label>
                    <input
                      id={`po-size-${idx}`}
                      type="text"
                      value={opt.size}
                      onChange={(e) => {
                        const next = [...pricingOptions];
                        next[idx].size = e.target.value;
                        setPricingOptions(next);
                      }}
                      placeholder="e.g. 500 SQM"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`po-price-${idx}`}>Price {idx + 1}</label>
                    <input
                      id={`po-price-${idx}`}
                      type="text"
                      value={opt.price}
                      onChange={(e) => {
                        const next = [...pricingOptions];
                        next[idx].price = e.target.value;
                        setPricingOptions(next);
                      }}
                      placeholder="e.g. ₦150,000,000"
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <input
              type="checkbox"
              id="pm-campaign"
              name="isCampaign"
              checked={form.isCampaign}
              onChange={(e) => setForm(prev => ({ ...prev, isCampaign: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-200 bg-gray-50 text-brand focus:ring-brand accent-brand"
            />
            <label htmlFor="pm-campaign" className="text-sm font-bold text-charcoal cursor-pointer select-none">
              Add to Campaign Page
              <span className="block text-[10px] font-normal text-gray-400 uppercase tracking-widest mt-0.5">Show this property in the campaign selection</span>
            </label>
          </div>

          {form.isCampaign && (
            <div className="bg-brand/5 p-4 rounded-2xl border border-brand/10">
               <p className="text-[10px] text-brand uppercase font-bold tracking-widest">Campaign Settings Active</p>
               <p className="text-xs text-gray-500 mt-1">This property is also featured in the specialized investor campaign.</p>
            </div>
          )}

          {}
          <div>
            <label className={labelClass}>Brochure PDF</label>
            {!form.brochureUrl ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-brand rounded-2xl p-6 cursor-pointer bg-gray-50/50 hover:bg-brand/[0.02] transition-all group">
                <svg className="w-8 h-8 text-gray-400 group-hover:text-brand transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-bold text-charcoal group-hover:text-brand transition-colors">
                  {uploadingBrochure ? 'Uploading PDF...' : 'Click to upload Brochure PDF'}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-1">PDF up to 20MB</span>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  disabled={uploadingBrochure}
                  onChange={(e) => handleFileUpload(e, 'brochure')} 
                />
              </label>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200/60 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-charcoal truncate">{form.brochureUrl.split('/').pop()}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">Brochure Attached</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setForm(prev => ({ ...prev, brochureUrl: '' }))}
                  className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100/60 px-3 py-1.5 rounded-xl transition-all"
                >
                  Delete
                </button>
              </div>
            )}
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-2">Users can download this PDF directly from the property card</p>
          </div>

          {}
          <div>
            <label className={labelClass}>Property Image</label>
            {!form.image ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-brand rounded-2xl p-8 cursor-pointer bg-gray-50/50 hover:bg-brand/[0.02] transition-all group">
                <svg className="w-8 h-8 text-gray-400 group-hover:text-brand transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-bold text-charcoal group-hover:text-brand transition-colors">
                  {uploadingImage ? 'Uploading Image...' : 'Click to upload Property Image'}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-1">PNG, JPG, WEBP up to 10MB</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  disabled={uploadingImage}
                  onChange={(e) => handleFileUpload(e, 'image')} 
                />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm group aspect-video sm:h-48 w-full">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button 
                    type="button" 
                    onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {}
          <div>
            <label className={labelClass} htmlFor="pm-description">Description</label>
            <textarea id="pm-description" name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Brief description of the property..." className={`${inputClass} resize-none`} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {}
          <div className="flex gap-3 pt-2 pb-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-2 sm:py-2.5 rounded-[3px] font-bold text-xs sm:text-sm whitespace-nowrap hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading || uploadingImage || uploadingBrochure} className="flex-1 bg-brand text-white py-2 sm:py-2.5 rounded-[3px] font-bold text-xs sm:text-sm whitespace-nowrap hover:bg-brand-hover transition-all disabled:opacity-60">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
