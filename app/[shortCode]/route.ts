import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';

const { urls } = schema;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const db = getDb();
    const { shortCode } = await params;

    if (!shortCode || shortCode.length > 10) {
      return NextResponse.redirect(new URL('/', request.url), 301);
    }

    const urlRecord = await db.query.urls.findFirst({
      where: eq(urls.shortCode, shortCode),
    });

    if (!urlRecord) {
      return NextResponse.redirect(new URL('/', request.url), 301);
    }

    if (urlRecord.expiresAt && new Date(urlRecord.expiresAt) < new Date()) {
      return NextResponse.redirect(new URL('/', request.url), 301);
    }

    await db.update(urls)
      .set({ clicks: sql`${urls.clicks} + 1` })
      .where(eq(urls.id, urlRecord.id));

    return NextResponse.redirect(urlRecord.originalUrl, 301);
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.redirect(new URL('/', request.url), 301);
  }
}
