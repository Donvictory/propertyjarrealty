import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about PropertyJar Realty Ltd, our founder Jaiyesinmi MA, and our mission to provide secure, high-yield luxury real estate investments in Lagos.',
  openGraph: {
    title: 'About Us | PropertyJar Realty Ltd',
    description: 'Learn about PropertyJar Realty Ltd, our founder Jaiyesinmi MA, and our mission to provide secure, high-yield luxury real estate investments in Lagos.',
    url: 'https://propertyjarrealty.com/about',
    images: [
      {
        url: 'https://propertyjarrealty.com/profile.jpeg',
        width: 800,
        height: 1000,
        alt: 'Jaiyesinmi MA - Founder & CEO',
      },
    ],
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
