import Image from 'next/image';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/user-session';
import { getNetwork } from '@/lib/network';
import { ensureReferralCode, getDirectReferrals, realtorProfileComplete, type UserRecord } from '@/lib/users';
import { listPaymentsForUser, listPaymentsForUsers, naira, sumAmounts, type Payment } from '@/lib/payments';
import { requestOrigin } from '@/lib/site-origin';
import { FormMessage } from '@/components/auth/fields';
import CopyLink from '@/components/account/CopyLink';
import CompleteProfilePrompt from '@/components/account/CompleteProfilePrompt';

const NOTICES: Record<string, string> = {
  welcome: 'Your email is confirmed and you are signed in. Welcome to PropertyJar.',
  'password-reset': 'Your new password is saved and you are signed in.',
  'add-phone': 'Add a phone number in your profile so our team can reach you about properties you enquire on.',
};

type PageProps = { searchParams: Promise<{ notice?: string }> };

const dateLabel = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

function Stat({ label, value, note, accent = false }: { label: string; value: string; note?: string; accent?: boolean }) {
  return (
    <div className={`p-5 sm:p-6 ${accent ? 'bg-ink text-paper' : 'bg-paper'}`}>
      <dt className={`text-xs ${accent ? 'text-paper/60' : 'text-muted'}`}>{label}</dt>
      <dd className="mt-2 text-3xl font-medium tracking-[-0.02em] tabular-nums">{value}</dd>
      {note && <p className={`mt-1 text-xs ${accent ? 'text-paper/50' : 'text-muted'}`}>{note}</p>}
    </div>
  );
}

