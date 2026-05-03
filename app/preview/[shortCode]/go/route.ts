import { NextResponse } from 'next/server';
import { incrementLinkClicks } from '@/lib/data/links';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    if (!shortCode || shortCode.length > 10) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const link = await incrementLinkClicks(shortCode);

    if (!link || (link.expiresAt && new Date(link.expiresAt) < new Date())) {
      return NextResponse.redirect(new URL(`/preview/${shortCode}`, request.url));
    }

    return NextResponse.redirect(link.originalUrl);
  } catch (error) {
    console.error('Error redirecting preview click:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
