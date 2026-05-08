'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const VideoSection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-4 rounded-full bg-brand/20 border border-brand/30 text-brand text-xs font-bold tracking-widest uppercase mb-6">
                Process
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-8 tracking-tight">
                "Watch <span className="text-brand">How It Works"</span>
              </h2>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-xl">
                We've revolutionized the way you discover and acquire premium properties. Watch our short film to understand our bespoke process, from initial discovery to the moment you step into your new home.
              </p>
              
              <div className="space-y-4">
                {[
                  { step: "01", title: "Curated Selection", desc: "We handpick only the most exceptional properties." },
                  { step: "02", title: "Bespoke Tours", desc: "Experience properties through immersive private viewings." },
                  { step: "03", title: "Seamless Acquisition", desc: "White-glove service from offer to handover." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="text-brand font-bold">{item.step}</span>
                    <div>
                      <h4 className="font-bold text-charcoal">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="flex-1 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer"
            >
              {/* Video Thumbnail / Placeholder */}
              <img 
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop" 
                alt="Property Video" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/30 transition-colors" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-brand text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play fill="white" size={32} />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="glass p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">Now Playing</p>
                  <p className="text-white text-xs font-medium">The PropertyJar Experience (2:45)</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
