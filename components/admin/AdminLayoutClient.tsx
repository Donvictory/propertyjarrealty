'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SessionPayload } from '@/lib/types';

export default function AdminLayoutClient({ 
  children, 
  session 
}: { 
  children: ReactNode,
  session: SessionPayload
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-off-white flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
           <p className="text-sm font-bold text-charcoal tracking-tighter uppercase">
            PropertyJar<span className="text-brand">Admin</span>
          </p>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-charcoal p-2 text-2xl focus:outline-none"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-[80] transform transition-transform duration-300 w-64
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <AdminSidebar session={session} onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
