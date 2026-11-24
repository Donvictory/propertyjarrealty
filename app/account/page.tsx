import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import { getCurrentUser } from '@/lib/user-session';
import { getNetwork } from '@/lib/network';
import { ensureReferralCode } from '@/lib/users';
import { ProfileForm } from '@/components/account/forms';
import { FormMessage } from '@/components/auth/fields';
import MemberCard from '@/components/account/MemberCard';

const NOTICES: Record<string, string> = {
  welcome: 'Your email is confirmed and you are signed in. Welcome to PropertyJar.',
  'password-reset': 'Your new password is saved and you are signed in.',
  'add-phone': 'Add a phone number so our team can reach you about properties you enquire on.',
};

type PageProps = { searchParams: Promise<{ notice?: string }> };

function Status({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return (
    <li className="flex items-start gap-3 py-3">
      <span
        aria-hidden
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${ok ? 'bg-ink text-paper' : 'border border-line text-muted'}`}
      >
        {ok ? <Check size={12} strokeWidth={2.5} /> : <Minus size={12} strokeWidth={2.5} />}
      </span>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted">{detail}</p>
      </div>
    </li>
  );
}

export default async function AccountProfilePage({ searchParams }: PageProps) {
  // The layout has already required a signed-in user.
  const user = (await getCurrentUser())!;
  const { notice } = await searchParams;
  const message = notice ? NOTICES[notice] : undefined;
  const [network, referralCode] = await Promise.all([getNetwork(user), ensureReferralCode(user).catch(() => null)]);
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : '—';
  const methods = [user.passwordHash ? 'Email and password' : null, user.googleId ? 'Google' : null].filter(Boolean).join(' · ');

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      {/* Identity */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <MemberCard name={user.name} memberSince={memberSince} referralCode={referralCode} />
        <ul className="mt-8 divide-y divide-line border-y border-line">
          <Status ok={user.emailVerified} label="Email" detail={user.emailVerified ? `Confirmed · ${user.email}` : 'Not confirmed yet'} />
          <Status ok={Boolean(user.phone)} label="Phone" detail={user.phone || 'Add one below so our team can reach you'} />
          <Status ok label="Sign-in" detail={methods || '—'} />
        </ul>
      </aside>

      <div className="space-y-14">
        {message && <FormMessage success={message} />}

        <section aria-labelledby="details-heading">
          <h2 id="details-heading" className="text-3xl font-medium tracking-[-0.02em]">
            Personal details
          </h2>
          <p className="mt-2 text-muted">Keep these current so our team can follow up on your enquiries.</p>
          <div className="mt-8">
            <ProfileForm name={user.name} phone={user.phone} email={user.email} />
          </div>
        </section>

        <section aria-labelledby="network-heading" className="border-t border-line pt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="network-heading" className="text-3xl font-medium tracking-[-0.02em]">
                Your network
              </h2>
              <p className="mt-2 text-muted">The person who referred you, and the people you refer.</p>
            </div>
            <Link
              href="/account/network"
              className="btn-fill btn-ink inline-flex h-11 items-center border border-line px-5 text-sm font-medium"
            >
              View network
            </Link>
          </div>
          <dl className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-3">
            <div className="bg-paper p-5">
              <dt className="text-xs text-muted">Upline</dt>
              <dd className="mt-2 truncate text-lg font-medium">{network.uplines[0]?.name ?? 'None'}</dd>
            </div>
            <div className="bg-paper p-5">
              <dt className="text-xs text-muted">Downlines</dt>
              <dd className="mt-2 text-lg font-medium tabular-nums">{network.downlines.length}</dd>
            </div>
            <div className="bg-paper p-5">
              <dt className="text-xs text-muted">Referral bonus</dt>
              <dd className="mt-2 text-lg font-medium text-muted">Coming soon</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
