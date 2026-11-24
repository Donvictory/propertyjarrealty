import Image from 'next/image';

type Props = {
  name: string;
  memberSince: string;
  role: 'client' | 'realtor';
  /** Realtors only. */
  referralCode?: string | null;
};

/**
 * A premium-card style summary of the member. Dark ink with a faint concept-plan grid, the mark,
 * the member's name and the date they joined.
 */
export default function MemberCard({ name, memberSince, role, referralCode }: Props) {
  return (
    <div className="relative aspect-[1.6/1] w-full overflow-hidden bg-ink p-6 text-paper shadow-[0_24px_60px_rgba(28,28,27,0.25)] sm:p-7">
      {/* Faint plot grid, echoing the site-plan drawings. */}
      <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.07]" preserveAspectRatio="none">
        <defs>
          <pattern id="member-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0H0V44" fill="none" stroke="#f5f3ee" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#member-grid)" />
      </svg>
      <span aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-paper/10" />
      <span aria-hidden className="absolute bottom-0 left-0 h-1 w-1/3 bg-brand" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold tracking-tight">PropertyJar</p>
            <p className="mt-0.5 text-[10px] font-semibold tracking-[0.22em] text-paper/60">{role === 'realtor' ? 'REALTOR' : 'CLIENT'}</p>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper">
            <Image src="/brand/pjr-mark.png" alt="" width={34} height={34} className="h-[34px] w-[34px] rounded-none" />
          </span>
        </div>

        <div>
          <p className="truncate text-2xl font-medium tracking-[-0.01em] sm:text-[26px]">{name}</p>
          <div className="mt-4 flex items-end justify-between gap-4 text-xs">
            <div>
              <p className="text-paper/50">Member since</p>
              <p className="mt-1 font-medium">{memberSince}</p>
            </div>
            {role === 'realtor' && (
              <div className="text-right">
                <p className="text-paper/50">Referral code</p>
                <p className="mt-1 font-medium tabular-nums tracking-[0.12em]">{referralCode ?? '—'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
