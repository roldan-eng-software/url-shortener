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
      return NextResponse.json(
        { error: 'Código curto inválido' },
        { status: 400 }
      );
    }

    const urlRecord = await db.query.urls.findFirst({
      where: eq(urls.shortCode, shortCode),
    });

    if (!urlRecord) {
      return NextResponse.json(
        { error: 'URL não encontrada' },
        { status: 404 }
      );
    }

    if (urlRecord.expiresAt && new Date(urlRecord.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'URL expirada' },
        { status: 410 }
      );
    }

    await db.update(urls)
      .set({ clicks: sql`${urls.clicks} + 1` })
      .where(eq(urls.id, urlRecord.id));

    return NextResponse.json({
      originalUrl: urlRecord.originalUrl,
      clicks: urlRecord.clicks + 1,
    });
  } catch (error) {
    console.error('Error getting URL:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
