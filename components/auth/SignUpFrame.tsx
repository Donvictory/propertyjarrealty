import Link from 'next/link';

/** Step 1 is the role choice on /sign-up; the form steps are 2–5. */
export const SIGN_UP_TOTAL_STEPS = 5;

type Props = {
  /** 1-based step number shown in the progress bar. */
  step: number;
  total: number;
  /** Back control: a link (first form step goes back to the role choice) or a button. Omit on step 1. */
  back?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** Changes on every step so the heading block replays its entrance. */
  stepKey?: string | number;
  direction?: 'next' | 'back';
  children: React.ReactNode;
};

/**
 * One-question-per-screen card for sign-up, in the style of a mobile banking onboarding: back button
 * and segmented progress on top, a big heavy heading, then the step's fields.
 */
export default function SignUpFrame({ step, total, back, title, lede, stepKey, direction = 'next', children }: Props) {
  return (
    <main className="min-h-[calc(100svh-5rem)] bg-panel px-4 py-6 sm:py-14">
      <div className="mx-auto w-full max-w-[540px]">
        <div className="rounded-3xl bg-paper p-6 shadow-[0_24px_60px_-28px_rgba(28,28,27,0.25)] sm:p-10">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center">{back}</div>
            <div
              role="progressbar"
              aria-label="Sign-up progress"
              aria-valuemin={1}
              aria-valuemax={total}
              aria-valuenow={step}
              aria-valuetext={`Step ${step} of ${total}`}
              className="flex flex-1 gap-1.5"
            >
              {Array.from({ length: total }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < step ? 'bg-brand' : 'bg-line'}`}
                />
              ))}
            </div>
            <p className="shrink-0 text-xs tabular-nums text-muted">
              {step}/{total}
            </p>
          </div>

          <div key={stepKey} className={direction === 'back' ? 'step-in-back' : 'step-in-next'}>
            <h1 className="mt-10 text-[30px] leading-[1.05] sm:text-[38px]">{title}</h1>
            {lede && <p className="mt-3 leading-relaxed text-muted">{lede}</p>}
          </div>
          <div className="mt-8">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-medium text-brand underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
