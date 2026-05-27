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
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  
  const stats = [
    { label: 'Total Properties', value: properties.length, icon: '🏠', color: 'brand' },
    { label: 'Active Listings', value: properties.filter((p) => p.tag !== 'Sold').length, icon: '✅', color: 'green' },
    { label: 'Sold', value: properties.filter((p) => p.tag === 'Sold').length, icon: '🔑', color: 'gray' },
    { label: 'Featured', value: properties.filter((p) => ['Exclusive', 'Featured', 'New Listing'].includes(p.tag ?? '')).length, icon: '⭐', color: 'yellow' },
  ];

  const colorMap: Record<string, string> = {
    brand: 'text-brand',
    green: 'text-green-500',
    gray: 'text-gray-400',
    yellow: 'text-yellow-500',
  };

  const bgMap: Record<string, string> = {
    brand: 'bg-brand/5 border-brand/20',
    green: 'bg-green-50 border-green-100',
    gray: 'bg-gray-50 border-gray-100',
    yellow: 'bg-yellow-50 border-yellow-100',
  };

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalFiltered = filtered.length;
  const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE);
  const displayPage = Math.min(currentPage, Math.max(1, totalPages));
  const paginated = filtered.slice((displayPage - 1) * ITEMS_PER_PAGE, displayPage * ITEMS_PER_PAGE);

  const startIdx = totalFiltered === 0 ? 0 : (displayPage - 1) * ITEMS_PER_PAGE + 1;
  const endIdx = Math.min(displayPage * ITEMS_PER_PAGE, totalFiltered);

   
  const pageRange = [];
  const maxButtons = 5;
  let startPage = Math.max(1, displayPage - 2);
  const endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageRange.push(i);
  }

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

  async function confirmDelete() {
    if (!deletingProperty) return;
    const id = deletingProperty.id;
    setDeletingProperty(null);
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
      {}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className={`border rounded-2xl p-5 shadow-sm transition-all ${bgMap[stat.color]}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className={`text-4xl font-bold ${colorMap[stat.color]}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search properties..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-charcoal text-sm placeholder:text-gray-400 focus:outline-none focus:border-brand transition-colors shadow-sm"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-[3px] font-bold text-xs sm:text-sm hover:bg-brand-hover transition-all whitespace-nowrap shadow-md active:scale-95"
        >
          <span className="text-base leading-none">+</span> Add Property
        </button>
      </div>

      {}
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
              {totalFiltered === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 text-sm">
                    {search ? 'No properties match your search.' : 'No properties yet. Add one above.'}
                  </td>
                </tr>
              )}
              {paginated.map((p) => (
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
                    {[
                      p.beds ? `${p.beds}bd` : null,
                      p.baths ? `${p.baths}ba` : null,
                      p.sqft ? `${p.sqft} sqft` : null,
                    ].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td className="px-6 py-4">
                    {p.tag ? (
                      <span className={`inline-block px-2.5 py-1 rounded-[3px] text-[10px] font-bold uppercase tracking-widest border ${TAG_COLORS[p.tag] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
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
                        className="px-3 py-1.5 rounded-[3px] text-xs font-bold text-gray-500 hover:text-charcoal hover:bg-gray-100 transition-all border border-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingProperty(p)}
                        disabled={deletingId === p.id}
                        className="px-3 py-1.5 rounded-[3px] text-xs font-bold text-red-500 hover:text-white hover:bg-red-600 transition-all border border-red-100 disabled:opacity-50"
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

        {/* Footer with Premium Pagination */}
        <div className="border-t border-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="font-semibold text-charcoal">{startIdx}</span> to{" "}
            <span className="font-semibold text-charcoal">{endIdx}</span> of{" "}
            <span className="font-semibold text-charcoal">{totalFiltered}</span> properties
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={displayPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-gray-500"
                aria-label="Previous page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {pageRange.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[36px] h-9 px-3 rounded-lg text-xs font-bold transition-all ${
                    displayPage === page
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={displayPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-gray-500"
                aria-label="Next page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {}
      {modal && (
        <PropertyModal
          property={modal === 'edit' ? editing : null}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {}
      {deletingProperty && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(16px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .animate-fade-in {
              animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-slide-up {
              animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>

          {}
          <div 
            onClick={() => setDeletingProperty(null)}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
          />
          
          {}
          <div className="relative bg-white rounded-3xl overflow-hidden max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-slide-up transition-all z-10">
            {}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-6">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {}
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-charcoal mb-2">Delete Property?</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Are you sure you want to permanently delete <span className="font-bold text-charcoal">{deletingProperty.title}</span>? This action is permanent and cannot be undone.
              </p>
            </div>

            {}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setDeletingProperty(null)}
                className="flex-1 px-5 py-3 border border-gray-200 text-charcoal hover:bg-gray-50 rounded-xl text-sm font-bold transition-all text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200 transition-all text-center"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
