/**
 * Seed script — uploads properties from a JSON file to Firestore.
 *
 * Usage:
 *   npm run seed                                        # seed data/properties.json
 *   npm run seed -- --file=data/more.json              # custom JSON file
 *   npm run seed -- --dry-run                          # preview without writing
 *   npm run seed -- --overwrite                        # replace docs (no merge)
 *   npm run seed -- --skip-existing                    # skip docs already in Firestore
 */

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Load .env then .env.local (local wins on conflicts) using Node 20.12+ built-in.
for (const f of ['.env', '.env.local']) {
  try { (process as NodeJS.Process & { loadEnvFile(p: string): void }).loadEnvFile(f); } catch { /* file absent is fine */ }
}

// ---------------------------------------------------------------------------
// Parse CLI flags
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const isDryRun     = args.includes('--dry-run');
const isOverwrite  = args.includes('--overwrite');
const skipExisting = args.includes('--skip-existing');
const fileArg      = args.find(a => a.startsWith('--file='));
const dataFile     = fileArg
  ? path.resolve(process.cwd(), fileArg.split('=')[1])
  : path.join(process.cwd(), 'data', 'properties.json');

// ---------------------------------------------------------------------------
// Initialize Firebase Admin
// ---------------------------------------------------------------------------
const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error('Missing Firebase env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// ---------------------------------------------------------------------------
// Validate a property has the required fields
// ---------------------------------------------------------------------------
const REQUIRED = ['id', 'title', 'location', 'price', 'image', 'type', 'description'] as const;

function validate(prop: Record<string, unknown>): string[] {
  return REQUIRED.filter(f => !prop[f]).map(f => `missing "${f}"`);
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
async function seed() {
  if (!fs.existsSync(dataFile)) {
    console.error(`File not found: ${dataFile}`);
    process.exit(1);
  }

  const properties: Record<string, unknown>[] = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  console.log(`\nSource: ${dataFile}`);
  console.log(`Mode:   ${isDryRun ? 'dry-run' : isOverwrite ? 'overwrite' : skipExisting ? 'skip-existing' : 'merge'}`);
  console.log(`Found:  ${properties.length} propert${properties.length === 1 ? 'y' : 'ies'}\n`);

  let added = 0, skipped = 0, failed = 0;

  for (const prop of properties) {
    const id = prop.id as string | undefined;

    // Validation
    const errors = validate(prop);
    if (errors.length) {
      console.error(`  [SKIP] "${id ?? '(no id)'}" — ${errors.join(', ')}`);
      failed++;
      continue;
    }

    const { id: docId, ...data } = prop;

    if (isDryRun) {
      console.log(`  [DRY]  ${docId} — "${prop.title}"`);
      added++;
      continue;
    }

    try {
      const ref = db.collection('properties').doc(docId as string);

      if (skipExisting) {
        const snap = await ref.get();
        if (snap.exists) {
          console.log(`  [SKIP] ${docId} — already exists`);
          skipped++;
          continue;
        }
      }

      if (isOverwrite) {
        await ref.set({ ...data, id: docId });
      } else {
        await ref.set({ ...data, id: docId }, { merge: true });
      }

      console.log(`  [OK]   ${docId} — "${prop.title}"`);
      added++;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  [ERR]  ${docId} — ${message}`);
      failed++;
    }
  }

  console.log(`\nDone.  ${added} ${isDryRun ? 'would be written' : 'written'}  |  ${skipped} skipped  |  ${failed} failed\n`);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
