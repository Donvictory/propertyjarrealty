import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" aria-label="PropertyJar Realty home" className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src="/brand/pjr-mark.png"
        alt=""
        width={44}
        height={44}
        priority
        className="h-11 w-11 rounded-none"
      />
      <span className="flex flex-col leading-none">
        <span className="text-[17px] font-semibold tracking-tight text-ink">PropertyJar</span>
        <span className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-brand">REALTY</span>
      </span>
    </Link>
  );
}
