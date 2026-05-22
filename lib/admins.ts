import 'server-only';
import bcrypt from 'bcryptjs';
import { db } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { Admin } from './types';

const ADMINS_COLLECTION = 'admins';

function requireDb() {
  if (!db) throw new Error('[Firestore] Not initialized — check FIREBASE_* environment variables on Vercel.');
  return db;
}

export async function getAdminByEmail(email: string): Promise<Admin | undefined> {
  const firestore = requireDb();
  const snapshot = await firestore
    .collection(ADMINS_COLLECTION)
    .where('email', '==', email.toLowerCase())
    .limit(1)
    .get();
  if (snapshot.empty) return undefined;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Admin;
}

export async function getAdminById(id: string): Promise<Admin | undefined> {
  const firestore = requireDb();
  const doc = await firestore.collection(ADMINS_COLLECTION).doc(id).get();
  if (!doc.exists) return undefined;
  return { id: doc.id, ...doc.data() } as Admin;
}

export async function getAllAdmins(): Promise<Omit<Admin, 'passwordHash'>[]> {
  const firestore = requireDb();
  const snapshot = await firestore.collection(ADMINS_COLLECTION).get();
  return snapshot.docs.map(doc => {
    const d = doc.data() as Admin;
    return {
      id:             doc.id,
      name:           d.name,
      email:          d.email,
      role:           d.role,
      createdAt:      d.createdAt,
      sessionVersion: d.sessionVersion,
    } as Omit<Admin, 'passwordHash'>;
  });
}

export async function verifyAdminPassword(email: string, password: string): Promise<Admin | null> {
  const admin = await getAdminByEmail(email);
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.passwordHash);
  return valid ? admin : null;
}

export async function createAdmin(data: {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'super_admin';
}): Promise<Omit<Admin, 'passwordHash'>> {
  const exists = await getAdminByEmail(data.email);
  if (exists) throw new Error('An admin with this email already exists.');

  const passwordHash = await bcrypt.hash(data.password, 12);
  const newAdminData = {
    name:           data.name,
    email:          data.email.toLowerCase(),
    passwordHash,
    role:           data.role ?? 'admin',
    createdAt:      new Date().toISOString(),
    sessionVersion: 1,
  };

  const firestore = requireDb();
  const docRef = await firestore.collection(ADMINS_COLLECTION).add(newAdminData);
  return {
    id:             docRef.id,
    name:           newAdminData.name,
    email:          newAdminData.email,
    role:           newAdminData.role,
    createdAt:      newAdminData.createdAt,
    sessionVersion: newAdminData.sessionVersion,
  };
}

export async function deleteAdmin(id: string): Promise<boolean> {
  const firestore = requireDb();
  await firestore.collection(ADMINS_COLLECTION).doc(id).delete();
  return true;
}

export async function updateAdminPassword(id: string, newPassword: string): Promise<void> {
  const firestore = requireDb();
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await firestore.collection(ADMINS_COLLECTION).doc(id).update({
    passwordHash,
    sessionVersion: FieldValue.increment(1),
  });
}
