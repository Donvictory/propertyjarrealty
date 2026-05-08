import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about PropertyJar Realty Ltd — our mission, our story, and the expert team behind the world\'s most exclusive luxury real estate experiences.',
  openGraph: {
    title: 'About PropertyJar Realty Ltd',
    description: 'Founded on the belief that finding your dream home should be extraordinary. Meet our team of luxury real estate specialists.',
    url: 'https://propertyjarrealty.com/about',
    images: [{ url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&h=630&fit=crop', width: 1200, height: 630, alt: 'PropertyJar Realty Team' }],
  },
  alternates: { canonical: 'https://propertyjarrealty.com/about' },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-white to-off-white">
        <div className="container mx-auto px-6 pt-12">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl order-1 lg:order-1 border-8 border-white">
              <img 
                src="/profile.jpeg" 
                alt="Jaiyesinmi MA - Founder" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="text-white text-2xl font-bold">Jaiyesinmi MA</p>
                <p className="text-brand font-medium">Founder & CEO</p>
              </div>
            </div>

            <div className="space-y-8 order-2 lg:order-2">
              <h1 className="text-3xl md:text-5xl font-bold text-charcoal leading-tight">
                Hi, I'm <span className="text-brand">Jaiyesinmi MA</span>, <br />
                founder of Property Jar Realty Ltd.
              </h1>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
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
              <div className="pt-4 pb-4">
                <a href="/contact" className="inline-block bg-brand text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-brand-hover transition-all shadow-lg hover:shadow-brand/20 active:scale-95">
                  Work With Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional About Us Section from Screenshot */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Overlapping Images Layer */}
            <div className="lg:w-1/2 relative h-[600px] w-full">
              <div className="absolute top-0 left-0 w-[80%] h-[60%] z-20 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&h=600&fit=crop" 
                  alt="Modern Interior 1" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-[80%] h-[60%] z-10 rounded-2xl overflow-hidden shadow-2xl translate-x-4 -translate-y-4 lg:translate-x-12 lg:-translate-y-12">
                <img 
                  src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&h=600&fit=crop" 
                  alt="Modern Interior 2" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content Layer */}
            <div className="lg:w-1/2 space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-charcoal tracking-tight flex items-center gap-4">
                  ABOUT <span className="w-16 h-px bg-charcoal inline-block opacity-20" /> <span className="italic font-light serif">US</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl font-medium">
                  Property Jar Realty Ltd is a Lagos-based real estate brokerage firm focused on helping local and international investors access high-growth property opportunities.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">We specialize in:</h3>
                <ul className="space-y-3">
                  {['Land banking', 'Smart estates', 'Luxury apartments', 'Off-plan developments'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-600 font-medium text-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-gray-100">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-brand">Our Approach is simple:</h3>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-charcoal leading-none uppercase tracking-tight">Structured Investments</p>
                    <p className="text-lg font-bold text-charcoal leading-none uppercase tracking-tight">Verified Properties</p>
                    <p className="text-lg font-bold text-charcoal leading-none uppercase tracking-tight">Profitable Exit Strategies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 tracking-tight text-black">Our <span className="text-brand">Commitment</span></h2>
          <p className="text-xl text-black italic leading-relaxed">
            "At PropertyJar Realty, we bridge the gap between global investors and the vibrant Lagos real estate market. Our mission is to provide transparency, security, and exceptional returns for every client we serve."
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
