import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investment Campaign',
  description: 'Explore our latest real estate investment campaign. High-yield opportunities in Lagos for savvy global investors.',
  openGraph: {
    title: 'PropertyJar Realty Investment Campaign',
    description: 'Join our exclusive investment campaign and discover high-growth real estate opportunities.',
    url: 'https://propertyjarrealty.com/campaign',
    images: [{ url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop', width: 1200, height: 630, alt: 'PropertyJar Investment Campaign' }],
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
