import { NextRequest, NextResponse } from 'next/server';
import { findLinkByShortCode } from '@/lib/data/links';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    const urlRecord = await findLinkByShortCode(shortCode);

    if (!urlRecord) {
      return NextResponse.json(
        { error: 'URL não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      originalUrl: urlRecord.originalUrl,
      shortCode: urlRecord.shortCode,
      clicks: urlRecord.clicks,
      createdAt: urlRecord.createdAt,
    });
  } catch (error) {
    console.error('Error getting URL stats:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
