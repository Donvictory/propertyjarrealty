import { NextRequest, NextResponse } from 'next/server';
import { getCampaignContent, updateCampaignContent } from '@/lib/campaign';
import { getSession } from '@/lib/session';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const InvestmentOptionSchema = z.object({
  title:  z.string().min(1),
  points: z.array(z.string()),
});

const OfferStackSchema = z.object({
  title:  z.string().min(1),
  points: z.array(z.string()),
  color:  z.string().optional(),
});

const CampaignContentSchema = z.object({
  whyInvestTitle:     z.string().min(1).optional(),
  whyInvestSubtitle:  z.string().optional(),
  whyInvestPoints:    z.array(z.string()).optional(),
  projectedRoi:       z.string().optional(),
  roiSubtext:         z.string().optional(),
  investmentOptions:  z.array(InvestmentOptionSchema).optional(),
  offerStack:         z.array(OfferStackSchema).optional(),
}).strict(); // rejects unknown keys — prevents arbitrary field injection into Firestore

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { allowed } = rateLimit(ip, 60, 60_000); // 60 requests / minute
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const content = await getCampaignContent();
  return NextResponse.json(content);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = CampaignContentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const success = await updateCampaignContent(parsed.data);
    if (success) {
      return NextResponse.json({ message: 'Content updated successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
