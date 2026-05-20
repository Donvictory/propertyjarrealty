import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import fs from 'fs';
import path from 'path';
import * as admin from 'firebase-admin';

export async function POST(request: NextRequest) {
  // 1. Authorize session
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

    // 2. Try uploading to Firebase Storage (checks dynamic candidate buckets)
    if (admin.apps.length && process.env.FIREBASE_PROJECT_ID) {
      const bucketCandidates = [
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
        `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
      ].filter(Boolean) as string[];

      for (const bucketName of bucketCandidates) {
        try {
          console.log(`[Upload] Attempting Firebase Storage upload to bucket: ${bucketName}`);
          const bucket = admin.storage().bucket(bucketName);
          const gcsFile = bucket.file(`uploads/${uniqueFilename}`);
          
          await gcsFile.save(buffer, {
            metadata: {
              contentType: file.type,
            },
          });

          // Generate far-future signed URL valid for 75 years (until 2100)
          const [url] = await gcsFile.getSignedUrl({
            action: 'read',
            expires: '01-01-2100', 
          });

          console.log(`[Upload] SUCCESS: Successfully uploaded file to bucket ${bucketName}`);
          return NextResponse.json({ url });
        } catch (storageError) {
          console.warn(`[Upload] Firebase storage failed for bucket ${bucketName}. Details:`, storageError);
        }
      }
    }

    // 3. Fallback: Save to Local Storage in public/uploads/ (Only works in local dev environments)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, uniqueFilename);
      fs.writeFileSync(filePath, buffer);

      const origin = request.headers.get('origin') || new URL(request.url).origin;
      const localUrl = `${origin}/uploads/${uniqueFilename}`;
      console.log(`[Upload] Local disk fallback successful: ${localUrl}`);
      return NextResponse.json({ url: localUrl });
    } catch (fsError) {
      console.error('[Upload] Local disk storage failed (expected on serverless read-only platforms):', fsError);
      throw new Error('Cloud storage unconfigured and read-only local storage fallback failed.');
    }

  } catch (error) {
    console.error('[Upload] Root upload handler error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to upload file' 
    }, { status: 500 });
  }
}
