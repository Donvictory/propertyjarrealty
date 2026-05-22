import 'server-only';
import { db } from './firebase-admin';
import type { Property } from './types';
import { unstable_cache } from 'next/cache';

const PROPERTIES_COLLECTION = 'properties';

function requireDb() {
  if (!db) throw new Error('[Firestore] Not initialized — check FIREBASE_* environment variables on Vercel.');
  return db;
}

export const getProperties = unstable_cache(
  async (): Promise<Property[]> => {
    const firestore = requireDb();
    const snapshot = await firestore.collection(PROPERTIES_COLLECTION).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
  },
  ['properties-list'],
  { revalidate: 3600, tags: ['properties'] }
);

export async function getPropertyById(id: string): Promise<Property | undefined> {
  const firestore = requireDb();
  const doc = await firestore.collection(PROPERTIES_COLLECTION).doc(id).get();
  if (!doc.exists) return undefined;
  return { id: doc.id, ...doc.data() } as Property;
}

export async function addProperty(data: Omit<Property, 'id'>): Promise<Property> {
  const firestore = requireDb();
  const docRef = await firestore.collection(PROPERTIES_COLLECTION).add(data);
  return { id: docRef.id, ...data } as Property;
}

export async function updateProperty(id: string, data: Partial<Omit<Property, 'id'>>): Promise<Property | null> {
  const firestore = requireDb();
  const docRef = firestore.collection(PROPERTIES_COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  await docRef.update(data);
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() } as Property;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const firestore = requireDb();
  await firestore.collection(PROPERTIES_COLLECTION).doc(id).delete();
  return true;
}
