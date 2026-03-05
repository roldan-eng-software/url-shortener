import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';

const { userLinks: userLinksTable } = schema;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = getDb();
    const { id } = await params;

    const link = await db.query.userLinks.findFirst({
      where: eq(userLinksTable.id, id),
    });

    if (!link) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      );
    }

    if (link.userId !== userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const geoData = link.clicksGeo as Record<string, number> || {};
    const deviceData = link.clicksDevice as Record<string, number> || {};
    const referrerData = link.clicksReferrers as Record<string, number> || {};

    const topCountries = Object.entries(geoData)
      .map(([country, clicks]) => ({ country, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    const topDevices = Object.entries(deviceData)
      .map(([device, clicks]) => ({ device, clicks }))
      .sort((a, b) => b.clicks - a.clicks);

    const topReferrers = Object.entries(referrerData)
      .map(([referrer, clicks]) => ({ referrer, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    return NextResponse.json({
      stats: {
        totalClicks: link.clicksTotal,
        createdAt: link.createdAt,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        customAlias: link.customAlias,
        qrCode: link.qrCode,
        topCountries,
        topDevices,
        topReferrers,
      },
    });
  } catch (error) {
    console.error('Error fetching link stats:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
