import 'server-only';
import bcrypt from 'bcryptjs';
import { db } from './firebase-admin';
import type { Admin } from './types';

const ADMINS_COLLECTION = 'admins';

import fs from 'fs';
import path from 'path';

export async function getAdminByEmail(email: string): Promise<Admin | undefined> {
  // 1. Try Firestore first
  const snapshot = await db.collection(ADMINS_COLLECTION)
    .where('email', '==', email.toLowerCase())
    .limit(1)
    .get();
  
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Admin;
  }

  // 2. Fallback to local JSON if Firestore is empty (for migration)
  const adminsPath = path.join(process.cwd(), 'data', 'admins.json');
  if (fs.existsSync(adminsPath)) {
    const admins = JSON.parse(fs.readFileSync(adminsPath, 'utf-8'));
    return admins.find((a: Admin) => a.email.toLowerCase() === email.toLowerCase());
  }
  
  return undefined;
}

export async function getAdminById(id: string): Promise<Admin | undefined> {
  const doc = await db.collection(ADMINS_COLLECTION).doc(id).get();
  if (!doc.exists) return undefined;
  return { id: doc.id, ...doc.data() } as Admin;
}

export async function getAllAdmins(): Promise<Omit<Admin, 'passwordHash'>[]> {
  console.log(`[Firestore] Fetching admins from project: ${process.env.FIREBASE_PROJECT_ID} | Collection: ${ADMINS_COLLECTION}`);
  const snapshot = await db.collection(ADMINS_COLLECTION).get();
  if (!snapshot.empty) {
    return snapshot.docs.map(doc => {
      const { passwordHash: _, ...rest } = doc.data();
      return { id: doc.id, ...rest } as Omit<Admin, 'passwordHash'>;
    });
  }

  const adminsPath = path.join(process.cwd(), 'data', 'admins.json');
  if (fs.existsSync(adminsPath)) {
    const admins = JSON.parse(fs.readFileSync(adminsPath, 'utf-8'));
    return admins.map((a: Admin) => {
      const { passwordHash: _, ...rest } = a;
      return rest;
    });
  }

  return [];
}

export async function verifyAdminPassword(
  email: string,
  password: string
): Promise<Admin | null> {
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
    name: data.name,
    email: data.email.toLowerCase(),
    passwordHash,
    role: data.role ?? 'admin',
    createdAt: new Date().toISOString(),
  };

  const docRef = await db.collection(ADMINS_COLLECTION).add(newAdminData);
  console.log(`[Firestore] SUCCESS: Added new admin with ID: ${docRef.id} to project: ${process.env.FIREBASE_PROJECT_ID}`);
  return {
    id: docRef.id,
    name: newAdminData.name,
    email: newAdminData.email,
    role: newAdminData.role,
    createdAt: newAdminData.createdAt,
  };
}

export async function deleteAdmin(id: string): Promise<boolean> {
  try {
    await db.collection(ADMINS_COLLECTION).doc(id).delete();
    return true;
  } catch {
    return false;
  }
}

export async function updateAdminPassword(id: string, newPassword: string): Promise<void> {
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.collection(ADMINS_COLLECTION).doc(id).update({ passwordHash });
}
