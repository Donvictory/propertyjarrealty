import type { Metadata } from 'next';
import Link from 'next/link';
import PageIntro from '@/components/site/PageIntro';
import CtaBand from '@/components/site/CtaBand';
import Reveal from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Brokerage, real estate consulting, portfolio management, land banking, luxury property sales and investment advisory from PropertyJar Realty Ltd.',
  openGraph: {
    title: 'Our Services | PropertyJar Realty Ltd',
    description: 'From property acquisition to investment advisory, a full suite of real estate services in Lagos.',
    url: 'https://propertyjarrealty.com/services',
  },
  alternates: { canonical: 'https://propertyjarrealty.com/services' },
};

const SERVICES = [
  {
    title: 'Brokerage',
    subtitle: 'Expert transaction support.',
    description:
      'Our brokerage services provide end-to-end support for buying and selling premium real estate. We manage negotiations, due diligence, and legal transitions with absolute precision.',
    features: ['Strategic negotiations', 'Seamless closings', 'Vetted buyer network', 'Premium listing exposure'],
  },
  {
    title: 'Real estate consulting',
    subtitle: 'Strategic market insights.',
    description:
      'We provide professional guidance on market entry, property valuation, and local regulatory landscapes to help you make informed real estate decisions.',
    features: ['Market entry strategy', 'Valuation services', 'Regulatory compliance', 'Feasibility studies'],
  },
  {
    title: 'Investment portfolio management',
    subtitle: 'Wealth building strategies.',
    description:
      'Build and manage a high-yield real estate portfolio. We help you identify, acquire, and manage multiple assets to ensure long-term capital appreciation and consistent cash flow.',
    features: ['Diversified asset selection', 'Performance monitoring', 'Tenant & yield management', 'Exit planning'],
  },
  {
    title: 'Land banking',
    subtitle: 'High-growth asset growth.',
    description:
      'Secure high-potential land in developing corridors. Our land banking service focuses on acquiring undervalued land for future development or high-margin resale.',
    features: ['Strategic land acquisition', 'Title verification', 'Growth corridor analysis', 'Appreciation tracking'],
  },
  {
    title: 'Luxury property sales',
    subtitle: 'Exclusive lifestyle assets.',
    description:
      'Access the most prestigious residential and commercial properties in Lagos. We represent the pinnacle of luxury living, offering exclusive assets to discerning clients.',
    features: ['Exclusive penthouses', 'Smart home villas', 'Off-market mansions', 'Bespoke viewing experiences'],
  },
  {
    title: 'Investment advisory services',
    subtitle: 'Data-driven decisions.',
    description:
      'Our advisory services focus on maximizing ROI through rigorous data analysis, risk assessment, and structured investment modeling for international investors.',
    features: ['ROI modeling', 'Risk mitigation', 'Foreign exchange advisory', 'Structured investment plans'],
  },
];

type Service = (typeof SERVICES)[number];

/** Each tile gets its own tone; text, rules and the enquire button follow it. */
const TONES = {
  ink: { tile: 'bg-ink text-paper', muted: 'text-paper/70', rule: 'border-paper/20', btn: 'border-paper/40 btn-paper' },
  brand: { tile: 'bg-brand text-white', muted: 'text-white/75', rule: 'border-white/25', btn: 'border-white/40 btn-paper' },
  panel: { tile: 'bg-panel text-ink', muted: 'text-muted', rule: 'border-line', btn: 'border-ink/25 btn-ink' },
  sage: { tile: 'bg-sage-200 text-ink', muted: 'text-ink/65', rule: 'border-sage-line/50', btn: 'border-ink/25 btn-ink' },
  sageLight: { tile: 'bg-sage-100 text-ink', muted: 'text-ink/65', rule: 'border-sage-line/50', btn: 'border-ink/25 btn-ink' },
} as const;

