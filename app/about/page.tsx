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
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">About Us</h2>
            <div className="w-24 h-1 bg-brand mx-auto rounded-full" />
          </div>

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
              <h1 className="text-4xl md:text-6xl font-bold text-charcoal leading-[1.1]">
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

      <section className="py-24">
        <div className="mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 tracking-tight text-black">Our <span className="text-brand">Commitment</span></h2>
          <p className="text-xl text-black italic leading-relaxed">
            "At PropertyJar Realty, we bridge the gap between global investors and the vibrant Lagos real estate market. Our mission is to provide transparency, security, and exceptional returns for every client we serve."
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
