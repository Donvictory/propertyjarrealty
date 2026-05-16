'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="py-4 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
 
              </div>
              <h2 className="text-3xl md:text-4xl font-medium text-neutral-800 mb-8 tracking-tight">
                &ldquo;Watch <span className="text-brand">How It Works&rdquo;</span>
              </h2>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-xl">
                We&rsquo;ve revolutionized the way you discover and acquire premium properties. Watch our short film to understand our bespoke process, from initial discovery to the moment you step into your new home.
              </p>
              
              <div className="space-y-6">
                {[
                  { step: "01", title: "Curated Selection", desc: "We handpick only the most exceptional properties." },
                  { step: "02", title: "Bespoke Tours", desc: "Experience properties through immersive private viewings." },
                  { step: "03", title: "Seamless Acquisition", desc: "White-glove service from offer to handover." }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ x: 10 }}
                    className="flex gap-6 group cursor-default"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-brand/30 font-bold text-sm mb-1">{item.step}</span>
                      <div className="w-px h-full bg-gray-100 group-last:hidden" />
                    </div>
                    <div className="pb-4">
                      <h4 className="font-bold text-charcoal uppercase tracking-widest text-sm mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
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
              className="relative aspect-[9/16] max-w-sm mx-auto rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] group cursor-pointer bg-charcoal"
              onClick={togglePlay}
            >
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover transition-transform duration-700"
                poster="/thumbnail.jpeg"
                loop
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src="/IMG_5677.MOV" type="video/quicktime" />
                <source src="/IMG_5677.MOV" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Glassmorphism Overlay */}
              <div className={`absolute inset-0 bg-charcoal/20 backdrop-blur-[2px] transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />
              
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${isPlaying ? 'scale-150 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
                <div className="w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-brand transition-all duration-500">
                  <Play fill="white" size={32} className="ml-1" />
                </div>
              </div>

              {/* Status Indicator */}
              {!isPlaying && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.4em] whitespace-nowrap bg-black/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                    Click to Experience
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
