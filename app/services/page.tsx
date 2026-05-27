import { Handshake, House, Building2, TrendingUp, Landmark, BarChart3 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';


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
    icon: <House className='size-6 text-brand' />,
    title: 'Brokerage',
    subtitle: 'Expert Transaction Support',
    description:
      'Our brokerage services provide end-to-end support for buying and selling premium real estate. We manage negotiations, due diligence, and legal transitions with absolute precision.',
    features: ['Strategic negotiations', 'Seamless closings', 'Vetted buyer network', 'Premium listing exposure'],
    accent: '#800020',
  },
  {
    icon: <Handshake className='size-6 text-brand' />,
    title: 'Real Estate Consulting',
    subtitle: 'Strategic Market Insights',
    description:
      'We provide professional guidance on market entry, property valuation, and local regulatory landscapes to help you make informed real estate decisions.',
    features: ['Market entry strategy', 'Valuation services', 'Regulatory compliance', 'Feasibility studies'],
    accent: '#800020',
  },
  {
    icon: <BarChart3 className='size-6 text-brand' />,
    title: 'Investment Portfolio Management',
    subtitle: 'Wealth Building Strategies',
    description:
      'Build and manage a high-yield real estate portfolio. We help you identify, acquire, and manage multiple assets to ensure long-term capital appreciation and consistent cash flow.',
    features: ['Diversified asset selection', 'Performance monitoring', 'Tenant & yield management', 'Exit planning'],
    accent: '#800020',
  },
  {
    icon: <Landmark className='size-6 text-brand' />,
    title: 'Land Banking',
    subtitle: 'High-Growth Asset Growth',
    description:
      'Secure high-potential land in developing corridors. Our land banking service focuses on acquiring undervalued land for future development or high-margin resale.',
    features: ['Strategic land acquisition', 'Title verification', 'Growth corridor analysis', 'Appreciation tracking'],
    accent: '#800020',
  },
  {
    icon: <TrendingUp className='size-6 text-brand' />,
    title: 'Luxury Property Sales',
    subtitle: 'Exclusive Lifestyle Assets',
    description:
      'Access the most prestigious residential and commercial properties in Lagos. We represent the pinnacle of luxury living, offering exclusive assets to discerning clients.',
    features: ['Exclusive penthouses', 'Smart home villas', 'Off-market mansions', 'Bespoke viewing experiences'],
    accent: '#800020',
  },
  {
    icon: <Building2 className='size-6 text-brand' />,
    title: 'Investment Advisory Services',
    subtitle: 'Data-Driven Decisions',
    description:
      'Our advisory services focus on maximizing ROI through rigorous data analysis, risk assessment, and structured investment modeling for international investors.',
    features: ['ROI modeling', 'Risk mitigation', 'Foreign exchange advisory', 'Structured investment plans'],
    accent: '#800020',
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">


      {}
      <section className="bg-white py-16 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-medium text-neutral-800 tracking-tight">
            Our <span className="text-brand">Bespoke</span> Services
          </h1>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto leading-relaxed">
            From property acquisition to investment advisory, we provide a full suite of services tailored to the luxury real estate market.
          </p>
        </div>
      </section>

      {}
      <section className="py-16 bg-off-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-all duration-300">
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

      {}
      <section className="py-16 bg-neutral-100 text-neutral-700">
        <div className="container mx-auto px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand mb-4 block">Get Started</span>
          <h2 className="text-3xl md:text-4xl font-medium mb-6 text-neutral-800">
            Ready to Work <span className="italic font-light">Together?</span>
          </h2>
          <p className="max-w-xl mx-auto mb-10">
            Schedule a complimentary consultation with one of our luxury property specialists.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-brand text-white px-10 py-4 rounded-sm font-bold hover:bg-brand-hover transition-all"
          >
            Book a Consultation
          </Link>
        </div>
      </section>


    </main>
  );
}
