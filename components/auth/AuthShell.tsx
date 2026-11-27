import HeroVideo from '@/components/home/HeroVideo';

type Props = {
  title: React.ReactNode;
  lede?: React.ReactNode;
  children: React.ReactNode;
  /** Small print under the form (links to the other auth screens). */
  footer?: React.ReactNode;
};

/**
 * Split screen for every auth screen: a dark, quiet panel with the looping footage and the mark
 * on the left (desktop only), the form on the right.
 */
export default function AuthShell({ title, lede, children, footer }: Props) {
  return (
    <main className="grid min-h-[calc(100svh-5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="stay-dark relative hidden overflow-clip bg-ink text-paper lg:block">
        <HeroVideo />
        <div aria-hidden className="absolute inset-0 bg-ink/60" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/50" />
        {/* Sticky + viewport height: stays centred in the visible window even when the form is taller. */}
        <div className="sticky top-20 flex h-[calc(100svh-5rem)] flex-col items-center justify-center p-12 text-center xl:p-16">
          <p className="max-w-md text-[34px] font-medium leading-[1.15] tracking-[-0.02em] xl:text-[40px]">
            A place to own.
            <br />
            A plan to grow.
          </p>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-paper/70">
            Save properties, follow your enquiries and keep your plans in one place.
          </p>
        </div>
      </aside>

      <section className="flex items-center px-4 py-14 sm:px-8 lg:px-16 lg:py-20">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-4xl font-medium leading-[1.08] tracking-[-0.025em] lg:text-[44px]">{title}</h1>
          {lede && <p className="mt-4 leading-relaxed text-muted">{lede}</p>}
          <div className="mt-10">{children}</div>
          {footer && <div className="mt-10 border-t border-line pt-6 text-sm text-muted">{footer}</div>}
        </div>
      </section>
    </main>
  );
}
