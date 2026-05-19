import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with PropertyJar Realty Ltd. Book a private consultation or speak to our luxury real estate specialists about premium properties in Lagos.',
  openGraph: {
    title: 'Contact Us | PropertyJar Realty Ltd',
    description: 'Get in touch with PropertyJar Realty Ltd. Book a private consultation or speak to our luxury real estate specialists about premium properties in Lagos.',
    url: 'https://propertyjarrealty.com/contact',
  },
  alternates: {
    canonical: 'https://propertyjarrealty.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
