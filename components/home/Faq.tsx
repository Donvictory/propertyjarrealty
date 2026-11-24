import Reveal from '@/components/motion/Reveal';

const FAQS = [
  {
    q: 'Can I view listings without an account?',
    a: 'Yes. Sign in only when you want to save, enquire or pay.',
  },
  {
    q: 'Can I pay in instalments?',
    a: 'Many of our properties offer instalment plans. The available options are shown on each property page.',
  },
  {
    q: 'Can I inspect a property before paying?',
    a: 'Yes. Send an enquiry and our team will arrange a site visit at a time that suits you.',
  },
  {
    q: 'Are investment returns guaranteed?',
    a: 'No. Projections use assumptions, and actual outcomes can differ.',
  },
];

export default function Faq() {
  return (
    <section className="bg-panel">
      <div className="shell py-16 lg:py-20">
        <Reveal from="left">
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-4xl font-medium tracking-[-0.02em] lg:text-5xl">A few answers.</h2>
          </div>
        </Reveal>

        <div className="mt-10 border-b border-line">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} from="right" distance={1 + i * 0.2}>
              <details open={i === 0} className="group border-t border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="w-4 text-center text-xl text-brand group-open:hidden">
                    +
                  </span>
                  <span aria-hidden className="hidden w-4 text-center text-xl text-brand group-open:inline">
                    –
                  </span>
                </summary>
                <p className="-mt-2 pb-5 text-[15px] text-muted">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
