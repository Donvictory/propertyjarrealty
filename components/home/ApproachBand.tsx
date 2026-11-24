import Reveal from '@/components/motion/Reveal';
import InViewPlay from '@/components/motion/InViewPlay';

/*
 * Small concept drawings in the brand's flat line style. While on screen, their parts cycle to
 * sage → deeper sage → burgundy in a continuous wave (see .drawing-cell / .drawing-line in globals.css):
 * across the plots, down the document lines, along the payment from deposit to final instalment.
 */

// Negative delay = start part-way through the cycle, so every box is moving from the first frame,
// each at its own phase (the colour appears to travel across the drawing).
const cycle = (seconds: number, phase: number) =>
  ({ ['--cycle' as string]: `${seconds}s`, animationDelay: `-${phase}s` }) as React.CSSProperties;

function PlotDrawing() {
  return (
    <svg viewBox="0 0 120 72" className="h-16 w-auto" aria-hidden>
      <rect x="1" y="1" width="118" height="70" fill="none" stroke="var(--color-sage-line)" strokeDasharray="4 3" />
      {[0, 1, 2].map((c) => (
        <rect
          key={c}
          className="drawing-cell"
          style={cycle(3.6, (2 - c) * 1.2)}
          x={14 + c * 32}
          y="16"
          width="26"
          height="40"
          fill="var(--color-sage)"
          stroke="var(--color-sage-line)"
        />
      ))}
    </svg>
  );
}

function PaperworkDrawing() {
  const lines = [22, 30, 38, 46];
  return (
    <svg viewBox="0 0 120 72" className="h-16 w-auto" aria-hidden>
      <rect x="30" y="4" width="48" height="64" fill="var(--color-paper)" stroke="var(--color-sage-line)" />
      <rect x="40" y="10" width="48" height="58" fill="var(--color-sage)" stroke="var(--color-sage-line)" />
      {lines.map((y, i) => (
        <rect
          key={y}
          className="drawing-line"
          style={cycle(4, (lines.length - i) * 0.55)}
          x="47"
          y={y}
          width={i === 3 ? 18 : 34}
          height="2.5"
          fill="var(--color-sage-line)"
        />
      ))}
      <rect className="drawing-cell" style={cycle(4, 0)} x="47" y="56" width="12" height="6" fill="var(--color-sage)" />
    </svg>
  );
}

function PaymentDrawing() {
  return (
    <svg viewBox="0 0 120 72" className="h-16 w-auto" aria-hidden>
      <rect className="drawing-cell" style={cycle(4.5, 4 * 0.45)} x="4" y="28" width="28" height="16" fill="var(--color-sage)" stroke="var(--color-sage-line)" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          className="drawing-cell"
          style={cycle(4.5, (3 - i) * 0.45)}
          x={36 + i * 20}
          y="28"
          width="16"
          height="16"
          fill="var(--color-sage)"
          stroke="var(--color-sage-line)"
        />
      ))}
      <rect x="4" y="52" width="112" height="1" fill="var(--color-sage-line)" />
    </svg>
  );
}

const POINTS = [
  {
    drawing: <PlotDrawing />,
    title: 'See the land.',
    body: 'Visit the site with our team and see the plot for yourself before you commit.',
  },
  {
    drawing: <PaperworkDrawing />,
    title: 'Understand the paperwork.',
    body: 'Title, survey and allocation documents, explained in plain language.',
  },
  {
    drawing: <PaymentDrawing />,
    title: 'Know the payment plan.',
    body: 'A deposit, then the balance on a schedule you can see from the start.',
  },
];

export default function ApproachBand() {
  return (
    <section className="bg-sage-100">
      <div className="shell py-16 lg:py-20">
        <Reveal from="left">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.02em] lg:text-[44px]">
              Buy with clarity.
              <br />
              Build at your own pace.
            </h2>
          </div>
        </Reveal>

        <InViewPlay>
          <ul className="mt-12 grid border-t border-sage-line/50 sm:grid-cols-3">
            {POINTS.map((p, i) => (
              <li
                key={p.title}
                className="border-b border-sage-line/50 sm:border-b-0 sm:[&:not(:first-child)]:border-l"
              >
                <Reveal from="right" delay={i * 0.05} distance={1 + i * 0.25} className="h-full">
                  <div className={`py-8 sm:px-6 ${i === 0 ? 'sm:pl-0' : ''} ${i === POINTS.length - 1 ? 'sm:pr-0' : ''}`}>
                    {p.drawing}
                    <h3 className="mt-6 text-xl font-medium">{p.title}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{p.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </InViewPlay>
      </div>
    </section>
  );
}
