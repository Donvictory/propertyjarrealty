import Image from 'next/image';
import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { name: 'Properties', href: '/properties' },
      { name: 'Investments', href: '/campaign' },
      { name: 'Services', href: '/services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
    ],
  },
  {
    title: 'Follow',
    links: [
      { name: 'Instagram', href: 'https://www.instagram.com/propertyjarrealtyltd_?igsh=NWY5aTU1ZGFuc2hh' },
      { name: 'LinkedIn', href: 'https://linkedin.com/company/propertyjarrealty' },
      { name: 'WhatsApp', href: 'https://wa.me/2349153869750' },
      { name: 'WhatsApp community', href: 'https://chat.whatsapp.com/FfyrsnS2nWULdzfc4PBXn0' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="shell pb-10 pt-14 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.8fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              {/* Mark sits on a light tile: its burgundy and grey would disappear on the dark footer. */}
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper">
                <Image src="/brand/pjr-mark.png" alt="" width={44} height={44} className="h-11 w-11 rounded-none" />
              </span>
              <span className="text-xl font-semibold tracking-tight">PropertyJar Realty Ltd</span>
            </Link>
            <p className="mt-5 text-xl font-medium tracking-tight">Property, with a clear plan.</p>
            <address className="mt-5 space-y-0.5 text-sm not-italic leading-relaxed text-paper/60">
              <p>21 Alexander Court, Osapa London, Lekki, Lagos</p>
              <p>
                <a href="mailto:sales@propertyjarrealty.com" className="transition-colors hover:text-paper">
                  sales@propertyjarrealty.com
                </a>
              </p>
              <p>
                <a href="tel:+2349153869750" className="transition-colors hover:text-paper">
                  +234 915 386 9750
                </a>
              </p>
            </address>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-medium text-paper/60">{col.title}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {col.links.map((link) => {
                  const external = link.href.startsWith('http');
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="text-paper/90 underline-offset-4 transition-colors hover:text-paper hover:underline"
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-paper/15 pt-6 text-xs text-paper/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} PropertyJar Realty Ltd</p>
          <p>Prices and availability can change. Projections are not a guarantee of returns.</p>
        </div>
      </div>
    </footer>
  );
}
