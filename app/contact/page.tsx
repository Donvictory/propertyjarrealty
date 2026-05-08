'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const contactInfo = [
  { icon: '📍', label: 'Visit Us', value: '1 Luxury Lane, Beverly Hills, CA 90210' },
  { icon: '📞', label: 'Call Us', value: '+1 (310) 555-0198' },
  { icon: '✉️', label: 'Email Us', value: 'hello@propertyjarrealty.com' },
  { icon: '🕐', label: 'Office Hours', value: 'Mon – Sat, 9AM – 7PM PST' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-24 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop)' }} />
        <div className="relative container mx-auto px-6 text-white text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand mb-4 block">Reach Out</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Get in <span className="italic font-light">Touch</span></h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">Whether you have a question, a property to list, or simply want to explore what is possible — we would love to hear from you.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-off-white">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand mb-4 block">Contact Information</span>
            <h2 className="text-4xl font-bold text-charcoal mb-10">We are <span className="italic font-light">Here for You</span></h2>
            <div className="space-y-6 mb-12">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-2xl w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                    <p className="font-semibold text-charcoal">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-56 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
              <p className="text-gray-400 text-sm font-medium">📍 Map — Beverly Hills, CA</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10">
            {submitted ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-6">✅</div>
                <h3 className="text-2xl font-bold text-charcoal mb-3">Message Sent!</h3>
                <p className="text-gray-500">Thank you for reaching out. One of our advisors will be in touch within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-8 bg-brand text-white px-8 py-3 rounded-full font-bold hover:bg-brand-hover transition-all">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-charcoal mb-2">Send a Message</h3>
                  <p className="text-gray-500 text-sm">Fill out the form and we will respond within one business day.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block" htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" required type="text" placeholder="Victoria" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block" htmlFor="lastName">Last Name</label>
                    <input id="lastName" name="lastName" required type="text" placeholder="Chase" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block" htmlFor="email">Email</label>
                  <input id="email" name="email" required type="email" placeholder="hello@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block" htmlFor="phone">Phone (Optional)</label>
                  <input id="phone" name="phone" type="tel" placeholder="+1 (310) 555-0100" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block" htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors bg-white">
                    <option>General Enquiry</option>
                    <option>Property Purchase</option>
                    <option>Property Sale / Listing</option>
                    <option>Investment Advisory</option>
                    <option>Property Management</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block" htmlFor="message">Message</label>
                  <textarea id="message" name="message" required rows={5} placeholder="Tell us about your requirements..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors resize-none" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-brand text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-hover transition-all disabled:opacity-70">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
