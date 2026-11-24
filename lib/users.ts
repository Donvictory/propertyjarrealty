import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from './firebase-admin';

/*
 * Customer accounts (separate from admin accounts in lib/admins.ts).
 *
 * Firestore layout
 *   users/{id}               the account
 *   user_emails/{email}      uniqueness index: lower-cased email -> user id (created in the same transaction)
 *   user_tokens/{sha256}     one-time email tokens (verify / reset); only the hash is stored
 */

/** Clients buy/invest; realtors refer clients and earn commission. Accounts made before roles existed are clients. */
export type UserRole = 'client' | 'realtor';

export type UserRecord = {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  phone: string;
  passwordHash: string | null;
  googleId: string | null;
  emailVerified: boolean;
  savedPropertyIds: string[];
  /** Id of the user who referred this one (their upline). Set by the referral feature. */
  referredBy: string | null;
  /** This member's own referral code (e.g. "ADA7K2"). Generated at sign-up, or lazily for older accounts. */
  referralCode: string | null;
  /** When the member answered the WhatsApp community invite (joined or dismissed). Null = not asked yet. */
  communityPromptAt: string | null;
  /** Profile photo (Vercel Blob URL), or null for initials. */
  avatarUrl: string | null;
  /** Realtor payout + identity details (null until completed). */
  bankName: string | null;
  bankAccountNumber: string | null;
  /** YYYY-MM-DD */
  dateOfBirth: string | null;
  address: string | null;
  /** Bumped to invalidate every existing session (password change, "sign out everywhere"). */
  sessionVersion: number;
  createdAt: string;
  updatedAt: string;
};

export type TokenType = 'verify' | 'reset';

const USERS = 'users';
const EMAILS = 'user_emails';
const TOKENS = 'user_tokens';
const CODES = 'referral_codes';

