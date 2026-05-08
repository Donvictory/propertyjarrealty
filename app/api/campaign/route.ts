import { NextRequest, NextResponse } from 'next/server';
import { getCampaignContent, updateCampaignContent } from '@/lib/campaign';
import { getSession } from '@/lib/session';

export async function GET() {
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
    const success = await updateCampaignContent(body);
    if (success) {
      return NextResponse.json({ message: 'Content updated successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
