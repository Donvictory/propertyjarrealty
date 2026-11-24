import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPropertyById, getProperties } from '@/lib/properties';
import { resolveImageUrl } from '@/lib/image-url';
import type { Property } from '@/lib/types';
import {
  categoriesOf,
  formatCardPrice,
  formatNaira,
  propertyArtUrl,
  shortLocation,
  toPropertyCard,
  type PropertyCategory,
} from '@/lib/property-display';
import Gallery from '@/components/property/detail/Gallery';
import BrochureDialog from '@/components/property/detail/BrochureDialog';
import Reveal from '@/components/motion/Reveal';

export const revalidate = 60;

const BASE_URL = 'https://propertyjarrealty.com';
const WHATSAPP = 'https://wa.me/2349153869750';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const properties = await getProperties();
    return properties.map((property) => ({ id: property.id }));
  } catch (error) {
    console.error('[Page] generateStaticParams error:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return { title: 'Property Not Found', robots: { index: false, follow: false } };
  }

  const description = property.description.substring(0, 160);
  return {
    title: property.title,
    description,
    openGraph: {
      title: `${property.title} | PropertyJar Realty Ltd`,
      description,
      url: `${BASE_URL}/campaign/${id}`,
    },
    alternates: { canonical: `${BASE_URL}/campaign/${id}` },
  };
}

const HEADLINES: Record<PropertyCategory | 'default', [string, string]> = {
  land: ['Room to build,', 'at your pace.'],
  residential: ['A home,', 'on clear terms.'],
  commercial: ['Space to grow', 'your business.'],
  shortlet: ['Stay a night,', 'or a week.'],
  default: ['Know it well', 'before you buy.'],
};

function headlineFor(cats: PropertyCategory[]) {
  const order: PropertyCategory[] = ['shortlet', 'land', 'commercial', 'residential'];
  return HEADLINES[order.find((c) => cats.includes(c)) ?? 'default'];
}

function factsFor(p: Property, cats: PropertyCategory[], kind: string) {
  if (cats.includes('shortlet')) {
    const s = p.shortLetDetails ?? {};
    return [
      { label: 'Guests', value: s.maxGuests ?? s.guestCapacity ? `Up to ${s.maxGuests ?? s.guestCapacity}` : null },
      { label: 'Check-in', value: s.checkIn ?? null },
      { label: 'Check-out', value: s.checkOut ?? null },
      { label: 'Caution deposit', value: s.cautionDeposit ? `₦${s.cautionDeposit.toLocaleString('en-US')}` : null },
    ].filter((f): f is { label: string; value: string } => Boolean(f.value));
  }

  const landOnly = cats.length === 1 && cats[0] === 'land';
  const facts: { label: string; value: string }[] = [{ label: 'Type', value: kind }];
  if (p.beds && !landOnly) facts.push({ label: 'Bedrooms', value: String(p.beds) });
  if (p.sqft) facts.push({ label: 'Size', value: /[a-z]/i.test(String(p.sqft)) ? String(p.sqft) : `${p.sqft} sqft` });
  if (p.pricingOptions && p.pricingOptions.length > 1) {
    facts.push({ label: 'Options', value: `${p.pricingOptions.length} to choose from` });
  }
  facts.push({ label: 'Payment', value: p.installmentPlan ? 'Outright or instalments' : 'Outright' });
  facts.push({ label: 'Location', value: shortLocation(p.location) });
  return facts.slice(0, 4);
}

