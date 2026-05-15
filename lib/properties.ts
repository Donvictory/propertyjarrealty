import 'server-only';
import { db } from './firebase-admin';
import type { Property } from './types';
import { unstable_cache } from 'next/cache';

import fs from 'fs';
import path from 'path';

const PROPERTIES_COLLECTION = 'properties';

export const getProperties = unstable_cache(
  async (): Promise<Property[]> => {
    // Fallback to local JSON if Firestore is not initialized
    if (!db) {
      console.warn('[Firestore] DB not initialized, falling back to local data/properties.json');
      const propertiesPath = path.join(process.cwd(), 'data', 'properties.json');
      if (fs.existsSync(propertiesPath)) {
        return JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
      }
      return [];
    }

    console.log(`[Firestore] Fetching from project: ${process.env.FIREBASE_PROJECT_ID} | Collection: ${PROPERTIES_COLLECTION}`);
    const snapshot = await db.collection(PROPERTIES_COLLECTION).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
  },
  ['properties-list'],
  { revalidate: 3600, tags: ['properties'] }
);


export async function getPropertyById(id: string): Promise<Property | undefined> {
  if (!db) {
    const propertiesPath = path.join(process.cwd(), 'data', 'properties.json');
    if (fs.existsSync(propertiesPath)) {
      const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
      return properties.find((p: Property) => p.id === id);
    }
    return undefined;
  }
  const doc = await db.collection(PROPERTIES_COLLECTION).doc(id).get();
  if (!doc.exists) return undefined;
  return { id: doc.id, ...doc.data() } as Property;
}


export async function addProperty(data: Omit<Property, 'id'>): Promise<Property> {
  if (!db) throw new Error('Database not initialized');
  const docRef = await db.collection(PROPERTIES_COLLECTION).add(data);
  return { id: docRef.id, ...data } as Property;
}

export async function updateProperty(id: string, data: Partial<Omit<Property, 'id'>>): Promise<Property | null> {
  if (!db) return null;
  const docRef = db.collection(PROPERTIES_COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  
  await docRef.update(data);
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() } as Property;
}

export async function deleteProperty(id: string): Promise<boolean> {
  try {
    if (!db) return false;
    await db.collection(PROPERTIES_COLLECTION).doc(id).delete();
    return true;
  } catch {
    return false;
  }
}
