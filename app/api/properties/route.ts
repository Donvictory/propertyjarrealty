import { NextRequest, NextResponse } from 'next/server';
import { getProperties, addProperty } from '@/lib/properties';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getSession } from '@/lib/session';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const PropertySchema = z.object({
  title:       z.string().min(1, 'Title is required'),
  location:    z.string().min(1, 'Location is required'),
  price:       z.string().min(1, 'Price is required'),
  beds:        z.coerce.number().int().nonnegative().nullable().optional(),
  baths:       z.coerce.number().int().nonnegative().nullable().optional(),
  sqft:        z.string().nullable().optional(),
  image:       z.string().min(1, 'Image is required'),
  type:        z.string().min(1, 'Type is required'),
  tag:         z.string().nullable().optional(),
  description: z.string().optional().default(''),
  isCampaign:  z.boolean().optional().default(false),
  brochureUrl: z.string().optional().default(''),
  pricingOptions: z.array(z.object({
    size: z.string(),
    price: z.string()
  })).optional().default([]),
});

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { allowed } = rateLimit(ip, 60, 60_000); 
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const isCampaignOnly = searchParams.get('campaign') === 'true';

  let properties = await getProperties();
  
  if (isCampaignOnly) {
    properties = properties.filter(p => p.isCampaign === true);
  }

  return NextResponse.json(properties);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = PropertySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Build the property payload dynamically to prevent Firestore from receiving unsupported 'undefined' values
    const propertyData: any = {
      title:       data.title,
      location:    data.location,
      price:       data.price,
      image:       data.image,
      tag:         data.tag ?? null,
      type:        data.type,
      description: data.description,
      isCampaign:  data.isCampaign,
      brochureUrl: data.brochureUrl,
      pricingOptions: data.pricingOptions,
    };

    if (data.beds !== undefined && data.beds !== null) {
      propertyData.beds = data.beds;
    }
    if (data.baths !== undefined && data.baths !== null) {
      propertyData.baths = data.baths;
    }
    if (data.sqft !== undefined && data.sqft !== null) {
      propertyData.sqft = data.sqft;
    }

    const newProperty = await addProperty(propertyData);

    revalidatePath('/properties');
    revalidatePath('/admin');
    revalidatePath('/');
    revalidateTag('properties', 'max');

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('[Properties POST] Failed to add property:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
