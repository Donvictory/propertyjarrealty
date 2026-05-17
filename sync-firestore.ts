import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envConfig = fs.readFileSync(envLocalPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      let val = match[2];
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      val = val.replace(/\\n/g, '\n');
      process.env[match[1]] = val;
    }
  });
}


const isConfigured = 
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length && isConfigured) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function sync() {
  const dataPath = path.join(process.cwd(), 'data', 'properties.json');
  const properties = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  for (const prop of properties) {
    const { id, ...data } = prop;
    await db.collection('properties').doc(id).set(data, { merge: true });
    console.log(`Synced ${id}`);
  }
  console.log('Done!');
}

sync().catch(console.error);
