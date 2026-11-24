import CtaBand from '@/components/site/CtaBand';

export default function ContactCta() {
  return (
    <div className="shell py-16 lg:py-20">
      <CtaBand
        tone="sage"
        title={
          <>
            Let&rsquo;s talk about
            <br />
            your next move.
          </>
        }
        body="Tell us what you are looking for. We will take it from there."
        cta={{ label: 'Speak to the team', href: '/contact' }}
      />
    </div>
  );
}
