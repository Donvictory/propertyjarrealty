import type { Metadata } from 'next';
import { League_Spartan } from 'next/font/google';
import './globals.css';

const leagueSpartan = League_Spartan({
  variable: '--font-spartan',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PropertyJar Realty — Luxury Real Estate',
  description:
    'Discover the most exclusive luxury properties in the world\'s most desirable locations. Buy, sell, and invest with PropertyJar Realty.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