function requireDb() {
  if (!db) throw new Error('[Firestore] Not initialized — check FIREBASE_* environment variables.');
  return db;
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

function fromDoc(id: string, data: FirebaseFirestore.DocumentData | undefined): UserRecord | null {
  if (!data) return null;
  return {
    id,
    role: data.role === 'realtor' ? 'realtor' : 'client',
    email: data.email,
    name: data.name ?? '',
    phone: data.phone ?? '',
    passwordHash: data.passwordHash ?? null,
    googleId: data.googleId ?? null,
    emailVerified: Boolean(data.emailVerified),
    savedPropertyIds: Array.isArray(data.savedPropertyIds) ? data.savedPropertyIds : [],
    referredBy: typeof data.referredBy === 'string' ? data.referredBy : null,
    referralCode: typeof data.referralCode === 'string' ? data.referralCode : null,
    communityPromptAt: typeof data.communityPromptAt === 'string' ? data.communityPromptAt : null,
    avatarUrl: typeof data.avatarUrl === 'string' ? data.avatarUrl : null,
    bankName: typeof data.bankName === 'string' ? data.bankName : null,
    bankAccountNumber: typeof data.bankAccountNumber === 'string' ? data.bankAccountNumber : null,
    dateOfBirth: typeof data.dateOfBirth === 'string' ? data.dateOfBirth : null,
    address: typeof data.address === 'string' ? data.address : null,
    sessionVersion: data.sessionVersion ?? 1,
    createdAt: data.createdAt ?? '',
    updatedAt: data.updatedAt ?? '',
  };
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const snap = await requireDb().collection(USERS).doc(id).get();
  return fromDoc(snap.id, snap.data());
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const firestore = requireDb();
  const index = await firestore.collection(EMAILS).doc(normalizeEmail(email)).get();
  const userId = index.data()?.userId as string | undefined;
  return userId ? getUserById(userId) : null;
}

export async function getUserByGoogleId(googleId: string): Promise<UserRecord | null> {
  const snap = await requireDb().collection(USERS).where('googleId', '==', googleId).limit(1).get();
  const doc = snap.docs[0];
  return doc ? fromDoc(doc.id, doc.data()) : null;
}

export class EmailTakenError extends Error {}

/** Creates the user and its email index atomically; throws EmailTakenError if the email is in use. */
export async function createUser(input: {
  email: string;
  name: string;
  phone: string;
  passwordHash: string | null;
  googleId?: string | null;
  emailVerified: boolean;
  /** Upline's user id, if they signed up through a referral link. */
  referredBy?: string | null;
  role?: UserRole;
}): Promise<UserRecord> {
  const firestore = requireDb();
  const email = normalizeEmail(input.email);
  const userRef = firestore.collection(USERS).doc();
  const emailRef = firestore.collection(EMAILS).doc(email);
  const now = new Date().toISOString();
  const role: UserRole = input.role === 'realtor' ? 'realtor' : 'client';
  const data = {
    role,
    email,
    name: input.name.trim(),
    phone: input.phone.trim(),
    passwordHash: input.passwordHash,
    googleId: input.googleId ?? null,
    emailVerified: input.emailVerified,
    savedPropertyIds: [] as string[],
    referredBy: input.referredBy ?? null,
    referralCode: null as string | null,
    communityPromptAt: null as string | null,
    avatarUrl: null as string | null,
    bankName: null as string | null,
    bankAccountNumber: null as string | null,
    dateOfBirth: null as string | null,
    address: null as string | null,
    sessionVersion: 1,
    createdAt: now,
    updatedAt: now,
  };

  // Only realtors get a referral code.
  const candidates = role === 'realtor' ? Array.from({ length: 4 }, () => makeReferralCode(data.name)) : [];
  await firestore.runTransaction(async (tx) => {
    const existing = await tx.get(emailRef);
    if (existing.exists) throw new EmailTakenError('Email already registered');
    const code = candidates.length ? await pickFreeCode(tx, candidates) : null;
    data.referralCode = code;
    tx.set(emailRef, { userId: userRef.id });
    if (code) tx.set(firestore.collection(CODES).doc(code), { userId: userRef.id });
    tx.set(userRef, data);
  });

  return { id: userRef.id, ...data };
}

export async function updateUser(
  id: string,
  patch: Partial<
    Pick<
      UserRecord,
      | 'name'
      | 'phone'
      | 'passwordHash'
      | 'googleId'
      | 'emailVerified'
      | 'avatarUrl'
      | 'bankName'
      | 'bankAccountNumber'
      | 'dateOfBirth'
      | 'address'
    >
  > & {
    bumpSessionVersion?: boolean;
  },
): Promise<UserRecord | null> {
  const { bumpSessionVersion, ...fields } = patch;
  const update: Record<string, unknown> = { ...fields, updatedAt: new Date().toISOString() };
  if (bumpSessionVersion) update.sessionVersion = FieldValue.increment(1);
  await requireDb().collection(USERS).doc(id).update(update);
  return getUserById(id);
}

export async function setSavedProperty(id: string, propertyId: string, saved: boolean): Promise<string[]> {
  const ref = requireDb().collection(USERS).doc(id);
  await ref.update({
    savedPropertyIds: saved ? FieldValue.arrayUnion(propertyId) : FieldValue.arrayRemove(propertyId),
    updatedAt: new Date().toISOString(),
  });
  const snap = await ref.get();
  return (snap.data()?.savedPropertyIds as string[]) ?? [];
}

/** Permanently removes the user, their email index, referral code and any outstanding tokens. */
export async function deleteUser(user: UserRecord): Promise<void> {
  const firestore = requireDb();
  const tokens = await firestore.collection(TOKENS).where('userId', '==', user.id).get();
  const batch = firestore.batch();
  tokens.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(firestore.collection(EMAILS).doc(normalizeEmail(user.email)));
  if (user.referralCode) batch.delete(firestore.collection(CODES).doc(user.referralCode));
  batch.delete(firestore.collection(USERS).doc(user.id));
  await batch.commit();
}

/* ---------------- one-time email tokens ---------------- */

const hashToken = (raw: string) => createHash('sha256').update(raw).digest('hex');

/** Issues a single-use token. Only its SHA-256 hash is stored, so a database leak can't be replayed. */
export async function createToken(userId: string, type: TokenType, ttlMs: number): Promise<string> {
  const raw = randomBytes(32).toString('base64url');
  await requireDb()
    .collection(TOKENS)
    .doc(hashToken(raw))
    .set({ userId, type, expiresAt: Date.now() + ttlMs, createdAt: new Date().toISOString() });
  return raw;
}

/** Validates and burns a token. Returns the user id, or null if unknown, wrong type, expired or already used. */
export async function consumeToken(raw: string, type: TokenType): Promise<string | null> {
  if (!raw || raw.length > 200) return null;
  const firestore = requireDb();
  const ref = firestore.collection(TOKENS).doc(hashToken(raw));
  return firestore.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data();
    if (!data || data.type !== type) return null;
    tx.delete(ref);
    if (typeof data.expiresAt !== 'number' || data.expiresAt < Date.now()) return null;
    return data.userId as string;
  });
}

