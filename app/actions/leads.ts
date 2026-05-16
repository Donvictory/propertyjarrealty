'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPropertyInquiry(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const propertyTitle = formData.get('propertyTitle') as string;
  const propertyLocation = formData.get('propertyLocation') as string;

  if (!fullName || !email) {
    return { success: false, error: 'Name and email are required.' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'PropertyJar Leads <sales@propertyjarrealty.com>',
      to: ['sales@propertyjarrealty.com'],
      replyTo: email,
      subject: `New Lead: Brochure Request for ${propertyTitle}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #121212;">
          <h2 style="color: #800020;">New Brochure Request</h2>
          <p><strong>Property:</strong> ${propertyTitle}</p>
          <p><strong>Location:</strong> ${propertyLocation}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Lead Name:</strong> ${fullName}</p>
          <p><strong>Lead Email:</strong> ${email}</p>
          <p style="font-size: 10px; color: #999; margin-top: 30px;">
            This lead was captured via the PropertyJar Realty campaign modal.
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
