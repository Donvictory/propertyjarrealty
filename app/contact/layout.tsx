import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Reach out to PropertyJar Realty Ltd for expert real estate advice, property viewings, and personalized investment strategies.',
  openGraph: {
    title: 'Contact PropertyJar Realty Ltd',
    description: 'Schedule a consultation or send us a message — we are here to help you find your dream property.',
    url: 'https://propertyjarrealty.com/contact',
    images: [{ url: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1200&h=630&fit=crop', width: 1200, height: 630, alt: 'Contact PropertyJar Realty' }],
  },
  alternates: { canonical: 'https://propertyjarrealty.com/contact' },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
