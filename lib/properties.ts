import 'server-only';
import { db } from './firebase-admin';
import type { Property } from './types';
import { unstable_cache } from 'next/cache';

import fs from 'fs';
import path from 'path';

const PROPERTIES_COLLECTION = 'properties';

export const getProperties = unstable_cache(
  async (): Promise<Property[]> => {
    if (db) {
      try {
        console.log(`[Firestore] Fetching from project: ${process.env.FIREBASE_PROJECT_ID} | Collection: ${PROPERTIES_COLLECTION}`);
        const snapshot = await db.collection(PROPERTIES_COLLECTION).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      } catch (err) {
        console.error('[Firestore] Failed to fetch properties from DB, falling back to local:', err);
      }
    }

    // Fallback to local JSON
    console.warn('[Firestore] Falling back to local data/properties.json');
    const propertiesPath = path.join(process.cwd(), 'data', 'properties.json');
    if (fs.existsSync(propertiesPath)) {
      return JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
    }
    return [];
  },
  ['properties-list'],
  { revalidate: 3600, tags: ['properties'] }
);


export async function getPropertyById(id: string): Promise<Property | undefined> {
  if (db) {
    try {
      const doc = await db.collection(PROPERTIES_COLLECTION).doc(id).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() } as Property;
      }
    } catch (err) {
      console.error('[Firestore] Failed to fetch property by id from DB, falling back to local:', err);
    }
  }

  // Fallback to local JSON
  const propertiesPath = path.join(process.cwd(), 'data', 'properties.json');
  if (fs.existsSync(propertiesPath)) {
    const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
    return properties.find((p: Property) => p.id === id);
  }
  return undefined;
}


export async function addProperty(data: Omit<Property, 'id'>): Promise<Property> {
  if (db) {
    try {
      const docRef = await db.collection(PROPERTIES_COLLECTION).add(data);
      return { id: docRef.id, ...data } as Property;
    } catch (err) {
      console.error('[Firestore] addProperty failed, falling back to local file:', err);
    }
  }

  // Resilient fallback to local properties.json
  const propertiesPath = path.join(process.cwd(), 'data', 'properties.json');
  let properties: Property[] = [];
  if (fs.existsSync(propertiesPath)) {
    properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
  }
  const newProperty: Property = {
    id: `local-${Date.now()}`,
    ...data
  };
  properties.push(newProperty);
  fs.writeFileSync(propertiesPath, JSON.stringify(properties, null, 2), 'utf-8');
  console.log(`[Local Fallback] Successfully added property: ${newProperty.id}`);
  return newProperty;
}

export async function updateProperty(id: string, data: Partial<Omit<Property, 'id'>>): Promise<Property | null> {
  if (db) {
    try {
      const docRef = db.collection(PROPERTIES_COLLECTION).doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.update(data);
        const updated = await docRef.get();
        return { id: updated.id, ...updated.data() } as Property;
      }
    } catch (err) {
      console.error('[Firestore] updateProperty failed, falling back to local file:', err);
    }
  }

  // Resilient fallback to local properties.json
  const propertiesPath = path.join(process.cwd(), 'data', 'properties.json');
  if (fs.existsSync(propertiesPath)) {
    const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
    const index = properties.findIndex((p: Property) => p.id === id);
    if (index !== -1) {
      properties[index] = { ...properties[index], ...data };
      fs.writeFileSync(propertiesPath, JSON.stringify(properties, null, 2), 'utf-8');
      console.log(`[Local Fallback] Successfully updated property: ${id}`);
      return properties[index];
    }
  }
  return null;
}

export async function deleteProperty(id: string): Promise<boolean> {
  if (db) {
    try {
      await db.collection(PROPERTIES_COLLECTION).doc(id).delete();
      return true;
    } catch (err) {
      console.error('[Firestore] deleteProperty failed, falling back to local file:', err);
    }
  }

  // Resilient fallback to local properties.json
  const propertiesPath = path.join(process.cwd(), 'data', 'properties.json');
  if (fs.existsSync(propertiesPath)) {
    const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
    const filtered = properties.filter((p: Property) => p.id !== id);
    if (filtered.length !== properties.length) {
      fs.writeFileSync(propertiesPath, JSON.stringify(filtered, null, 2), 'utf-8');
      console.log(`[Local Fallback] Successfully deleted property: ${id}`);
      return true;
    }
  }
  return false;
}
