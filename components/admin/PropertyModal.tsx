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
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    'w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand transition-colors';
  const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5';

  return (
    // z-[90] ensures modal is above the mobile admin header (z-[60]) and sidebar (z-[80])
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — slides up from bottom on mobile, centered on desktop */}
      <div className="relative bg-[#111111] border border-white/10 w-full sm:rounded-3xl rounded-t-3xl sm:max-w-2xl sm:mx-4 shadow-2xl flex flex-col"
        style={{ maxHeight: 'calc(100dvh - 56px)', marginTop: 'auto' }}
      >
        {/* Drag handle (mobile hint) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Property' : 'Add New Property'}</h2>
            <p className="text-gray-500 text-xs mt-0.5">{isEdit ? `Editing: ${property!.title}` : 'Fill in the details below'}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all text-xl leading-none flex-shrink-0"
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
          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
            <input
              type="checkbox"
              id="pm-campaign"
              name="isCampaign"
              checked={form.isCampaign}
              onChange={(e) => setForm(prev => ({ ...prev, isCampaign: e.target.checked }))}
              className="w-5 h-5 rounded border-white/10 bg-[#1a1a1a] text-brand focus:ring-brand accent-brand"
            />
            <label htmlFor="pm-campaign" className="text-sm font-bold text-white cursor-pointer select-none">
              Add to Campaign Page
              <span className="block text-[10px] font-normal text-gray-500 uppercase tracking-widest mt-0.5">Show this property in the campaign selection</span>
            </label>
          </div>

          {form.isCampaign && (
            <div className="bg-brand/5 p-5 rounded-2xl border border-brand/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className={labelClass} htmlFor="pm-brochure">Brochure PDF URL (Campaign Only)</label>
              <input
                id="pm-brochure"
                name="brochureUrl"
                value={form.brochureUrl || ''}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClass}
              />
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Users must fill a form to download this PDF on the campaign page</p>
            </div>
          )}

          {/* Image URL */}
          <div>
            <label className={labelClass} htmlFor="pm-image">Image URL</label>
            <input id="pm-image" name="image" required value={form.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." className={inputClass} />
            {form.image && (
              <div className="mt-2 h-32 rounded-xl overflow-hidden border border-white/10">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={labelClass} htmlFor="pm-description">Description</label>
            <textarea id="pm-description" name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Brief description of the property..." className={`${inputClass} resize-none`} />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 pb-2">
            <button type="button" onClick={onClose} className="flex-1 border border-white/10 text-gray-400 py-3 rounded-xl font-bold text-sm hover:bg-white/5 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-brand text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-hover transition-all disabled:opacity-60">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
