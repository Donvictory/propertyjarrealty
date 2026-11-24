import type { CampaignContent } from '@/lib/campaign';
import Reveal from '@/components/motion/Reveal';

/** "Option 1: Shortlet Apartments" -> { label: "Option 1", name: "Shortlet Apartments" } */
function splitTitle(title: string) {
  const m = title.match(/^(option\s*\d+)\s*[:\-–]\s*(.+)$/i);
  return m ? { label: m[1].replace(/^o/, 'O'), name: m[2] } : { label: null, name: title };
}

/** "ROI: 20-30%" -> { key: "ROI", value: "20-30%" }; plain points have no key. */
function splitPoint(point: string) {
  const i = point.indexOf(':');
  if (i > 0 && i < 30) return { key: point.slice(0, i).trim(), value: point.slice(i + 1).trim() };
  return { key: null, value: point };
}

export default function InvestmentOptions({ options }: { options: CampaignContent['investmentOptions'] }) {
  if (!options || options.length === 0) return null;

  return (
    <section className="bg-panel">
      <div className="shell py-20 lg:py-24">
        <Reveal from="left">
          <h2 className="text-4xl font-medium tracking-[-0.02em] lg:text-5xl">Investment options</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            Three ways in, side by side. Ask our team for current entry prices on any route.
          </p>
        </Reveal>

        {/* The frame stays still; each option slides in on its own and settles into its column. */}
        <ol
            className={`mt-12 grid overflow-hidden border border-line bg-paper md:divide-x md:divide-line ${
              options.length >= 3 ? 'md:grid-cols-3' : options.length === 2 ? 'md:grid-cols-2' : ''
            }`}
          >
            {options.map((opt, i) => {
              const { label, name } = splitTitle(opt.title ?? '');
              return (
                <li key={opt.title ?? i} className="border-b border-line last:border-b-0 md:border-b-0">
                  <Reveal from="right" delay={i * 0.04} distance={1 + i * 0.22} className="h-full">
                  <div className="p-6 lg:p-8">
                  <p className="text-sm text-muted">{label ?? `Option ${i + 1}`}</p>
                  <h3 className="mt-2 text-2xl font-medium tracking-[-0.01em]">{name}</h3>
                  <dl className="mt-6 border-t border-line">
                    {(opt.points ?? []).map((point) => {
                      const { key, value } = splitPoint(point);
                      return (
                        <div key={point} className="flex items-baseline justify-between gap-4 border-b border-line py-3 text-sm">
                          {key ? (
                            <>
                              <dt className="text-muted">{key}</dt>
                              <dd className="text-right font-medium">{value}</dd>
                            </>
                          ) : (
                            <dd className="font-medium">{value}</dd>
                          )}
                        </div>
                      );
                    })}
                  </dl>
                  </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
      </div>
    </section>
  );
}
