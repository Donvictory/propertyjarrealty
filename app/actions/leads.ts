'use server';

import { Resend } from 'resend';
import { EMAIL_RE, escapeHtml, formField as field } from '@/lib/email-html';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPropertyInquiry(formData: FormData) {
  const fullName = field(formData, 'fullName');
  const email = field(formData, 'email');
  const phone = field(formData, 'phone', 40);
  const propertyTitle = field(formData, 'propertyTitle');
  const propertyLocation = field(formData, 'propertyLocation');

  if (!fullName || !email) {
    return { success: false, error: 'Name and email are required.' };
  }
  if (!EMAIL_RE.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  // User input goes into an HTML email, so escape everything.
  const e = {
    fullName: escapeHtml(fullName),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    propertyTitle: escapeHtml(propertyTitle),
    propertyLocation: escapeHtml(propertyLocation),
  };

  try {
    const { error } = await resend.emails.send({
      from: 'PropertyJar Leads <support@propertyjarrealty.com>',
      to: ['support@propertyjarrealty.com'],
      replyTo: email,
      subject: `New Lead: Brochure Request for ${propertyTitle.replace(/[\r\n]/g, ' ')}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #121212;">
          <h2 style="color: #800020;">New Brochure Request</h2>
          <p><strong>Property:</strong> ${e.propertyTitle}</p>
          <p><strong>Location:</strong> ${e.propertyLocation}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Lead Name:</strong> ${e.fullName}</p>
          <p><strong>Lead Email:</strong> ${e.email}</p>
          ${e.phone ? `<p><strong>Lead Phone:</strong> ${e.phone}</p>` : ''}
          <p style="font-size: 10px; color: #999; margin-top: 30px;">
            This lead was captured via the brochure download form on the property page.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('RESEND ERROR (Leads):', JSON.stringify(error, null, 2));
      return { success: false, error: 'Failed to send lead notification.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Lead error:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
