'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Landmark, Zap, Crown, Compass, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const controls = useAnimation();
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      controls.start({
        x: [0, -1600],
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear",
        },
      });
    } else {
      controls.stop();
    }
  }, [isPaused, controls]);

  return (
    <main className="min-h-screen pt-32 bg-white selection:bg-brand selection:text-white">
      
      {/* Founder Section */}
      <section className="py-4 bg-gradient-to-br from-white to-off-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <img 
                src="/profile.jpeg" 
                alt="Jaiyesinmi MA - Founder" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white text-xl font-bold">Jaiyesinmi MA</p>
                <p className="text-brand text-sm font-medium">Founder & CEO</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h1 className="text-3xl md:text-4xl font-medium text-neutral-800 leading-tight tracking-tight">
                Hi, I&apos;m <span className="text-brand">Jaiyesinmi MA</span>, <br />
                founder of PropertyJar Realty Ltd.
              </h1>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed font-medium">
                <p>
                  At Property Jar Realty, we specialize in bridging the gap for UK-based and international investors looking to tap into the high-growth potential of the Lagos real estate market. Our firm provides a sophisticated, data-driven approach to property acquisition, ensuring that every investment is backed by a clear entry and exit strategy tailored to long-term wealth preservation.
                </p>
                <p>
                  We understand that investing from abroad requires an unparalleled level of trust and transparency. That is why we have built a reputation for excellence, offering seamless end-to-end guidance—from initial property identification to secure closing and management. 
                </p>
                <p>
                  Whether you are looking to diversify your portfolio into a fast-growing emerging market or seeking exclusive residential assets, we provide the local expertise and global standards necessary to navigate the Lagos landscape with absolute confidence. If you are ready for secure, premium real estate opportunities, you are in the right place.
                </p>
              </div>
              <div className="pt-4">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/contact" 
                  className="inline-block bg-brand text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-brand-hover transition-all shadow-lg"
                >
                  Work With Us
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specializations Carousel Section */}
      <section className="py-4 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-neutral-800 tracking-tight flex items-center gap-4 uppercase mb-4">
              WE <span className="italic font-light serif text-brand">SPECIALIZE</span> IN
            </h2>
            <p className="text-gray-500 max-w-xl">
              Discover our core pillars of expertise in the Lagos real estate market, designed to maximize your investment potential.
            </p>
          </motion.div>

          {/* Infinite Marquee + Draggable Carousel */}
          <div 
            className="relative flex overflow-hidden group cursor-grab active:cursor-grabbing"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div 
              className="flex gap-4 py-8"
              animate={controls}
              drag="x"
              dragConstraints={{ right: 0, left: -1600 }}
              onDragStart={() => setIsPaused(true)}
            >
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  {[
                    { 
                      title: 'Land Banking', 
                      icon: <Landmark className="w-8 h-8 text-brand" />, 
                      desc: 'Strategic acquisition of high-growth land in developing corridors.' 
                    },
                    { 
                      title: 'Smart Estates', 
                      icon: <Zap className="w-8 h-8 text-brand" />, 
                      desc: 'Modern, tech-integrated communities designed for the next generation.' 
                    },
                    { 
                      title: 'Luxury Apartments', 
                      icon: <Crown className="w-8 h-8 text-brand" />, 
                      desc: 'Bespoke urban living spaces featuring world-class amenities.' 
                    },
                    { 
                      title: 'Off-plan Opportunities', 
                      icon: <Compass className="w-8 h-8 text-brand" />, 
                      desc: 'Exclusive early-access to the city\'s most anticipated projects.' 
                    }
                  ].map((item) => (
                    <div 
                      key={item.title}
                      className="min-w-[280px] md:min-w-[320px] bg-off-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group/card relative overflow-hidden select-none"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-brand opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      <div className="mb-6 group-hover/card:scale-110 transition-transform duration-500 origin-left bg-brand/5 w-14 h-14 rounded-2xl flex items-center justify-center">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold text-charcoal mb-3 group-hover/card:text-brand transition-colors uppercase tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed italic">
                        &quot;{item.desc}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-4 bg-off-white border-y border-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-brand">The PropertyJar Way</h2>
              <h3 className="text-3xl md:text-4xl font-medium text-neutral-800 tracking-tight leading-tight">
                Our approach is simple yet <br />
                <span className="italic serif font-light text-brand">Uncompromising.</span>
              </h3>
              <p className="text-gray-500 max-w-md leading-relaxed">
                PropertyJar Realty Ltd is focused on helping local and international investors access high-growth property opportunities through a rigorous, verification-first model.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { title: 'Structured Investments', desc: 'Financial modeling for clear entry and exit paths.' },
                { title: 'Verified Properties', desc: '100% legal clearance and documentation guaranteed.' },
                { title: 'Profitable Exit Strategies', desc: 'Ensuring your ROI is realized through market-leading data.' }
              ].map((item, idx) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-brand/30 transition-all"
                >
                  <CheckCircle2 className="w-6 h-6 text-brand flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                  <div>
                    <p className="text-base font-bold text-charcoal uppercase tracking-tight mb-0.5">{item.title}</p>
                    <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Block */}
      <section className="py-4">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto py-12 border-t border-gray-50"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-neutral-800 mb-8 tracking-tight">Our <span className="text-brand">Commitment</span></h2>
            <p className="text-xl text-black italic leading-relaxed">
              &quot;At PropertyJar Realty, we bridge the gap between global investors and the vibrant Lagos real estate market. Our mission is to provide transparency, security, and exceptional returns for every client we serve.&quot;
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
