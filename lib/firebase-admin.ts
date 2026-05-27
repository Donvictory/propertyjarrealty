import 'server-only';
import * as admin from 'firebase-admin';

const isConfigured =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

function parsePrivateKey(raw: string): string {
  
  let key = raw.replace(/^["']|["']$/g, '');
  
  key = key.replace(/\\n/g, '\n');
  return key;
}

if (!admin.apps.length && isConfigured) {
  const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY!);

  console.log('[Firebase Admin] Key diagnostics:', {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    keyLength: privateKey.length,
    startsCorrectly: privateKey.startsWith('-----BEGIN PRIVATE KEY-----'),
    endsCorrectly: privateKey.trimEnd().endsWith('-----END PRIVATE KEY-----'),
    hasRealNewlines: privateKey.includes('\n'),
    hasLiteralBackslashN: privateKey.includes('\\n'),
  });

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  } catch (error) {
    console.error('[Firebase Admin] ❌ Initialization failed:', error);
  }
} else if (!isConfigured) {
  console.error('[Firebase Admin] ❌ Missing environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY');
}

export const db = admin.apps.length ? admin.firestore() : null;
export const auth = admin.apps.length ? admin.auth() : null;
