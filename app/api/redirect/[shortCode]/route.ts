import { NextRequest, NextResponse } from 'next/server';
import { incrementLinkClicks } from '@/lib/data/links';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    if (!shortCode || shortCode.length > 10) {
      return NextResponse.json({ error: 'Invalid short code' }, { status: 400 });
    }

    const urlRecord = await incrementLinkClicks(shortCode);

    if (!urlRecord) {
      return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }

    if (urlRecord.expiresAt && new Date(urlRecord.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'URL expired' }, { status: 410 });
    }

    return NextResponse.json({ 
      success: true, 
      originalUrl: urlRecord.originalUrl 
    });
  } catch (error) {
    console.error('Error recording click:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
