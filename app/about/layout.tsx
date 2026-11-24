import type { Metadata } from 'next';
import { SHARE_IMAGES } from '@/lib/share-image';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about PropertyJar Realty Ltd, our founder Jaiyesinmi MA, and our mission to provide secure, high-yield luxury real estate investments in Lagos.',
  openGraph: {
    images: SHARE_IMAGES,
    title: 'About Us | PropertyJar Realty Ltd',
    description: 'Learn about PropertyJar Realty Ltd, our founder Jaiyesinmi MA, and our mission to provide secure, high-yield luxury real estate investments in Lagos.',
    url: 'https://propertyjarrealty.com/about',
  },
  alternates: {
    canonical: 'https://propertyjarrealty.com/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
