import type { Metadata } from 'next';
import { League_Spartan, Playfair_Display } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const leagueSpartan = League_Spartan({
  variable: '--font-spartan',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

const BASE_URL = 'https://propertyjarrealty.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PropertyJar Realty Ltd — Luxury Real Estate',
    template: '%s | PropertyJar Realty Ltd',
  },
  description:
    'Discover the most exclusive luxury properties worldwide. Buy, sell, and invest with PropertyJar Realty Ltd — your premier partner in high-end real estate.',
  keywords: [
    'luxury real estate',
    'premium properties',
    'PropertyJar Realty',
    'buy luxury home',
    'sell luxury property',
    'real estate investment',
    'exclusive listings',
    'high-end homes',
    'luxury apartments',
    'real estate agency',
  ],
  authors: [{ name: 'PropertyJar Realty Ltd', url: BASE_URL }],
  creator: 'PropertyJar Realty Ltd',
  publisher: 'PropertyJar Realty Ltd',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'PropertyJar Realty Ltd',
    title: 'PropertyJar Realty Ltd — Luxury Real Estate',
    description:
      'Discover the most exclusive luxury properties worldwide. Buy, sell, and invest with PropertyJar Realty Ltd.',
    images: [
      {
        url: `${BASE_URL}/Propertyjaarrealty.jpeg`,
        width: 1200,
        height: 630,
        alt: 'PropertyJar Realty Ltd — Luxury Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropertyJar Realty Ltd — Luxury Real Estate',
    description:
      'Discover the most exclusive luxury properties worldwide with PropertyJar Realty Ltd.',
    images: [`${BASE_URL}/Propertyjaarrealty.jpeg`],
    creator: '@propertyjarrealty',
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  verification: {
    google: 'your-google-search-console-code',  
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'PropertyJar Realty Ltd',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.svg`,
  description:
    'Premier luxury real estate agency offering exclusive properties worldwide.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '21 Alexander Court',
    addressLocality: 'Osapa London, Lekki',
    addressRegion: 'Lagos',
    addressCountry: 'NG',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
  sameAs: [
    'https://www.instagram.com/propertyjarrealtyltd_?igsh=NWY5aTU1ZGFuc2hh',
    'https://linkedin.com/company/propertyjarrealty',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${playfairDisplay.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
