import 'server-only';
import { db } from './firebase-admin';
import type { Property } from './types';

const PROPERTIES_COLLECTION = 'properties';

export async function getProperties(): Promise<Property[]> {
  console.log(`[Firestore] Fetching from project: ${process.env.FIREBASE_PROJECT_ID} | Collection: ${PROPERTIES_COLLECTION}`);
  const snapshot = await db.collection(PROPERTIES_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  const doc = await db.collection(PROPERTIES_COLLECTION).doc(id).get();
  if (!doc.exists) return undefined;
  return { id: doc.id, ...doc.data() } as Property;
}

export async function addProperty(data: Omit<Property, 'id'>): Promise<Property> {
  const docRef = await db.collection(PROPERTIES_COLLECTION).add(data);
  return { id: docRef.id, ...data } as Property;
}

export async function updateProperty(id: string, data: Partial<Omit<Property, 'id'>>): Promise<Property | null> {
  const docRef = db.collection(PROPERTIES_COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  
  await docRef.update(data);
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() } as Property;
}

export async function deleteProperty(id: string): Promise<boolean> {
  try {
    await db.collection(PROPERTIES_COLLECTION).doc(id).delete();
    return true;
  } catch {
    return false;
  }
}
