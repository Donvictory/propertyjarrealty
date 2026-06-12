import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for PropertyJar Realty Ltd.",
  alternates: {
    canonical: "https://propertyjarrealty.com/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-off-white pt-10 pb-20 selection:bg-brand selection:text-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-charcoal transition-colors mb-10 text-xs font-bold  tracking-widest"
        >
          ← Back to home
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-16 border border-gray-100 shadow-xl">
          <h1 className="text-3xl md:text-5xl font-bold text-charcoal mb-8 tracking-tighter leading-none">
            Terms of Service
          </h1>

          <div className="prose prose-neutral max-w-none text-gray-600 space-y-8 text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-charcoal mb-4 tracking-tight">
                1. Agreement to Terms
              </h2>
              <p>
                These Terms of Service constitute a legally binding agreement
                made between you, whether personally or on behalf of an entity
                ("you") and PropertyJar Realty Ltd ("we," "us," or "our"),
                concerning your access to and use of our website. By accessing
                the Site, you agree that you have read, understood, and agree to
                be bound by all of these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-charcoal mb-4 tracking-tight">
                2. Intellectual Property Rights
              </h2>
              <p>
                Unless otherwise indicated, the Site is our proprietary property
                and all source code, databases, functionality, software, website
                designs, audio, video, text, photographs, and graphics on the
                Site and the trademarks, service marks, and logos contained
                therein are owned or controlled by us or licensed to us, and are
                protected by copyright and trademark laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-charcoal mb-4 tracking-tight">
                3. User Representations
              </h2>
              <p>By using the Site, you represent and warrant that:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  All registration or contact information you submit will be
                  true, accurate, current, and complete.
                </li>
                <li>
                  You will maintain the accuracy of such information and
                  promptly update such information as necessary.
                </li>
                <li>
                  You have the legal capacity and you agree to comply with these
                  Terms of Service.
                </li>
                <li>
                  You will not use the Site for any illegal or unauthorized
                  purpose, and your use of the Site will not violate any
                  applicable law or regulation.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-charcoal mb-4 tracking-tight">
                4. Property Listings and Information
              </h2>
              <p>
                We attempt to be as accurate as possible with the property
                specifications, pricing, floor plans, and investment estimations
                listed on the Site. However, all listings are subject to
                verification, market changes, availability, and legal
                confirmation. We do not warrant that property listings,
                brochures, or other content on this Site are 100% accurate,
                complete, reliable, current, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-charcoal mb-4 tracking-tight">
                5. Limitation of Liability
              </h2>
              <p>
                In no event will we or our directors, employees, or agents be
                liable to you or any third party for any direct, indirect,
                consequential, exemplary, incidental, special, or punitive
                damages, including lost profit, lost revenue, loss of data, or
                other damages arising from your use of the site, even if we have
                been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-charcoal mb-4 tracking-tight">
                6. Governing Law
              </h2>
              <p>
                These Terms of Service and your use of the Site are governed by
                and construed in accordance with the laws of the Federal
                Republic of Nigeria, without regard to its conflict of law
                principles.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
