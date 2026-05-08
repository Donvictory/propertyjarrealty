import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About Us — PropertyJar Realty',
  description: 'Learn about PropertyJar Realty — our mission, our story, and the team behind the world\'s most exclusive luxury real estate experiences.',
};

const stats = [
  { value: '15+', label: 'Years of Excellence' },
  { value: '$2.4B+', label: 'Properties Sold' },
  { value: '1,200+', label: 'Happy Clients' },
  { value: '30+', label: 'Markets Covered' },
];

const team = [
  {
    name: 'Victoria Chase',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    bio: 'With 20 years in luxury real estate, Victoria founded PropertyJar Realty with a vision to redefine the home-buying experience.',
  },
  {
    name: 'Marcus Bennett',
    role: 'Head of Acquisitions',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
    bio: 'Marcus brings deep expertise in off-market transactions and has brokered over $400M in landmark deals.',
  },
  {
    name: 'Sophia Laurent',
    role: 'Director of Client Relations',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    bio: "Sophia's passion for people-first service has earned PropertyJar Realty its reputation for exceptional client care.",
  },
  {
    name: 'James Okafor',
    role: 'Chief Investment Strategist',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    bio: 'A former investment banker, James specializes in helping clients build high-yield luxury property portfolios.',
  },
];

const values = [
  { icon: '⭐', title: 'Excellence', description: 'We never settle for ordinary. Every property and service reflects the highest standard of quality.' },
  { icon: '🤝', title: 'Integrity', description: 'Trust is the foundation of every relationship. We operate with complete transparency and honesty.' },
  { icon: '🎯', title: 'Precision', description: 'We listen deeply to understand your vision, then execute precisely to find exactly the right fit.' },
  { icon: '🌐', title: 'Global Reach', description: 'Our network spans 30+ markets worldwide, giving clients access to exclusive opportunities everywhere.' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative pt-40 pb-24 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop)' }} />
        <div className="relative container mx-auto px-6 text-white text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand mb-4 block">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">About <span className="italic font-light">Us</span></h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">PropertyJar Realty was built on one belief — that finding your dream home should be an extraordinary experience, not just a transaction.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-brand mb-2">{s.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-off-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand mb-4 block">Our Mission</span>
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-8">Redefining <span className="italic font-light">Luxury Living</span></h2>
            <p className="text-gray-500 leading-relaxed mb-6">Since 2011, PropertyJar Realty has set the benchmark for luxury real estate. We combine global market intelligence with deeply personal service to deliver outcomes that exceed expectations.</p>
            <p className="text-gray-500 leading-relaxed">Our advisors are more than agents — they are trusted partners who understand that a home is a foundation for life's most meaningful moments.</p>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop" alt="Luxury interior" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand mb-4 block">What Drives Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">Our <span className="italic font-light">Values</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="text-center p-8 rounded-2xl border border-gray-100 hover:border-brand/30 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold text-charcoal mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-off-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand mb-4 block">The Experts</span>
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">Meet the <span className="italic font-light">Team</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <div className="h-64 overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand mb-1">{member.role}</p>
                  <h3 className="text-xl font-bold text-charcoal mb-3">{member.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
