import type { CampaignContent } from '@/lib/campaign';
import Reveal from '@/components/motion/Reveal';
import HeroReveal from '@/components/motion/HeroReveal';

/** Rising bars in the site-plan drawing style, tuned for the dark band. */
function GrowthDrawing() {
  const bars = [22, 34, 30, 46, 58, 76];
  return (
    <svg viewBox="0 0 168 84" className="h-14 w-auto" aria-hidden>
      <rect x="0" y="83" width="168" height="1" fill="rgba(245,243,238,0.25)" />
      {bars.map((h, i) => {
        const last = i === bars.length - 1;
        return (
          <rect
            key={i}
            x={4 + i * 27}
            y={83 - h}
            width="20"
            height={h}
            fill={last ? 'var(--color-brand)' : 'rgba(245,243,238,0.08)'}
            stroke={last ? 'var(--color-brand)' : 'rgba(245,243,238,0.3)'}
          />
        );
      })}
    </svg>
  );
}

export default function WhyLagos({ content }: { content: CampaignContent }) {
  const points = content.whyInvestPoints ?? [];
  const subtitle = content.whyInvestSubtitle?.trim();

  return (
    <section className="bg-ink text-paper">
      <div className="shell pb-16 pt-16 lg:pb-24 lg:pt-20">
        {/* Title row: heading left, subtitle bottom-right */}
        <HeroReveal>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end lg:gap-16">
            <div>
              <p className="eyebrow text-paper/60">Investments</p>
              <h1 className="mt-5 text-[44px] font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[76px]">
                {content.whyInvestTitle}
              </h1>
            </div>
            {subtitle && (
              <p className="text-lg leading-relaxed text-paper/70 first-letter:uppercase lg:pb-3">
                {subtitle}
                {/[.!?]$/.test(subtitle) ? '' : '.'}
              </p>
            )}
          </div>
        </HeroReveal>

        {/* Figures row: growth column + reasons in a 2×2 grid, all on hairline rules */}
        <div className="mt-12 grid border-t border-paper/15 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            {content.projectedRoi && (
              <Reveal from="left" className="border-b border-paper/15 lg:border-b-0 lg:border-r">
              <div className="flex h-full flex-col py-10 lg:pr-10">
                <div className="flex items-start justify-between gap-6">
                  <p className="text-sm text-paper/70">Projected growth</p>
                  <GrowthDrawing />
                </div>
                <p className="mt-6 text-6xl font-medium tracking-[-0.04em] tabular-nums lg:text-7xl">
                  {content.projectedRoi}
                </p>
                {content.roiSubtext && <p className="mt-3 text-paper/80">{content.roiSubtext}</p>}
                <p className="mt-auto pt-10 text-xs leading-relaxed text-paper/50">
                  Projections use assumptions and are not a guarantee of returns. Actual outcomes can differ.
                </p>
              </div>
              </Reveal>
            )}

            {points.length > 0 && (
              // Hairline frames stay put; each reason slides in separately and settles into its cell.
              <ul className="grid gap-px overflow-hidden bg-paper/15 sm:grid-cols-2">
                {points.map((point, i) => (
                  <li key={point} className="bg-ink">
                    <Reveal from="right" delay={(i % 2) * 0.05} distance={1 + i * 0.18} className="h-full">
                      <div className="flex gap-4 py-8 sm:px-8 lg:py-10">
                        <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-brand" />
                        <p className="text-xl leading-snug">{point}</p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
    </section>
  );
}
