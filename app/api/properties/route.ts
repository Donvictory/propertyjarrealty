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
  beds:        z.coerce.number().int().nonnegative(),
  baths:       z.coerce.number().int().nonnegative(),
  sqft:        z.string().min(1, 'sqft is required'),
  image:       z.string().url('Image must be a valid URL'),
  type:        z.string().min(1, 'Type is required'),
  tag:         z.string().nullable().optional(),
  description: z.string().optional().default(''),
  isCampaign:  z.boolean().optional().default(false),
  brochureUrl: z.string().optional().default(''),
});

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { allowed } = rateLimit(ip, 60, 60_000); // 60 requests / minute
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
    const newProperty = await addProperty({
      title:       data.title,
      location:    data.location,
      price:       data.price,
      beds:        data.beds,
      baths:       data.baths,
      sqft:        data.sqft,
      image:       data.image,
      tag:         data.tag ?? null,
      type:        data.type,
      description: data.description,
      isCampaign:  data.isCampaign,
      brochureUrl: data.brochureUrl,
    });

    revalidatePath('/properties');
    revalidatePath('/admin');
    revalidatePath('/');
    revalidateTag('properties', 'max');

    return NextResponse.json(newProperty, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
