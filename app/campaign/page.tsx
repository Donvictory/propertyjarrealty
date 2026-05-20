import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProperties } from '@/lib/properties';
import { getCampaignContent } from '@/lib/campaign';
import CampaignClient from './CampaignClient';

export const metadata: Metadata = {
  title: 'Investment Campaigns',
  description: 'Explore exclusive high-yield luxury real estate investment campaigns in Lagos with PropertyJar Realty Ltd.',
  alternates: {
    canonical: 'https://propertyjarrealty.com/campaign',
  },
  openGraph: {
    title: 'Investment Campaigns | PropertyJar Realty Ltd',
    description: 'Explore exclusive high-yield luxury real estate investment campaigns in Lagos with PropertyJar Realty Ltd.',
    url: 'https://propertyjarrealty.com/campaign',
  },
};

export default async function CampaignPage() {
  const [properties, campaignContent] = await Promise.all([
    getProperties(),
    getCampaignContent()
  ]);

  const campaignProperties = properties.filter(p => p.isCampaign === true);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="flex flex-col items-center gap-8">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-brand/20 rounded-full" />
            <div className="absolute inset-0 border-t-2 border-brand rounded-full animate-spin" />
            <div className="absolute inset-4 bg-brand/10 rounded-full animate-pulse" />
          </div>
          <p className="text-charcoal font-bold animate-pulse uppercase tracking-[0.4em] text-[10px]">PropertyjarRealty Ltd</p>
        </div>
      </div>
    }>
      <CampaignClient properties={campaignProperties} initialContent={campaignContent} />
    </Suspense>
  );
}
