import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { put } from '@vercel/blob';
import * as admin from 'firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  
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
    const storagePath = `uploads/${uniqueFilename}`;

    
    if (admin.apps.length && process.env.FIREBASE_PROJECT_ID) {
      const bucketCandidates = [
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
        `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
      ].filter(Boolean) as string[];

      for (const bucketName of bucketCandidates) {
        try {
          const bucket = admin.storage().bucket(bucketName);
          const gcsFile = bucket.file(storagePath);

          await gcsFile.save(buffer, {
            metadata: { contentType: file.type },
          });

          try {
            await gcsFile.makePublic();
          } catch (aclError) {
            console.warn(`[Upload] Could not set ACL to public for bucket ${bucketName}. Using alt=media URL anyway.`, aclError);
          }

          const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(storagePath)}?alt=media`;
          return NextResponse.json({ url });
        } catch (storageError) {
          console.warn(`[Upload] Firebase storage failed for bucket ${bucketName}. Details:`, storageError);
        }
      }
    }

    
    console.warn('[Upload] Firebase Storage not available or failed. Uploading to Vercel Blob...');

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error('BLOB_READ_WRITE_TOKEN is not defined in environment variables.');
    }

    const blob = await put(storagePath, buffer, {
      access: 'public',
      contentType: file.type,
      token: token,
    });

    return NextResponse.json({ url: blob.url });

  } catch (error) {
    console.error('[Upload] Root upload handler error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to upload file'
    }, { status: 500 });
  }
}