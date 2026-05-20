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

    // 2. Try uploading to Firebase Storage if Admin SDK is configured
    if (admin.apps.length && process.env.FIREBASE_PROJECT_ID) {
      try {
        const bucket = admin.storage().bucket(`${process.env.FIREBASE_PROJECT_ID}.appspot.com`);
        const gcsFile = bucket.file(`uploads/${uniqueFilename}`);
        
        await gcsFile.save(buffer, {
          metadata: {
            contentType: file.type,
          },
        });

        // Far-future signed URL valid for next 75 years
        const [url] = await gcsFile.getSignedUrl({
          action: 'read',
          expires: '01-01-2100', 
        });

        return NextResponse.json({ url });
      } catch (storageError) {
        console.warn('[Upload] Firebase storage failed. Falling back to local disk storage. Error details:', storageError);
        // Fall through to local storage fallback
      }
    }

    // 3. Fallback: Save to Local Storage in public/uploads/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const origin = request.headers.get('origin') || new URL(request.url).origin;
    const localUrl = `${origin}/uploads/${uniqueFilename}`;
    return NextResponse.json({ url: localUrl });

  } catch (error) {
    console.error('[Upload] Root upload handler error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
