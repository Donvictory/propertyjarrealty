import { Suspense } from 'react';
import Reveal from '@/components/motion/Reveal';
import ContactForm, { ContactFormFromUrl } from '@/components/contact/ContactForm';

const WHATSAPP = 'https://wa.me/2349153869750';
const WHATSAPP_BOOKING = `${WHATSAPP}?text=Hello%20PropertyJar%20Realty%2C%20I%20would%20like%20to%20book%20an%20appointment%20for%20a%20private%20consultation.`;
const MAPS_LINK = 'https://maps.google.com/?q=Osapa+London,+Lekki,+Lagos';
const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.724623199859!2d3.504283!3d6.435834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf4281f62b881%3A0xc4a193699c279a0!2sOsapa%20London%2C%20Lekki!5e0!3m2!1sen!2sng!4v1715678000000!5m2!1sen!2sng';

const CHANNELS = [
  { label: 'Email', value: 'sales@propertyjarrealty.com', href: 'mailto:sales@propertyjarrealty.com' },
  { label: 'Call', value: '0915 386 9750', href: 'tel:+2349153869750' },
  { label: 'Call', value: '+234 814 625 9729', href: 'tel:+2348146259729' },
  { label: 'WhatsApp', value: 'Chat with our team', href: WHATSAPP, external: true },
  { label: 'Visit', value: '21 Alexander Court, Osapa London, Lekki', href: MAPS_LINK, external: true },
];

/* Each half bleeds to its screen edge; content lines up with the site's .shell gutter. */
const BLEED_LEFT = 'px-4 sm:px-8 lg:pl-[max(4rem,calc((100vw-1440px)/2+4rem))] lg:pr-16';
const BLEED_RIGHT = 'px-4 sm:px-8 lg:pr-[max(4rem,calc((100vw-1440px)/2+4rem))] lg:pl-16';

export default function ContactPage() {
  return (
    <main>
      <section className="grid lg:min-h-[calc(100svh-5rem)] lg:grid-cols-2">
        {/* Ways to reach us */}
        <div className={`flex flex-col bg-ink py-14 text-paper lg:py-20 ${BLEED_LEFT}`}>
          <Reveal from="left">
            <p className="eyebrow text-paper/60">Contact</p>
            <h1 className="mt-5 text-[44px] font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[64px]">
              We are here for you.
            </h1>
            <p className="mt-5 text-lg text-paper/70">We will respond within one business day.</p>
          </Reveal>

          <ul className="mt-12 border-t border-paper/15 lg:mt-16">
            {CHANNELS.map((c, i) => (
              <li key={c.value} className="border-b border-paper/15">
                <Reveal from="left" distance={1 + i * 0.12}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="btn-fill btn-paper -mx-3 grid grid-cols-[5.5rem_1fr] items-baseline gap-4 px-3 py-5 sm:grid-cols-[7rem_1fr]"
                  >
                    <span className="text-sm opacity-60">{c.label}</span>
                    <span className="text-lg font-medium tracking-[-0.01em] sm:text-xl">{c.value}</span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal from="left" distance={1.7}>
            <p className="mt-10 text-sm text-paper/60">Office hours: Monday to Saturday, 9:00 am to 6:00 pm</p>
          </Reveal>
        </div>

        {/* Message form */}
        <div className={`py-14 lg:py-20 ${BLEED_RIGHT}`}>
          <Reveal from="right">
            <h2 className="text-3xl font-medium tracking-[-0.02em] lg:text-4xl">Send a message</h2>
            <p className="mt-3 text-muted">Tell us what you are looking for and we will take it from there.</p>
            <div className="mt-10">
              {/* Static page: ?subject= is read client-side; the fallback is the same form, so it's in the prerendered HTML. */}
              <Suspense fallback={<ContactForm />}>
                <ContactFormFromUrl />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Map strip with the visit card on top */}
      <section className="relative h-[460px] bg-panel lg:h-[520px]">
        <iframe
          src={MAP_SRC}
          title="PropertyJar Realty location: Osapa London, Lekki"
          className="absolute inset-0 h-full w-full border-0 grayscale-[40%]"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="shell pointer-events-none relative flex h-full items-end pb-6 lg:items-center lg:pb-0">
          <Reveal from="left" className="pointer-events-auto w-full max-w-sm">
            <div className="bg-paper p-6 shadow-[0_12px_40px_rgba(28,28,27,0.18)] sm:p-8">
              <p className="text-sm text-muted">Our office</p>
              <p className="mt-2 text-2xl font-medium leading-tight tracking-[-0.01em]">
                21 Alexander Court,
                <br />
                Osapa London, Lekki
              </p>
              <p className="mt-4 text-sm text-muted">
                Visits are by appointment, so we can have the right person ready for you.
              </p>
              <a
                href={WHATSAPP_BOOKING}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fill btn-brand mt-6 flex h-12 items-center justify-center bg-brand text-sm font-medium text-white"
              >
                Book an appointment
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
