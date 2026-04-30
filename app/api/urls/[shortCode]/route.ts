import { NextRequest, NextResponse } from 'next/server';
import { incrementLinkClicks } from '@/lib/data/links';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    if (!shortCode || shortCode.length > 10) {
      return NextResponse.json(
        { error: 'Código curto inválido' },
        { status: 400 }
      );
    }

    const urlRecord = await incrementLinkClicks(shortCode);

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

    return NextResponse.json({
      originalUrl: urlRecord.originalUrl,
      clicks: urlRecord.clicks,
    });
  } catch (error) {
    console.error('Error getting URL:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
