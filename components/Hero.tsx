'use client';

import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-20">
      
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop")',
        }}
      >
         
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-brand/20 border border-brand/30 text-brand text-xs font-bold tracking-widest uppercase mb-6">
              Premium Real Estate Agency
            </span>
            <h1 className="text-4xl md:text-8xl font-bold text-white mb-6 tracking-tight leading-[0.9]">
              Elevating <br />
              <span className="text-brand">Luxury</span> Living.
            </h1>
            <p className="text-xl text-white/70 mb-12 max-w-xl font-light leading-relaxed">
              We provide a bespoke experience in acquiring the world's most prestigious properties. Your journey to an extraordinary home starts here.
            </p>
          </motion.div>

           
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="glass p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-white/10"
          >
            <div className="flex-1 w-full flex flex-col items-start px-8 py-4 border-b md:border-b-0 md:border-r border-white/10 group">
              <label className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1 group-hover:translate-x-1 transition-transform">Location</label>
              <input 
                type="text" 
                placeholder="Search by city or zip..." 
                className="w-full bg-transparent text-white font-medium focus:outline-none placeholder:text-white/30"
              />
            </div>
            
            <div className="flex-1 w-full flex flex-col items-start px-8 py-4 border-b md:border-b-0 md:border-r border-white/10 group">
              <label className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1 group-hover:translate-x-1 transition-transform">Property Type</label>
              <select className="w-full bg-transparent text-white font-medium focus:outline-none appearance-none cursor-pointer">
                <option className="bg-charcoal text-white">Residential</option>
                <option className="bg-charcoal text-white">Commercial</option>
                <option className="bg-charcoal text-white">Luxury Villas</option>
                <option className="bg-charcoal text-white">Modern Penthouses</option>
              </select>
            </div>

            <div className="flex-1 w-full flex flex-col items-start px-8 py-4 group">
              <label className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1 group-hover:translate-x-1 transition-transform">Price Range</label>
              <select className="w-full bg-transparent text-white font-medium focus:outline-none appearance-none cursor-pointer">
                <option className="bg-charcoal text-white">$1M - $5M</option>
                <option className="bg-charcoal text-white">$5M - $10M</option>
                <option className="bg-charcoal text-white">$10M - $50M</option>
                <option className="bg-charcoal text-white">$50M+</option>
              </select>
            </div>

            <button className="w-full md:w-auto bg-brand text-white px-12 py-5 rounded-2xl font-bold hover:bg-brand-hover transition-all shadow-lg hover:shadow-brand/40 active:scale-95">
              Explore
            </button>
          </motion.div>
        </div>
      </div>

       
    </section>
  );
};

export default Hero;
