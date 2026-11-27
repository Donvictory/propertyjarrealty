import type { Metadata } from 'next';
import { requireUser } from '@/lib/user-session';
import { signOutAction } from '@/app/actions/account';
import AccountNav from '@/components/account/AccountNav';
import AvatarUploader from '@/components/account/AvatarUploader';

export const metadata: Metadata = { title: 'Your account', robots: { index: false, follow: false } };

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser('/account');
  const first = user.name.split(' ')[0] || 'there';

  return (
    <main>
      <section className="stay-dark bg-ink text-paper">
        <div className="shell pt-12 lg:pt-16">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <AvatarUploader name={user.name} avatarUrl={user.avatarUrl} />
              <div>
                <p className="inline-flex rounded-full bg-paper/10 px-3 py-1 text-xs font-medium text-paper/80">
                  {user.role === 'realtor' ? 'Realtor' : 'Client'}
                </p>
                <h1 className="mt-3 text-3xl font-medium tracking-[-0.02em] lg:text-[44px]">Hello, {first}.</h1>
                <p className="mt-1 break-all text-sm text-paper/60">{user.email}</p>
              </div>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="btn-fill btn-paper inline-flex h-11 items-center border border-paper/30 px-6 text-sm font-medium"
              >
                Sign out
              </button>
            </form>
          </div>
          <div className="mt-10 border-t border-paper/15">
            <AccountNav savedCount={user.savedPropertyIds.length} role={user.role} />
          </div>
        </div>
      </section>
      <div className="shell py-12 lg:py-16">{children}</div>
    </main>
  );
}
