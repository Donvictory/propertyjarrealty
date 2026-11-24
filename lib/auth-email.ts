import 'server-only';
import { Resend } from 'resend';
import { escapeHtml } from './email-html';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'PropertyJar Realty <sales@propertyjarrealty.com>';

/** Simple branded email: heading, paragraph, one button, fallback link. */
function layout({ heading, body, cta, url, footnote }: { heading: string; body: string; cta: string; url: string; footnote: string }) {
  const safeUrl = escapeHtml(url);
  return `<!doctype html>
<html><body style="margin:0;background:#f5f3ee;font-family:Helvetica,Arial,sans-serif;color:#1c1c1b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ee;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;">
        <tr><td style="background:#1c1c1b;padding:24px 32px;color:#f5f3ee;font-size:18px;font-weight:600;">
          PropertyJar <span style="color:#c9a3ab;font-size:11px;letter-spacing:2px;">REALTY</span>
        </td></tr>
        <tr><td style="padding:36px 32px 12px;">
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:600;">${heading}</h1>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#4a4843;">${body}</p>
          <a href="${safeUrl}" style="display:inline-block;background:#800020;color:#ffffff;text-decoration:none;padding:14px 28px;font-size:14px;font-weight:600;">${cta}</a>
          <p style="margin:28px 0 0;font-size:12px;line-height:1.6;color:#6e6b64;">If the button doesn't work, paste this link into your browser:<br><a href="${safeUrl}" style="color:#800020;word-break:break-all;">${safeUrl}</a></p>
        </td></tr>
        <tr><td style="padding:20px 32px 32px;font-size:12px;line-height:1.6;color:#6e6b64;">${footnote}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendVerificationEmail(to: string, name: string, url: string) {
  const first = escapeHtml(name.split(' ')[0] || 'there');
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Confirm your email for PropertyJar',
    html: layout({
      heading: `Welcome, ${first}.`,
      body: 'Confirm your email address to finish setting up your PropertyJar account. The link expires in 24 hours.',
      cta: 'Confirm email',
      url,
      footnote: "If you didn't create a PropertyJar account, you can ignore this email.",
    }),
  });
  if (error) throw new Error(`Verification email failed: ${error.message}`);
}

export async function sendPasswordResetEmail(to: string, url: string) {
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Reset your PropertyJar password',
    html: layout({
      heading: 'Reset your password',
      body: 'We received a request to reset the password on your PropertyJar account. The link expires in 1 hour and can be used once.',
      cta: 'Choose a new password',
      url,
      footnote: "If you didn't ask to reset your password, you can ignore this email. Your password won't change.",
    }),
  });
  if (error) throw new Error(`Reset email failed: ${error.message}`);
}
