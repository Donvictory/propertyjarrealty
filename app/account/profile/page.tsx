import { Check, Minus } from 'lucide-react';
import { getCurrentUser } from '@/lib/user-session';
import { ensureReferralCode, realtorProfileComplete } from '@/lib/users';
import { ProfileForm, RealtorDetailsForm } from '@/components/account/forms';
import MemberCard from '@/components/account/MemberCard';
import CompleteProfilePrompt from '@/components/account/CompleteProfilePrompt';

function Status({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return (
    <li className="flex items-start gap-3 py-3">
      <span
        aria-hidden
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${ok ? 'bg-ink text-paper' : 'border border-brand text-brand'}`}
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

/** "•••• 6789" — never show the full account number outside the edit form. */
const maskAccount = (n: string) => `•••• ${n.slice(-4)}`;

export default async function AccountProfilePage() {
  // The layout has already required a signed-in user.
  const user = (await getCurrentUser())!;
  const isRealtor = user.role === 'realtor';
  const complete = realtorProfileComplete(user);
  const referralCode = await ensureReferralCode(user).catch(() => null);
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : '—';
  const methods = [user.passwordHash ? 'Email and password' : null, user.googleId ? 'Google' : null].filter(Boolean).join(' · ');

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      {isRealtor && !complete && <CompleteProfilePrompt onProfilePage />}

      {/* Identity */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <MemberCard name={user.name} memberSince={memberSince} role={user.role} referralCode={referralCode} />
        <ul className="mt-8 divide-y divide-line border-y border-line">
          <Status ok={user.emailVerified} label="Email" detail={user.emailVerified ? `Confirmed · ${user.email}` : 'Not confirmed yet'} />
          <Status ok={Boolean(user.phone)} label="Phone" detail={user.phone || 'Add one below so our team can reach you'} />
          {isRealtor && (
            <Status
              ok={complete}
              label="Payout details"
              detail={
                complete && user.bankName && user.bankAccountNumber
                  ? `${user.bankName} · ${maskAccount(user.bankAccountNumber)}`
                  : 'Needed before commission can be paid'
              }
            />
          )}
          <Status ok label="Sign-in" detail={methods || '—'} />
        </ul>
      </aside>

      <div className="space-y-14">
        <section aria-labelledby="details-heading">
          <h2 id="details-heading" className="text-3xl font-medium tracking-[-0.02em]">
            Personal details
          </h2>
          <p className="mt-2 text-muted">Keep these current so our team can follow up on your enquiries.</p>
          <div className="mt-8">
            <ProfileForm name={user.name} phone={user.phone} email={user.email} />
          </div>
        </section>

        {isRealtor && (
          <section id="payout-details" aria-labelledby="payout-heading" className="scroll-mt-28 border-t border-line pt-12">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="payout-heading" className="text-3xl font-medium tracking-[-0.02em]">
                Payout details
              </h2>
              {!complete && (
                <span className="bg-brand px-2.5 py-1 text-xs font-medium text-on-brand">Required</span>
              )}
            </div>
            <p className="mt-2 text-muted">Where we pay your commission, and the details we need to confirm who you are.</p>
            <div className="mt-8">
              <RealtorDetailsForm
                initial={{
                  bankName: user.bankName,
                  bankAccountNumber: user.bankAccountNumber,
                  dateOfBirth: user.dateOfBirth,
                  address: user.address,
                }}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
