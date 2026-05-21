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

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      return NextResponse.json({ error: 'Only image files and PDF documents are allowed' }, { status: 400 });
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

          // Try to make the file public (might fail if uniform bucket-level access is enforced, but that's okay)
          try {
            await gcsFile.makePublic();
          } catch (aclError) {
            console.warn(`[Upload] Could not set ACL to public for bucket ${bucketName}. Using alt=media URL anyway.`, aclError);
          }

          // Generate public media URL
          const filePath = `uploads/${uniqueFilename}`;
          const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`;

          console.log(`[Upload] SUCCESS: Successfully uploaded file to bucket ${bucketName}`);
          return NextResponse.json({ url });
        } catch (storageError) {
          console.warn(`[Upload] Firebase storage failed for bucket ${bucketName}. Details:`, storageError);
        }
      }
    }

    // 3. Fallback to Local Public Uploads Directory if Firebase fails or is not configured
    console.warn('[Upload] Firebase Storage not available or failed. Falling back to local disk storage in public/uploads/...');
    
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueFilename);
    await fs.promises.writeFile(filePath, buffer);

    console.log(`[Upload] SUCCESS: Saved file locally as /uploads/${uniqueFilename}`);
    const localUrl = `/uploads/${uniqueFilename}`;
    return NextResponse.json({ url: localUrl });

  } catch (error) {
    console.error('[Upload] Root upload handler error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to upload file' 
    }, { status: 500 });
  }
}