// Mosaic placement (lg, 3 columns):
//   [ lead (2 cols)        ][ tile ]
//   [ tile ][ tile ][ tile ]
//   [ wide (3 cols, laid out horizontally) ]
type Variant = 'lead' | 'tile' | 'wide';
const LAYOUT: { tone: keyof typeof TONES; span: string; variant: Variant }[] = [
  { tone: 'ink', span: 'md:col-span-2', variant: 'lead' },
  { tone: 'panel', span: '', variant: 'tile' },
  { tone: 'sage', span: '', variant: 'tile' },
  { tone: 'sageLight', span: '', variant: 'tile' },
  { tone: 'brand', span: '', variant: 'tile' },
  { tone: 'panel', span: 'md:col-span-2 lg:col-span-3', variant: 'wide' },
];

function ServiceTile({ service, tone, variant }: { service: Service; tone: keyof typeof TONES; variant: Variant }) {
  const t = TONES[tone];
  const title = service.title.replace(/^./, (c) => c.toUpperCase());
  const lead = variant === 'lead';
  const wide = variant === 'wide';

  const enquire = (
    <Link
      href={`/contact?subject=${encodeURIComponent(title)}`}
      aria-label={`Enquire about ${title}`}
      className={`btn-fill inline-flex h-11 items-center border px-5 text-sm font-medium ${t.btn}`}
    >
      Enquire
    </Link>
  );

  if (wide) {
    return (
      <article className={`grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1.4fr_1fr] lg:gap-12 lg:p-10 ${t.tile}`}>
        <div>
          <h2 className="text-3xl font-medium leading-tight tracking-[-0.02em]">{title}</h2>
          <p className="mt-2 font-medium">{service.subtitle}</p>
        </div>
        <p className={`leading-relaxed ${t.muted}`}>{service.description}</p>
        <div className="flex flex-col justify-between gap-6">
          <ul className="space-y-1.5 text-sm">
            {service.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div>{enquire}</div>
        </div>
      </article>
    );
  }

  return (
    <article className={`flex h-full flex-col p-6 sm:p-8 ${lead ? 'lg:p-12' : ''} ${t.tile}`}>
      <h2
        className={`font-medium tracking-[-0.02em] ${
          lead ? 'text-4xl leading-[1.05] lg:text-[56px]' : 'text-2xl leading-tight'
        }`}
      >
        {title}
      </h2>
      <p className={`font-medium ${lead ? 'mt-4 text-xl' : 'mt-2'}`}>{service.subtitle}</p>
      <p className={`mt-4 leading-relaxed ${lead ? 'max-w-xl text-lg' : 'text-sm'} ${t.muted}`}>{service.description}</p>

      <ul className={`mt-6 border-t pt-5 text-sm ${t.rule} ${lead ? 'grid gap-x-8 gap-y-2 sm:grid-cols-2' : 'space-y-1.5'}`}>
        {service.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <div className="mt-auto pt-8">{enquire}</div>
    </article>
  );
}

export default function ServicesPage() {
  return (
    <main className="shell pb-16 pt-14 lg:pt-20">
      <PageIntro
        eyebrow="Our services"
        title="Our bespoke services."
        lede="From property acquisition to investment advisory, we provide a full suite of services tailored to the luxury real estate market."
      />

      <ul className="mt-16 grid gap-3 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-4">
        {SERVICES.map((s, i) => {
          const { tone, span, variant } = LAYOUT[i] ?? { tone: 'panel' as const, span: '', variant: 'tile' as const };
          return (
            <li key={s.title} className={span}>
              <Reveal from={i % 2 === 0 ? 'left' : 'right'} delay={(i % 3) * 0.08} className="h-full">
                <ServiceTile service={s} tone={tone} variant={variant} />
              </Reveal>
            </li>
          );
        })}
      </ul>

      <div className="mt-20">
        <CtaBand
          title="Ready to work together?"
          body="Schedule a complimentary consultation with one of our property specialists."
          cta={{ label: 'Book a consultation', href: '/contact' }}
        />
      </div>
    </main>
  );
}
