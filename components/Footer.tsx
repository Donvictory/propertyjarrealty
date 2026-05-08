'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-3xl font-bold tracking-tighter mb-6 block">
              PROPERTYJAR<span className="text-brand ml-1">REALTY</span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
              Redefining luxury real estate through exclusive properties and unparalleled service. Your journey to extraordinary living starts here.
            </p>
            <div className="flex gap-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <div key={social} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand hover:text-white transition-all cursor-pointer uppercase text-[8px] font-bold">
                  {social[0]}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/properties" className="hover:text-white transition-colors">Properties</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to receive the latest exclusive listings.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg focus:outline-none flex-1 text-sm"
              />
              <button className="bg-brand text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-hover transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-widest">
          <p>© 2026 PropertyJar Realty. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
