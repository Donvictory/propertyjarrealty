'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import QRCodeModal from './QRCodeModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'Services', href: '/services' },
    { name: 'Our Campaign', href: '/campaign' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-3 glass-dark shadow-lg' : 'py-5 glass'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center group">
            <span className="text-charcoal group-hover:text-brand transition-colors">PROPERTYJAR</span>
            <span className="text-brand ml-1">REALTY</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-full hover:text-brand ${
                    isActive ? 'text-brand bg-brand/5' : 'text-charcoal'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => setQrModalOpen(true)}
              className="p-2 text-charcoal hover:text-brand transition-colors bg-white/50 rounded-full"
              title="Share Page via QR Code"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
            <Link
              href="/contact"
              className="bg-brand text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-brand-hover transition-all shadow-md hover:shadow-brand/20 active:scale-95"
            >
              List Property
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center space-x-4 lg:hidden">
             <button
              onClick={() => setQrModalOpen(true)}
              className="p-2 text-charcoal hover:text-brand transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
            <button
              className="relative w-10 h-10 flex flex-col items-center justify-center space-y-1.5 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-charcoal block transition-transform origin-center"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-charcoal block transition-opacity"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-charcoal block transition-transform origin-center"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-lg font-bold p-3 rounded-2xl transition-all ${
                        isActive ? 'text-brand bg-brand/5 pl-6' : 'text-charcoal hover:pl-6'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <div className="pt-4">
                  <Link
                    href="/contact"
                    className="w-full bg-brand text-white py-4 rounded-2xl font-bold text-center block shadow-lg active:scale-95 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    List Property
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      <QRCodeModal 
        isOpen={qrModalOpen} 
        onClose={() => setQrModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
