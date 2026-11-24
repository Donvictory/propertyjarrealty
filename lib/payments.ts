import 'server-only';
import { db } from './firebase-admin';

/*
 * Payments recorded by the PropertyJar team in the admin panel (a client paid for / towards a property).
 * They power the client dashboard ("amount spent") and the realtor dashboard (sales from their clients).
 * Amounts are whole naira.
 *
 *   payments/{id}  { userId, userName, userEmail, propertyId, propertyTitle, amount, paidAt, reference, note,
 *                    recordedBy, createdAt }
 */

export type Payment = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  propertyId: string;
  propertyTitle: string;
  amount: number;
  /** Date the client paid (YYYY-MM-DD). */
  paidAt: string;
  reference: string;
  note: string;
  recordedBy: string;
  createdAt: string;
};

const PAYMENTS = 'payments';

function requireDb() {
  if (!db) throw new Error('[Firestore] Not initialized — check FIREBASE_* environment variables.');
  return db;
}

function fromDoc(id: string, d: FirebaseFirestore.DocumentData): Payment {
  return {
    id,
    userId: d.userId,
    userName: d.userName ?? '',
    userEmail: d.userEmail ?? '',
    propertyId: d.propertyId ?? '',
    propertyTitle: d.propertyTitle ?? '',
    amount: Number(d.amount) || 0,
    paidAt: d.paidAt ?? '',
    reference: d.reference ?? '',
    note: d.note ?? '',
    recordedBy: d.recordedBy ?? '',
    createdAt: d.createdAt ?? '',
  };
}

const newestFirst = (a: Payment, b: Payment) => b.paidAt.localeCompare(a.paidAt) || b.createdAt.localeCompare(a.createdAt);

export async function recordPayment(input: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> {
  const createdAt = new Date().toISOString();
  const ref = await requireDb().collection(PAYMENTS).add({ ...input, createdAt });
  return { id: ref.id, ...input, createdAt };
}

export async function deletePayment(id: string) {
  await requireDb().collection(PAYMENTS).doc(id).delete();
}

export async function listPaymentsForUser(userId: string): Promise<Payment[]> {
  const snap = await requireDb().collection(PAYMENTS).where('userId', '==', userId).get();
  return snap.docs.map((d) => fromDoc(d.id, d.data())).sort(newestFirst);
}

/** Payments for many users (Firestore "in" queries take at most 30 values, so this batches). */
export async function listPaymentsForUsers(userIds: string[]): Promise<Payment[]> {
  const unique = [...new Set(userIds)];
  const out: Payment[] = [];
  for (let i = 0; i < unique.length; i += 30) {
    const snap = await requireDb().collection(PAYMENTS).where('userId', 'in', unique.slice(i, i + 30)).get();
    out.push(...snap.docs.map((d) => fromDoc(d.id, d.data())));
  }
  return out.sort(newestFirst);
}

export async function listRecentPayments(limit = 50): Promise<Payment[]> {
  const snap = await requireDb().collection(PAYMENTS).orderBy('createdAt', 'desc').limit(limit).get();
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

export const sumAmounts = (payments: Payment[]) => payments.reduce((t, p) => t + p.amount, 0);

export const naira = (n: number) => `₦${Math.round(n).toLocaleString('en-US')}`;