/** Direct referrals of a user (their level-1 downlines), newest first. */
export async function getDirectReferrals(userId: string, limit = 200): Promise<UserRecord[]> {
  const snap = await requireDb().collection(USERS).where('referredBy', '==', userId).limit(limit).get();
  return snap.docs
    .map((d) => fromDoc(d.id, d.data()))
    .filter((u): u is UserRecord => u !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ---------------- referral codes ---------------- */

// No I, O, 0 or 1, so codes are easy to read out and type.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const REFERRAL_CODE_RE = /^[A-Z0-9]{4,12}$/;

/** First name (up to 4 letters) + 4 random characters, e.g. Ada → "ADA7K2X". */
function makeReferralCode(name: string) {
  const prefix = (name.split(' ')[0] ?? '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'PJR';
  const bytes = randomBytes(4);
  const suffix = Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
  return prefix + suffix;
}

/** Inside a transaction: the first candidate code not already taken (null if all collide, vanishingly rare). */
async function pickFreeCode(tx: FirebaseFirestore.Transaction, candidates: string[]) {
  const firestore = requireDb();
  const snaps = await Promise.all(candidates.map((c) => tx.get(firestore.collection(CODES).doc(c))));
  const i = snaps.findIndex((snap) => !snap.exists);
  return i >= 0 ? candidates[i] : null;
}

/** A realtor's referral code, creating one if missing. Clients don't have codes (returns null). */
export async function ensureReferralCode(user: UserRecord): Promise<string | null> {
  if (user.role !== 'realtor') return null;
  if (user.referralCode) return user.referralCode;
  const firestore = requireDb();
  const userRef = firestore.collection(USERS).doc(user.id);
  const candidates = Array.from({ length: 4 }, () => makeReferralCode(user.name));
  return firestore.runTransaction(async (tx) => {
    const current = await tx.get(userRef);
    const existingCode = current.data()?.referralCode;
    if (typeof existingCode === 'string') return existingCode;
    const code = await pickFreeCode(tx, candidates);
    if (!code) return null;
    tx.set(firestore.collection(CODES).doc(code), { userId: user.id });
    tx.update(userRef, { referralCode: code, updatedAt: new Date().toISOString() });
    return code;
  });
}

/** The realtor a referral code belongs to, or null if the code is unknown or not a realtor's. */
export async function resolveReferralCode(raw: string | null | undefined): Promise<string | null> {
  const code = (raw ?? '').trim().toUpperCase();
  if (!REFERRAL_CODE_RE.test(code)) return null;
  const snap = await requireDb().collection(CODES).doc(code).get();
  const userId = snap.data()?.userId;
  if (typeof userId !== 'string') return null;
  // Only realtors' codes count as referrals.
  const owner = await getUserById(userId);
  return owner?.role === 'realtor' ? userId : null;
}

/** Records that the member has answered the WhatsApp community invite, so it isn't shown again. */
export async function markCommunityPrompted(id: string) {
  await requireDb().collection(USERS).doc(id).update({ communityPromptAt: new Date().toISOString() });
}

/** Realtors must add payout and identity details before commission can be paid. */
export function realtorProfileComplete(u: Pick<UserRecord, 'role' | 'bankName' | 'bankAccountNumber' | 'dateOfBirth' | 'address'>) {
  return u.role !== 'realtor' || Boolean(u.bankName && u.bankAccountNumber && u.dateOfBirth && u.address);
}
