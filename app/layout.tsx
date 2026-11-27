import type { Metadata } from 'next';
import { Archivo, Instrument_Sans } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import AppLayout from '@/components/AppLayout';

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument',
  subsets: ['latin'],
  display: 'swap',
});

// Headings: Archivo at its widest, heaviest setting (a free stand-in for a blocky, expanded display face).
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropertyJar Realty Ltd — Luxury Real Estate',
    description:
      'Discover the most exclusive luxury properties worldwide with PropertyJar Realty Ltd.',
    creator: '@propertyjarrealty',
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: 'your-google-search-console-code',
  },
};

/**
 * Runs before first paint so the page never flashes the wrong theme: the visitor's saved choice
 * (see components/site/ThemeToggle.tsx), otherwise the system appearance. Admin pins itself to light in AppLayout.
 */
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('pjr-theme');document.documentElement.dataset.theme=s==='dark'||s==='light'?s:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){}})()`;

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
    // suppressHydrationWarning: the theme script sets data-theme on <html> before React hydrates.
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning className={`${instrumentSans.variable} ${archivo.variable} ${instrumentSans.className} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-clip bg-paper text-ink">
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
