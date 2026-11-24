'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { getProperties } from '@/lib/properties';
import { getUserByEmail } from '@/lib/users';
import { deletePayment, recordPayment } from '@/lib/payments';

export type PaymentFormState = {
  error?: string;
  success?: string;
  fields?: Record<string, string>;
  values?: Record<string, string>;
};

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error('Not signed in as an admin.');
  return session;
}

const schema = z.object({
  userEmail: z.string().trim().toLowerCase().email('Enter the client’s account email.'),
  propertyId: z.string().min(1, 'Choose the property.'),
  amount: z
    .string()
    .transform((v) => Number(v.replace(/[^0-9.]/g, '')))
    .refine((n) => Number.isFinite(n) && n > 0, 'Enter the amount paid in naira.'),
  paidAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose the date of payment.'),
  reference: z.string().trim().max(120).optional().default(''),
  note: z.string().trim().max(500).optional().default(''),
});

/** Record a payment a client made, from the admin Payments page. Admin-only, checked on the server. */
export async function recordPaymentAction(_prev: PaymentFormState, formData: FormData): Promise<PaymentFormState> {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return { error: 'Your admin session has expired. Sign in again.' };
  }

  const values = Object.fromEntries(
    ['userEmail', 'propertyId', 'amount', 'paidAt', 'reference', 'note'].map((k) => [k, String(formData.get(k) ?? '')]),
  );
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) fields[String(issue.path[0])] ??= issue.message;
    return { fields, values };
  }
  const v = parsed.data;

  const user = await getUserByEmail(v.userEmail).catch(() => null);
  if (!user) return { fields: { userEmail: 'No account uses that email. The client must sign up first.' }, values };

  const property = (await getProperties().catch(() => [])).find((p) => p.id === v.propertyId);
  if (!property) return { fields: { propertyId: 'That property no longer exists.' }, values };

  const amount = Math.round(v.amount);
  await recordPayment({
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    propertyId: property.id,
    propertyTitle: property.title,
    amount,
    paidAt: v.paidAt,
    reference: v.reference,
    note: v.note,
    recordedBy: session.adminEmail,
  });

  revalidatePath('/admin/payments');
  return { success: `Recorded ₦${amount.toLocaleString('en-US')} from ${user.name} for ${property.title}.` };
}

/** Remove a payment recorded by mistake. Admin-only. */
export async function deletePaymentAction(id: string): Promise<{ ok: boolean }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false };
  }
  if (!/^[A-Za-z0-9]{10,40}$/.test(id)) return { ok: false };
  await deletePayment(id);
  revalidatePath('/admin/payments');
  return { ok: true };
}
