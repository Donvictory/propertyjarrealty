'use client';

import { useState } from 'react';
import type { Property } from '@/lib/types';
import PropertyModal from './PropertyModal';

interface PropertyTableProps {
  initialProperties: Property[];
}

export default function PropertyTable({ initialProperties }: PropertyTableProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Property | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditing(null);
    setModal('add');
  }

  function openEdit(p: Property) {
    setEditing(p);
    setModal('edit');
  }

  function handleSaved(saved: Property) {
    setProperties((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev];
    });
    setModal(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this property?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete property. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  const TAG_COLORS: Record<string, string> = {
    Exclusive: 'bg-purple-50 text-purple-700 border-purple-200',
    'New Listing': 'bg-green-50 text-green-700 border-green-200',
    Featured: 'bg-blue-50 text-blue-700 border-blue-200',
    Sold: 'bg-gray-100 text-gray-600 border-gray-200',
    'Hot Deal': 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <>
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-charcoal text-sm placeholder:text-gray-400 focus:outline-none focus:border-brand transition-colors shadow-sm"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-hover transition-all whitespace-nowrap shadow-md active:scale-95"
        >
          <span className="text-base leading-none">+</span> Add Property
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Property</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden md:table-cell">Location</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden lg:table-cell">Price</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden lg:table-cell">Details</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tag</th>
                <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 text-sm">
                    {search ? 'No properties match your search.' : 'No properties yet. Add one above.'}
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-charcoal leading-tight">{p.title}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{p.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{p.location}</td>
                  <td className="px-6 py-4 text-charcoal font-bold hidden lg:table-cell">{p.price}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs hidden lg:table-cell">
                    {p.beds}bd · {p.baths}ba · {p.sqft} sqft
                  </td>
                  <td className="px-6 py-4">
                    {p.tag ? (
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${TAG_COLORS[p.tag] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {p.tag}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-charcoal hover:bg-gray-100 transition-all border border-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:text-white hover:bg-red-600 transition-all border border-red-100 disabled:opacity-50"
                      >
                        {deletingId === p.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div className="border-t border-gray-50 px-6 py-3 text-xs text-gray-400 bg-gray-50/30">
          Showing {filtered.length} of {properties.length} properties
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <PropertyModal
          property={modal === 'edit' ? editing : null}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
