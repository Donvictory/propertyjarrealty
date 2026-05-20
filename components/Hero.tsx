'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-20">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="/hero-bg.png"
          alt="Luxury Real Estate"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        {/* Deep Cinematic Overlays */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
      </div>

    

      {/* Content */}
      <div className="container mx-auto px-6 relative z-30">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="drop-shadow-2xl"
          >
          
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-white mb-10 tracking-tighter leading-[0.95] max-w-4xl drop-shadow-2xl">
              Modernizing <br />
              <span className="text-brand italic font-light serif">Luxury</span> Real Estate.
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl font-light leading-relaxed drop-shadow-lg">
              We provide a bespoke, data-driven experience in acquiring the world&apos;s most prestigious properties in Lagos. Your journey to an extraordinary investment starts here.
            </p>
          </motion.div>

          {/* Stats Bar */}
         
           
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-center gap-6"
          >
            <Link 
              href="/properties"
              className="w-full md:w-auto bg-brand text-white px-14 py-4 rounded-full font-bold hover:bg-brand-hover transition-all shadow-2xl shadow-brand/20 active:scale-95 text-center uppercase tracking-widest text-xs"
            >
              Explore Selection
            </Link>
            
            <Link 
              href="/campaign"
              className="w-full md:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-full font-bold hover:bg-white hover:text-charcoal transition-all active:scale-95 text-center uppercase tracking-widest text-xs"
            >
              Investor Campaign
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
