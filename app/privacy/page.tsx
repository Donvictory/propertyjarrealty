import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for PropertyJar Realty Ltd.",
  alternates: {
    canonical: "https://propertyjarrealty.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-off-white dark:bg-paper pt-10 pb-20 selection:bg-brand selection:text-on-brand">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 dark:text-muted hover:text-charcoal dark:hover:text-ink transition-colors mb-10 text-xs font-bold uppercase tracking-widest"
        >
          ← Back to home
        </Link>

        <div className="bg-white dark:bg-panel rounded-3xl p-8 md:p-16 border border-gray-100 dark:border-line shadow-xl">
          <h1 className="text-3xl md:text-5xl font-bold text-charcoal dark:text-ink mb-8 tracking-tighter leading-none">
            Privacy Policy
          </h1>

          <div className="prose prose-neutral max-w-none text-gray-600 dark:text-muted space-y-8 text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-charcoal dark:text-ink mb-4 tracking-tight">
                1. Introduction
              </h2>
              <p>
                PropertyJar Realty Ltd ("we," "our," or "us") is committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                visit our website, including any other media form, media
                channel, mobile website, or mobile application related or
                connected thereto.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-charcoal dark:text-ink mb-4 tracking-tight">
                2. Information Collection
              </h2>
              <p>
                We may collect information about you in a variety of ways. The
                information we may collect on the Site includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong>Personal Data:</strong> Personally identifiable
                  information, such as your name, shipping address, email
                  address, and telephone number, that you voluntarily give to us
                  when you request property brochures or contact us.
                </li>
                <li>
                  <strong>Derivative Data:</strong> Information our servers
                  automatically collect when you access the Site, such as your
                  IP address, your browser type, your operating system, your
                  access times, and the pages you have viewed directly before
                  and after accessing the Site.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-charcoal dark:text-ink mb-4 tracking-tight">
                3. Use of Your Information
              </h2>
              <p>
                Having accurate information about you permits us to provide you
                with a smooth, efficient, and customized experience.
                Specifically, we may use information collected about you via the
                Site to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Send you requested brochures, investment analyses, and listing
                  updates.
                </li>
                <li>Respond to customer service requests and inquiries.</li>
                <li>
                  Deliver targeted advertisements, coupons, newsletters, and
                  other information regarding promotions and the Site to you.
                </li>
                <li>Increase the efficiency and operation of the Site.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-charcoal dark:text-ink mb-4 tracking-tight">
                4. Security of Your Information
              </h2>
              <p>
                We use administrative, technical, and physical security measures
                to help protect your personal information. While we have taken
                reasonable steps to secure the personal information you provide
                to us, please be aware that despite our efforts, no security
                measures are perfect or impenetrable, and no method of data
                transmission can be guaranteed against any interception or other
                type of misuse.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-charcoal dark:text-ink mb-4 tracking-tight">
                5. Our AI Assistant
              </h2>
              <p>
                The chat assistant on our site is powered by third-party AI
                services (Google Gemini, and xAI Grok as a backup). Your typed
                messages and voice notes are sent to these services to produce
                an answer. We do not store your conversation; it stays in your
                browser tab until you close it or start a new chat. If you ask
                our team to contact you through the assistant, we keep the name,
                phone number, email and interest you share so we can follow up.
                Please don&rsquo;t share bank, card or identity details in the
                chat.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-charcoal dark:text-ink mb-4 tracking-tight">
                6. Contact Us
              </h2>
              <p>
                If you have questions or comments about this Privacy Policy,
                please contact us at:
              </p>
              <div className="bg-off-white/50 dark:bg-paper border border-gray-100 dark:border-line rounded-2xl p-6 mt-4 font-bold text-charcoal dark:text-ink text-sm">
                PropertyJar Realty Ltd
                <br />
                Email: support@propertyjarrealty.com
                <br />
                Phone: +234 915 386 9750
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
