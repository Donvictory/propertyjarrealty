'use server';

import { Resend } from 'resend';
import { EMAIL_RE, escapeHtml, formField } from '@/lib/email-html';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const firstName = formField(formData, 'firstName', 80);
  const lastName = formField(formData, 'lastName', 80);
  const email = formField(formData, 'email', 200);
  const phone = formField(formData, 'phone', 40);
  const subject = formField(formData, 'subject', 120) || 'General Enquiry';
  const message = formField(formData, 'message', 5000);

  if (!firstName || !lastName || !email || !message) {
    return { success: false, error: 'Please fill in your name, email and message.' };
  }
  if (!EMAIL_RE.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  // Everything below is user input going into an HTML email, so escape it.
  const e = {
    name: escapeHtml(`${firstName} ${lastName}`),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    subject: escapeHtml(subject),
    message: escapeHtml(message).replace(/\n/g, '<br />'),
  };

  try {
    const { error } = await resend.emails.send({
      from: 'PropertyJar Realty <support@propertyjarrealty.com>',
      to: ['support@propertyjarrealty.com'],
      replyTo: email,
      subject: `New Inquiry: ${subject.replace(/[\r\n]/g, ' ')}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #121212;">
          <h2 style="color: #800020;">New Inquiry from PropertyJar Realty Website</h2>
          <p><strong>From:</strong> ${e.name}</p>
          <p><strong>Email:</strong> ${e.email}</p>
          <p><strong>Phone:</strong> ${e.phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${e.subject}</p>
          <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #800020;">
            <p><strong>Message:</strong></p>
            <p>${e.message}</p>
          </div>
          <p style="font-size: 10px; color: #999; margin-top: 30px;">
            This email was sent via the PropertyJar Realty contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('RESEND ERROR (Contact):', JSON.stringify(error, null, 2));
      return { success: false, error: 'Failed to send email.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Submission error:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
