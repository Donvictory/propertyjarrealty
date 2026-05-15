import { NextRequest, NextResponse } from 'next/server';
import { updateProperty, deleteProperty, getPropertyById } from '@/lib/properties';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getSession } from '@/lib/session';

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
  const deleted = await deleteProperty(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    revalidatePath('/properties');
    revalidatePath('/admin');
    revalidatePath('/');
    revalidateTag('properties', 'max');
    return NextResponse.json({ success: true });
}
