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

const EMPTY: Omit<Property, 'id'> = {
  title: '',
  location: '',
  price: '',
  beds: 1,
  baths: 1,
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
  const [form, setForm] = useState<Omit<Property, 'id'>>(
    property ? { ...property } : { ...EMPTY }
  );
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

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          beds: Number(form.beds),
          baths: Number(form.baths),
          tag: form.tag || null,
          isCampaign: !!form.isCampaign,
          brochureUrl: form.brochureUrl || '',
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — centered on all devices */}
      <div className="relative bg-white border border-gray-100 w-full rounded-2xl sm:rounded-3xl sm:max-w-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] flex flex-col"
        style={{ maxHeight: 'calc(100dvh - 56px)' }}
      >

        {/* Header */}
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

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto overscroll-contain p-6 space-y-5 flex-1">
          {/* Title */}
          <div>
            <label className={labelClass} htmlFor="pm-title">Property Title</label>
            <input id="pm-title" name="title" required value={form.title} onChange={handleChange} placeholder="e.g. The Glass House" className={inputClass} />
          </div>

          {/* Location */}
          <div>
            <label className={labelClass} htmlFor="pm-location">Location</label>
            <input id="pm-location" name="location" required value={form.location} onChange={handleChange} placeholder="e.g. Malibu, California" className={inputClass} />
          </div>

          {/* Price */}
          <div>
            <label className={labelClass} htmlFor="pm-price">Price</label>
            <input id="pm-price" name="price" required value={form.price} onChange={handleChange} placeholder="e.g. $8,500,000" className={inputClass} />
          </div>

          {/* Beds / Baths / Sqft */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass} htmlFor="pm-beds">Beds</label>
              <input id="pm-beds" name="beds" type="number" min={1} required value={form.beds} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="pm-baths">Baths</label>
              <input id="pm-baths" name="baths" type="number" min={1} required value={form.baths} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="pm-sqft">Sqft</label>
              <input id="pm-sqft" name="sqft" required value={form.sqft} onChange={handleChange} placeholder="e.g. 6,500" className={inputClass} />
            </div>
          </div>

          {/* Type / Tag */}
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

          {/* Campaign toggle */}
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

          {/* Brochure PDF */}
          <div>
            <label className={labelClass} htmlFor="pm-brochure">Brochure PDF (Upload or Paste URL)</label>
            <div className="flex gap-2">
              <input
                id="pm-brochure"
                name="brochureUrl"
                value={form.brochureUrl || ''}
                onChange={handleChange}
                placeholder="Paste PDF URL (https://...)"
                className={inputClass}
              />
              <label className="shrink-0 bg-gray-100 hover:bg-gray-200 text-charcoal border border-gray-200 rounded-[3px] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold cursor-pointer transition-all flex items-center justify-center whitespace-nowrap">
                <span>Upload</span>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'brochure')} 
                />
              </label>
            </div>
            {uploadingBrochure && <p className="text-[10px] text-brand uppercase font-bold tracking-widest mt-1.5 animate-pulse">Uploading PDF...</p>}
            {form.brochureUrl && (
              <div className="mt-2 p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                <span className="text-xs text-charcoal font-medium truncate max-w-[80%]">{form.brochureUrl}</span>
                <button 
                  type="button" 
                  onClick={() => setForm(prev => ({ ...prev, brochureUrl: '' }))}
                  className="text-red-600 hover:text-red-800 text-xs font-bold px-2 py-1"
                >
                  Remove
                </button>
              </div>
            )}
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Users can download this PDF directly from the property card</p>
          </div>

          {/* Image */}
          <div>
            <label className={labelClass} htmlFor="pm-image">Property Image (Upload or Paste URL)</label>
            <div className="flex gap-2">
              <input 
                id="pm-image" 
                name="image" 
                required 
                value={form.image} 
                onChange={handleChange} 
                placeholder="Paste Image URL (https://...)" 
                className={inputClass} 
              />
              <label className="shrink-0 bg-gray-100 hover:bg-gray-200 text-charcoal border border-gray-200 rounded-[3px] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold cursor-pointer transition-all flex items-center justify-center whitespace-nowrap">
                <span>Upload</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'image')} 
                />
              </label>
            </div>
            {uploadingImage && <p className="text-[10px] text-brand uppercase font-bold tracking-widest mt-1.5 animate-pulse">Uploading Image...</p>}
            {form.image && (
              <div className="mt-2 h-32 rounded-xl overflow-hidden border border-gray-100 relative group">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={labelClass} htmlFor="pm-description">Description</label>
            <textarea id="pm-description" name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Brief description of the property..." className={`${inputClass} resize-none`} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
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
