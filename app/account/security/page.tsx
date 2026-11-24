import { getCurrentUser } from '@/lib/user-session';
import { signOutEverywhereAction } from '@/app/actions/account';
import { ChangePasswordForm, DeleteAccountForm } from '@/components/account/forms';

function Row({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-8 border-t border-line py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
      <div>
        <h2 className="text-2xl font-medium tracking-[-0.01em]">{title}</h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{body}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}

export default async function AccountSecurityPage() {
  const user = (await getCurrentUser())!;
  const hasPassword = Boolean(user.passwordHash);

  return (
    <div className="-mt-10">
      <Row
        title={hasPassword ? 'Password' : 'Set a password'}
        body={
          hasPassword
            ? 'Changing your password signs you out on every other device.'
            : 'You sign in with Google. Add a password if you also want to sign in with your email.'
        }
      >
        <ChangePasswordForm hasPassword={hasPassword} />
      </Row>

      <Row title="Sign out everywhere" body="Signs you out on this device and every other device where you are signed in.">
        <form action={signOutEverywhereAction}>
          <button
            type="submit"
            className="btn-fill btn-ink inline-flex h-12 items-center border border-line px-6 text-sm font-medium"
          >
            Sign out of all devices
          </button>
        </form>
      </Row>

      <Row title="Delete account" body="Permanently removes your account, profile and saved properties.">
        <DeleteAccountForm hasPassword={hasPassword} />
      </Row>
    </div>
  );
}
