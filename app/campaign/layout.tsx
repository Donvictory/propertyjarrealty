import type { Metadata } from 'next';
import { SHARE_IMAGES } from '@/lib/share-image';

export const metadata: Metadata = {
  title: 'Investment Campaign',
  description: 'Explore our latest real estate investment campaign. High-yield opportunities in Lagos for savvy global investors.',
  openGraph: {
    images: SHARE_IMAGES,
    title: 'PropertyJar Realty Investment Campaign',
    description: 'Join our exclusive investment campaign and discover high-growth real estate opportunities.',
    url: 'https://propertyjarrealty.com/campaign',
  },
  alternates: { canonical: 'https://propertyjarrealty.com/campaign' },
};

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