function SectionHeading({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-medium tracking-[-0.01em] lg:text-3xl">{title}</h2>
        {body && <p className="mt-2 text-muted">{body}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------------- client ---------------- */

async function ClientOverview({ user }: { user: UserRecord }) {
  const [payments, network] = await Promise.all([
    listPaymentsForUser(user.id).catch(() => [] as Payment[]),
    getNetwork(user).catch(() => ({ uplines: [], downlines: [] })),
  ]);
  const properties = new Set(payments.map((p) => p.propertyId));
  const realtor = network.uplines[0];

  return (
    <div className="space-y-14">
      <dl className="overflow-hidden rounded-xl grid gap-px border border-line bg-line sm:grid-cols-3">
        <Stat accent label="Total spent" value={naira(sumAmounts(payments))} note="Payments confirmed by our team" />
        <Stat label="Payments" value={String(payments.length)} />
        <Stat label="Properties" value={String(properties.size)} />
      </dl>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-16">
        <section aria-labelledby="payments-heading">
          <SectionHeading title="Payment history" body="Every payment our team has confirmed on your account." />
          {payments.length ? (
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {payments.map((p) => (
                <li key={p.id} className="flex items-center gap-4 py-4">
                  <span className="rounded-lg relative hidden h-12 w-[72px] shrink-0 overflow-hidden bg-ink sm:block">
                    <Image
                      src={`/api/property-art/${encodeURIComponent(p.propertyId)}.svg`}
                      alt=""
                      fill
                      unoptimized
                      sizes="72px"
                      className="rounded-none object-cover"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.propertyTitle}</p>
                    <p className="text-sm text-muted">
                      {dateLabel(p.paidAt)}
                      {p.note ? ` · ${p.note}` : ''}
                    </p>
                  </div>
                  <p className="font-medium tabular-nums">{naira(p.amount)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl mt-8 border border-dashed border-line px-6 py-12 text-center">
              <p className="text-lg font-medium">No payments yet.</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                When you pay towards a property, our team records it here so you can keep track.
              </p>
              <Link
                href="/properties"
                className="btn-fill btn-brand mt-6 inline-flex h-11 items-center bg-brand px-6 text-sm font-medium text-white"
              >
                Browse properties
              </Link>
            </div>
          )}
        </section>

        <aside className="space-y-6 lg:pt-2">
          <div className="rounded-xl border border-line p-5">
            <p className="text-xs text-muted">Your realtor</p>
            {realtor ? (
              <>
                <p className="mt-2 text-lg font-medium">{realtor.name}</p>
                <p className="text-sm text-muted">Referred you to PropertyJar</p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">You joined directly. Our team is your point of contact.</p>
            )}
          </div>
          <div className="rounded-xl bg-sage-100 p-5">
            <p className="font-medium">Questions about a payment?</p>
            <p className="mt-1 text-sm text-muted">Our team can send receipts and your payment schedule.</p>
            <Link
              href="/contact?subject=Property%20Purchase"
              className="btn-fill btn-ink mt-4 inline-flex h-11 items-center border border-ink/25 px-5 text-sm font-medium"
            >
              Contact us
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- realtor ---------------- */

async function RealtorOverview({ user }: { user: UserRecord }) {
  const [referred, code, origin] = await Promise.all([
    getDirectReferrals(user.id).catch(() => [] as UserRecord[]),
    ensureReferralCode(user).catch(() => null),
    requestOrigin(),
  ]);
  const clients = referred.filter((u) => u.role === 'client');
  const realtors = referred.filter((u) => u.role === 'realtor');
  const payments = clients.length ? await listPaymentsForUsers(clients.map((c) => c.id)).catch(() => [] as Payment[]) : [];
  const spentBy = new Map<string, number>();
  for (const p of payments) spentBy.set(p.userId, (spentBy.get(p.userId) ?? 0) + p.amount);
  const link = code ? `${origin}/r/${code}` : null;

  return (
    <div className="space-y-14">
      <dl className="overflow-hidden rounded-xl grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        <Stat accent label="Commission earned" value={naira(0)} note="Commission rates coming soon" />
        <Stat label="Clients referred" value={String(clients.length)} />
        <Stat label="Sales from your clients" value={naira(sumAmounts(payments))} />
        <Stat label="Realtors in your team" value={String(realtors.length)} />
      </dl>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-16">
        <section aria-labelledby="clients-heading">
          <SectionHeading
            title="Your clients"
            body="People who signed up with your link, and what they have paid so far."
            action={
              <Link
                href="/account/network"
                className="btn-fill btn-ink inline-flex h-11 items-center border border-line px-5 text-sm font-medium"
              >
                View network
              </Link>
            }
          />
          {clients.length ? (
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {clients.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="text-sm text-muted">Joined {dateLabel(c.createdAt)}</p>
                  </div>
                  <p className="font-medium tabular-nums">{naira(spentBy.get(c.id) ?? 0)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl mt-8 border border-dashed border-line px-6 py-12 text-center">
              <p className="text-lg font-medium">No clients yet.</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                Share your referral link. Anyone who signs up with it appears here.
              </p>
            </div>
          )}
        </section>

        <aside className="space-y-6 lg:pt-2">
          <div className="rounded-xl border border-line p-5">
            <p className="font-medium">Your referral link</p>
            <p className="mt-1 text-sm text-muted">
              Your code is{' '}
              <span className="font-medium tabular-nums tracking-wider text-ink">{code ?? '—'}</span>.
            </p>
            <div className="mt-4">
              {link ? (
                <CopyLink url={link} shareText="Join me on PropertyJar Realty, property in Lagos with a clear plan." />
              ) : (
                <p className="text-sm text-brand">We couldn&rsquo;t create your link just now. Refresh to try again.</p>
              )}
            </div>
          </div>
          <div className="rounded-xl bg-sage-100 p-5">
            <p className="font-medium">How commission works</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              When a client you referred completes a purchase, you earn commission on it. Rates and payouts are being
              finalised and will appear here.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default async function AccountOverviewPage({ searchParams }: PageProps) {
  // The layout has already required a signed-in user.
  const user = (await getCurrentUser())!;
  const { notice } = await searchParams;
  const message = notice ? NOTICES[notice] : undefined;

  const needsDetails = user.role === 'realtor' && !realtorProfileComplete(user);

  return (
    <div className="space-y-10">
      {message && <FormMessage success={message} />}
      {needsDetails && (
        <>
          <CompleteProfilePrompt />
          <div className="rounded-xl flex flex-col gap-4 border border-brand/40 bg-brand/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Complete your profile to get paid</p>
              <p className="mt-1 text-sm text-muted">Add your bank details, date of birth and house address.</p>
            </div>
            <Link
              href="/account/profile#payout-details"
              className="btn-fill btn-brand inline-flex h-11 shrink-0 items-center self-start bg-brand px-6 text-sm font-medium text-white sm:self-auto"
            >
              Complete profile
            </Link>
          </div>
        </>
      )}
      {user.role === 'realtor' ? <RealtorOverview user={user} /> : <ClientOverview user={user} />}
    </div>
  );
}
