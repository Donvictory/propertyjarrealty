import { NextRequest, NextResponse } from 'next/server';
import { getProperties, addProperty } from '@/lib/properties';
import { getSession } from '@/lib/session';

export async function GET() {
  const properties = getProperties();
  return NextResponse.json(properties);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, location, price, beds, baths, sqft, image, tag, type, description } = body;

    if (!title || !location || !price || !beds || !baths || !sqft || !image || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProperty = addProperty({
      title,
      location,
      price,
      beds: Number(beds),
      baths: Number(baths),
      sqft,
      image,
      tag: tag || null,
      type,
      description: description || '',
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
