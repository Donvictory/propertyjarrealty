import type { Metadata } from 'next';
import { getProperties } from '@/lib/properties';
import { getCampaignContent } from '@/lib/campaign';
import { toPropertyCard } from '@/lib/property-display';
import PropertiesBrowser from '@/components/property/PropertiesBrowser';
import WhyLagos from '@/components/investments/WhyLagos';
import InvestmentOptions from '@/components/investments/InvestmentOptions';
import OfferStack from '@/components/investments/OfferStack';
import CtaBand from '@/components/site/CtaBand';
import Reveal from '@/components/motion/Reveal';
import { SHARE_IMAGES } from '@/lib/share-image';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Investment Campaigns',
  description: 'Explore exclusive high-yield luxury real estate investment campaigns in Lagos with PropertyJar Realty Ltd.',
  alternates: {
    canonical: 'https://propertyjarrealty.com/campaign',
  },
  openGraph: {
    images: SHARE_IMAGES,
    title: 'Investment Campaigns | PropertyJar Realty Ltd',
    description: 'Explore exclusive high-yield luxury real estate investment campaigns in Lagos with PropertyJar Realty Ltd.',
    url: 'https://propertyjarrealty.com/campaign',
  },
};

export default async function CampaignPage() {
  const [properties, content] = await Promise.all([getProperties().catch(() => []), getCampaignContent()]);
  const cards = properties.filter((p) => p.isCampaign === true).map(toPropertyCard);

  return (
    <main>
      <WhyLagos content={content} />

      <section id="selection" className="shell py-20 lg:py-28">
        <Reveal from="left">
          <h2 className="text-4xl font-medium tracking-[-0.02em] lg:text-5xl">The selection</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Explore our curated selection of high-yield assets. Select a property to view its full investment summary
            and request the confidential brochure.
          </p>
        </Reveal>
        <div className="mt-12">
          <PropertiesBrowser properties={cards} emptyMessage="No investment properties in this category." />
        </div>
      </section>

      <InvestmentOptions options={content.investmentOptions} />
      <OfferStack offers={content.offerStack} />

      <div className="shell pb-16 lg:pb-20">
        <CtaBand
          title="Not sure which route fits?"
          body="Tell us your budget and timeline. We will walk you through the options."
          cta={{ label: 'Speak to the team', href: '/contact?subject=Investment%20Advisory' }}
        />
      </div>
    </main>
  );
}