function whatsappLink(p: Property, isShortlet: boolean) {
  const text = isShortlet
    ? `Hello PropertyJar Realty, I would like to book ${p.title}.`
    : `Hello PropertyJar Realty, I'm interested in ${p.title}. Could you share more details and arrange an inspection?`;
  return `${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

function ListBlock({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="eyebrow text-muted">{title}</p>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item} className="py-3 text-sm leading-relaxed">
            {item.replace(/^[✨•\-\s]+/u, '')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  const p = property;
  const card = toPropertyCard(p);
  const cats = categoriesOf(p);
  const isShortlet = cats.includes('shortlet');
  // Branded artwork instead of uploaded photos (some carry other companies' logos).
  const images = [propertyArtUrl(p)];
  const facts = factsFor(p, cats, card.kind);
  const [h1, h2] = headlineFor(cats);
  const firstOption = p.pricingOptions?.[0];
  const enquiryHref = whatsappLink(p, isShortlet);
  const savePath = `/campaign/${p.id}`;
  const lists = [
    { title: 'Highlights', items: p.highlights },
    { title: 'Location advantages', items: p.locationAdvantages },
    { title: 'What you can build', items: p.whatYouCanBuild },
  ].filter((l) => l.items && l.items.length > 0);

  return (
    <main className="shell pb-16 pt-10 lg:pt-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-1.5">
          <li>
            <Link href="/properties" className="hover:text-ink">
              Properties
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>{card.kind}</li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">
            {p.title}
          </li>
        </ol>
      </nav>

      <header className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-medium tracking-[-0.03em] lg:text-[52px] lg:leading-[1.05]">{p.title}</h1>
          <p className="mt-4 text-lg text-muted">
            {[card.location, card.kind, p.tag].filter(Boolean).join(' · ')}
          </p>
        </div>
        <Link
          href={`/sign-in?next=${encodeURIComponent(savePath)}&save=${encodeURIComponent(p.id)}`}
          className="inline-flex h-11 shrink-0 items-center self-start border border-line px-5 text-sm font-medium btn-fill btn-ink sm:w-52 sm:self-auto"
        >
          Save property
        </Link>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.75fr_1fr] lg:gap-10">
        <Reveal from="left" className="lg:min-h-[520px]">
          <Gallery images={images} title={p.title} />
        </Reveal>

        <Reveal from="right">
          <aside className="rounded-xl flex h-full flex-col bg-panel p-6 sm:p-7">
            <p className="eyebrow text-muted">{isShortlet ? 'Nightly rate' : 'Price'}</p>
            <p className="mt-4 text-[28px] font-medium tracking-[-0.01em] text-brand">{formatCardPrice(card)}</p>
            {firstOption && !isShortlet && (
              <p className="mt-2 text-sm">{firstOption.size} · Base price</p>
            )}

            {(p.installmentPlan || p.bestFor) && (
              <dl className="mt-6 space-y-4 border-t border-line pt-6 text-sm">
                {p.installmentPlan && (
                  <div>
                    <dt className="text-muted">Payment plan</dt>
                    <dd className="mt-1 leading-relaxed">{p.installmentPlan}</dd>
                  </div>
                )}
                {p.bestFor && (
                  <div>
                    <dt className="text-muted">Best for</dt>
                    <dd className="mt-1 leading-relaxed first-letter:uppercase">{p.bestFor}</dd>
                  </div>
                )}
              </dl>
            )}

            <div className="mt-auto space-y-3 pt-8">
              {p.brochureUrl && !isShortlet && (
                <BrochureDialog
                  brochureUrl={resolveImageUrl(p.brochureUrl)}
                  propertyTitle={p.title}
                  propertyLocation={p.location}
                />
              )}
              <a
                href={enquiryHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-12 w-full items-center px-4 text-sm font-medium ${
                  p.brochureUrl && !isShortlet
                    ? 'border border-line bg-paper btn-fill btn-ink'
                    : 'bg-brand text-white btn-fill btn-brand'
                }`}
              >
                {isShortlet ? 'Reserve on WhatsApp' : 'Send enquiry'}
              </a>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted">
              Enquiries go to our sales team on WhatsApp. Sign in to save this property.
            </p>
          </aside>
        </Reveal>
      </div>

      {facts.length > 0 && (
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-b border-line pb-12 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="eyebrow text-muted">{f.label}</dt>
              <dd className="mt-3 text-lg font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <section className="grid gap-8 py-16 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <Reveal from="left">
          <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.02em] lg:text-4xl">
            {h1}
            <br />
            {h2}
          </h2>
        </Reveal>
        <Reveal from="right">
          <p className="text-lg leading-relaxed">{p.description}</p>
          <p className="mt-8 text-xs leading-relaxed text-muted">
            Final allocation, title documents, fees and availability must be confirmed with our team before payment.
          </p>
        </Reveal>
      </section>

      {lists.length > 0 && (
        <section className={`grid gap-10 pb-16 ${lists.length > 1 ? 'md:grid-cols-2' : ''} ${lists.length > 2 ? 'lg:grid-cols-3' : ''}`}>
          {lists.map((l) => (
            <ListBlock key={l.title} title={l.title} items={l.items} />
          ))}
        </section>
      )}

      {p.pricingOptions && p.pricingOptions.length > 0 && (
        <section className="pb-16">
          <h2 className="text-3xl font-medium tracking-[-0.02em]">{isShortlet ? 'Rates' : 'Payment options'}</h2>
          <p className="mt-3 text-sm text-muted">Prices in naira. Confirm current pricing with our team before paying.</p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="bg-panel">
                  <th scope="col" className="eyebrow px-4 py-4 font-semibold text-muted">
                    Option
                  </th>
                  <th scope="col" className="eyebrow px-4 py-4 font-semibold text-muted">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {p.pricingOptions.map((o) => (
                  <tr key={`${o.size}-${o.price}`} className="border-b border-line">
                    <td className="px-4 py-5">{o.size}</td>
                    <td className="px-4 py-5 tabular-nums">{formatNaira(o.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {p.installmentPlan && <p className="mt-5 text-sm text-muted">Payment plan: {p.installmentPlan}</p>}
        </section>
      )}

      <section className="rounded-xl flex flex-col gap-6 bg-panel px-6 py-9 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-medium tracking-[-0.02em]">
            {isShortlet ? 'Check availability for your dates.' : 'See the location before you commit.'}
          </h2>
          <p className="mt-3 text-sm">
            {isShortlet
              ? 'Tell us your dates and number of guests.'
              : 'Ask for directions, title information and a guided inspection.'}
          </p>
        </div>
        <a
          href={enquiryHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 shrink-0 items-center self-start bg-brand px-8 text-sm font-medium text-white btn-fill btn-brand lg:w-56 lg:self-auto"
        >
          {isShortlet ? 'Reserve on WhatsApp' : 'Send enquiry'}
        </a>
      </section>
    </main>
  );
}
