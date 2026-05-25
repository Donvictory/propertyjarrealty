import { NextRequest, NextResponse } from 'next/server';
import { updateProperty, deleteProperty, getPropertyById } from '@/lib/properties';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getSession } from '@/lib/session';
import fs from 'fs';
import path from 'path';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(property);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await updateProperty(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    revalidatePath('/properties');
    revalidatePath('/admin');
    revalidatePath('/');
    revalidateTag('properties', 'max');
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Fetch property details to check for associated local files before deleting
  const property = await getPropertyById(id);

  const deleted = await deleteProperty(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  // Clean up associated local uploaded files (image and brochure) if they exist
  if (property) {
    const localUploadsDir = path.join(process.cwd(), 'public');

    // Check & delete image
    if (property.image && property.image.startsWith('/uploads/')) {
      const filePath = path.join(localUploadsDir, property.image);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`[Delete] Failed to delete local image file: ${filePath}`, err);
      }
    }

    // Check & delete brochure
    if (property.brochureUrl && property.brochureUrl.startsWith('/uploads/')) {
      const filePath = path.join(localUploadsDir, property.brochureUrl);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`[Delete] Failed to delete local brochure PDF: ${filePath}`, err);
      }
    }
  }

  revalidatePath('/properties');
  revalidatePath('/admin');
  revalidatePath('/');
  revalidateTag('properties', 'max');
  return NextResponse.json({ success: true });
}
