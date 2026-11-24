import { getCurrentUser } from '@/lib/user-session';
import { getNetwork } from '@/lib/network';
import NetworkTree from '@/components/account/NetworkTree';
import CopyLink from '@/components/account/CopyLink';
import { ensureReferralCode } from '@/lib/users';
import { requestOrigin } from '@/lib/site-origin';

export default async function AccountNetworkPage() {
  const user = (await getCurrentUser())!;
  const [{ uplines, downlines }, code, origin] = await Promise.all([
    getNetwork(user),
    ensureReferralCode(user).catch(() => null),
    requestOrigin(),
  ]);
  const link = code ? `${origin}/r/${code}` : null;

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="text-3xl font-medium tracking-[-0.02em]">Your network</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Your upline is the member who referred you. Your downlines are the people who join with your referral link.
        </p>

        <div className="mt-8 border border-line p-5">
          <p className="text-sm font-medium">Your referral link</p>
          <p className="mt-1 text-sm text-muted">
            Anyone who signs up through this link joins as your downline.
            {code && (
              <>
                {' '}
                Your code is <span className="font-medium tabular-nums tracking-wider text-ink">{code}</span>.
              </>
            )}
          </p>
          <div className="mt-4">
            {link ? (
              <CopyLink url={link} shareText="Join me on PropertyJar Realty, property in Lagos with a clear plan." />
            ) : (
              <p className="text-sm text-brand">We couldn’t create your link just now. Refresh to try again.</p>
            )}
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-px border border-line bg-line">
          <div className="bg-paper p-4">
            <dt className="text-xs text-muted">Uplines</dt>
            <dd className="mt-1 text-2xl font-medium tabular-nums">{uplines.length}</dd>
          </div>
          <div className="bg-paper p-4">
            <dt className="text-xs text-muted">Downlines</dt>
            <dd className="mt-1 text-2xl font-medium tabular-nums">{downlines.length}</dd>
          </div>
        </dl>
      </div>

      <NetworkTree you={user.name} uplines={uplines} downlines={downlines} />
    </div>
  );
}
