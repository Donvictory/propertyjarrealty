'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  try {
    const { data, error } = await resend.emails.send({
      from: 'PropertyJar Realty <onboarding@resend.dev>',
      to: ['donvictoryadewumi4@gmail.com'],
      subject: `New Inquiry: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #121212;">
          <h2 style="color: #800020;">New Inquiry from PropertyJar Realty Website</h2>
          <p><strong>From:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #800020;">
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
          <p style="font-size: 10px; color: #999; margin-top: 30px;">
            This email was sent via the PropertyJar Realty contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Email error:', error);
      return { success: false, error: 'Failed to send email.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Submission error:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
