import Image from 'next/image';
import Link from 'next/link';

/** Navbar logo: the PJR mark on its own. The link's label carries the company name for screen readers. */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" aria-label="PropertyJar Realty Ltd, home" className={`inline-flex items-center ${className}`}>
      <Image src="/brand/pjr-mark.png" alt="" width={52} height={52} priority className="h-12 w-12 rounded-none" />
    </Link>
  );
}
