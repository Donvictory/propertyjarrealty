import * as admin from 'firebase-admin';

const isConfigured =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

function parsePrivateKey(raw: string): string {
  // Strip surrounding quotes Vercel sometimes injects when pasting JSON values
  let key = raw.replace(/^["']|["']$/g, '');
  // Convert literal \n sequences to actual newlines
  key = key.replace(/\\n/g, '\n');
  return key;
}

if (!admin.apps.length && isConfigured) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY!),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

// Export database and auth only if the app was initialized successfully
export const db = admin.apps.length ? admin.firestore() : null;
export const auth = admin.apps.length ? admin.auth() : null;

