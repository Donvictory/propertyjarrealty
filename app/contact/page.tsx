'use client';

import { useState } from 'react';

import { sendContactEmail } from '@/app/actions/contact';

const contactInfo = [
  { icon: '📍', label: 'Visit Us', value: '21 Alexander court, Osapa London Lekki' },
  { icon: '📞', label: 'Call Us', value: '09153869750 / +2348146259729' },
  { icon: '✉️', label: 'Email Us', value: 'sales@propertyjarrealty.com' },
  { icon: '🕐', label: 'Office Hours', value: 'Mon – Sat, 9AM – 6PM' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await sendContactEmail(formData);

    setLoading(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Something went wrong.');
    }
  }

  return (
    <main className="min-h-screen pt-32 bg-off-white">


      {/* Appointment CTA */}
      <section className="py-12 bg-brand text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready for a private consultation?</h3>
            <p className="text-white/80">Schedule a direct appointment with one of our luxury specialists.</p>
          </div>
          <a 
            href="https://wa.me/2349153869750?text=Hello%20PropertyJar%20Realty%2C%20I%20would%20like%20to%20book%20an%20appointment%20for%20a%20private%20consultation."
            target="_blank"
            className="bg-white text-brand px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl active:scale-95 inline-block text-center"
          >
            Book an Appointment
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-off-white">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand mb-4 block">Contact Information</span>
            <h1 className="text-4xl font-bold text-charcoal mb-10">We are <span className="italic font-light">Here for You</span></h1>
            <div className="space-y-6 mb-12">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-2xl w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                    <p className="font-semibold text-charcoal">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-72 md:h-96 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner group">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.724623199859!2d3.504283!3d6.435834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf4281f62b881%3A0xc4a193699c279a0!2sOsapa%20London%2C%20Lekki!5e0!3m2!1sen!2sng!4v1715678000000!5m2!1sen!2sng"
                title="PropertyJar Realty Location"
                className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10">
            {submitted ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-6">✅</div>
                <h3 className="text-2xl font-bold text-charcoal mb-3">Message Sent!</h3>
                <p className="text-base text-gray-500">Thank you for reaching out. One of our advisors will be in touch within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-8 bg-brand text-white px-8 py-3 rounded-full font-bold hover:bg-brand-hover transition-all">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-charcoal mb-2">Send a Message</h3>
                  <p className="text-gray-500 text-base">Fill out the form and we will respond within one business day.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 block" htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" required type="text" placeholder="Victoria" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-brand transition-colors text-black" />
                  </div>
                  <div>
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 block" htmlFor="lastName">Last Name</label>
                    <input id="lastName" name="lastName" required type="text" placeholder="Chase" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-brand transition-colors text-black" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 block" htmlFor="email">Email</label>
                  <input id="email" name="email" required type="email" placeholder="hello@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-brand transition-colors text-black" />
                </div>
                <div>
                  <label className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 block" htmlFor="phone">Phone (Optional)</label>
                  <input id="phone" name="phone" type="tel" placeholder="+1 (310) 555-0100" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-brand transition-colors text-black" />
                </div>
                <div>
                  <label className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 block" htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-brand transition-colors bg-white text-black py-3">
                    <option>General Enquiry</option>
                    <option>Property Purchase</option>
                    <option>Property Sale / Listing</option>
                    <option>Investment Advisory</option>
                    <option>Property Management</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 block" htmlFor="message">Message</label>
                  <textarea id="message" name="message" required rows={5} placeholder="Tell us about your requirements..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-brand transition-colors resize-none text-black" />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <p className="text-red-500 text-sm font-bold">{error}</p>
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-brand text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-hover transition-all disabled:opacity-70 shadow-lg shadow-brand/10 active:scale-95">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>


    </main>
  );
}
