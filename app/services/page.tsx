import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore our full suite of luxury real estate services — buying, selling, investment advisory, relocation, and property management by PropertyJar Realty Ltd.',
  openGraph: {
    title: 'Our Services | PropertyJar Realty Ltd',
    description: 'White-glove real estate services — buying, selling, investment, relocation, and property management.',
    url: 'https://propertyjarrealty.com/services',
    images: [{ url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&h=630&fit=crop', width: 1200, height: 630, alt: 'PropertyJar Realty Services' }],
  },
  alternates: { canonical: 'https://propertyjarrealty.com/services' },
};

const services = [
  {
    icon: '🏠',
    title: 'Property Acquisition',
    subtitle: 'Find Your Dream Home',
    description:
      'We guide you through every step of purchasing a luxury property — from curated viewings to negotiation and closing. Our advisors have access to exclusive off-market listings not available to the public.',
    features: ['Exclusive off-market access', 'Negotiation expertise', 'Due diligence support', 'End-to-end closing'],
    accent: '#800020',
  },
  {
    icon: '💼',
    title: 'Property Sales',
    subtitle: 'Maximize Your Returns',
    description:
      'When it\'s time to sell, our global marketing machine ensures your property reaches the right buyers. Bespoke staging, professional photography, and targeted campaigns deliver premium results.',
    features: ['Global buyer network', 'Professional staging', 'Luxury photography & video', 'Premium marketing campaigns'],
    accent: '#800020',
  },
  {
    icon: '📈',
    title: 'Investment Advisory',
    subtitle: 'Grow Your Portfolio',
    description:
      'Our investment specialists analyze market trends, rental yields, and capital appreciation to help you build a high-performing real estate portfolio with confidence.',
    features: ['Market trend analysis', 'Portfolio diversification', 'ROI projections', 'Tax optimization strategies'],
    accent: '#800020',
  },
  {
    icon: '🔑',
    title: 'Property Management',
    subtitle: 'Hands-Free Ownership',
    description:
      'From tenant sourcing to maintenance coordination, we handle every aspect of managing your investment property — so you can enjoy returns without the hassle.',
    features: ['Tenant vetting & placement', 'Rent collection', 'Maintenance coordination', 'Monthly reporting'],
    accent: '#800020',
  },
  {
    icon: '🌍',
    title: 'Relocation Services',
    subtitle: 'Seamless Transitions',
    description:
      'Moving cities or countries? Our relocation specialists handle every logistical detail — neighborhoods, schools, legal requirements — so your transition is effortless.',
    features: ['Neighborhood consultation', 'School & lifestyle matching', 'Legal & visa guidance', 'Move-in coordination'],
    accent: '#800020',
  },
  {
    icon: '🏛️',
    title: 'Legal & Conveyancing',
    subtitle: 'Protected at Every Step',
    description:
      'Our network of trusted legal partners ensures your transaction is airtight. From title searches to contract review, we safeguard your interests throughout the process.',
    features: ['Title searches & insurance', 'Contract review', 'Settlement coordination', 'Dispute resolution'],
    accent: '#800020',
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-32 bg-white">
      <Navbar />

      {/* Header Section */}
      <section className="bg-white pt-12 pb-6 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
            Our <span className="text-brand">Bespoke</span> Services
          </h1>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto leading-relaxed">
            From property acquisition to investment advisory, we provide a full suite of services tailored to the luxury real estate market.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-off-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-2xl mb-6 group-hover:bg-brand group-hover:scale-110 transition-all duration-300">
                  {service.icon}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand mb-2">{service.subtitle}</p>
                <h2 className="text-2xl font-bold text-charcoal mb-4">{service.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-charcoal text-white">
        <div className="container mx-auto px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand mb-4 block">Get Started</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Work <span className="italic font-light">Together?</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
            Schedule a complimentary consultation with one of our luxury property specialists.
          </p>
          <a
            href="/contact"
            className="inline-block bg-brand text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-brand-hover transition-all"
          >
            Book a Consultation
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
