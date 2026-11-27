import Image from 'next/image';
import Link from 'next/link';

/**
 * Navbar logo: the PJR mark on its own. The link's label carries the company name for screen readers.
 * In the dark theme the mark sits on a cream disc (as in the footer): its burgundy and grey vanish on dark.
 */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="PropertyJar Realty Ltd, home"
      className={`inline-flex items-center dark:h-12 dark:w-12 dark:justify-center dark:rounded-full dark:bg-[#f7f5ef] ${className}`}
    >
      <Image src="/brand/pjr-mark.png" alt="" width={52} height={52} priority className="h-12 w-12 rounded-none dark:h-10 dark:w-10" />
    </Link>
  );
}
