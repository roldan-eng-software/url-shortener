import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq, desc, and } from 'drizzle-orm';
import { userLinks } from '@/lib/db/schema';
import { generateShortCode, isValidUrl, isValidShortCode, getBaseUrlFromRequest } from '@/lib/url';
import { generateQrCodeDataUrl } from '@/lib/qr';

const { userLinks: userLinksTable } = schema;

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json({ links: [] });
    }

    const db = getDb();
    const links = await db.query.userLinks.findMany({
      where: eq(userLinksTable.userId, userId),
      orderBy: [desc(userLinksTable.createdAt)],
      limit,
      offset,
    });

    return NextResponse.json({ links });
  } catch (error) {
    console.error('Error fetching user links:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const body = await request.json();
    const { originalUrl, customAlias } = body;

    if (!originalUrl) {
      return NextResponse.json({ error: 'URL original é obrigatória' }, { status: 400 });
    }

    if (typeof originalUrl !== 'string' || originalUrl.length > 2048) {
      return NextResponse.json({ error: 'URL inválida ou muito longa' }, { status: 400 });
    }

    if (!isValidUrl(originalUrl)) {
      return NextResponse.json({ error: 'URL inválida. URLs locais não são permitidas.' }, { status: 400 });
    }

    let shortCode: string;

    if (customAlias && customAlias.trim()) {
      const validation = isValidShortCode(customAlias.trim());
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const normalizedAlias = customAlias.trim().toLowerCase();
      
      const aliasExists = await db.query.userLinks.findFirst({
        where: eq(userLinksTable.customAlias, normalizedAlias),
      });

      if (aliasExists) {
        return NextResponse.json({ error: 'Este alias já está em uso. Escolha outro.' }, { status: 409 });
      }

      shortCode = normalizedAlias;
    } else {
      let attempts = 0;
      const maxAttempts = 5;

      do {
        shortCode = generateShortCode();
        const existing = await db.query.userLinks.findFirst({
          where: eq(userLinksTable.shortCode, shortCode),
        });
        
        if (!existing) break;
        attempts++;
      } while (attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        return NextResponse.json({ error: 'Erro ao gerar código. Tente novamente.' }, { status: 500 });
      }
    }

    const baseUrl = getBaseUrlFromRequest(request);
    const shortUrl = `${baseUrl}/${shortCode}`;
    const qrCode = await generateQrCodeDataUrl(shortUrl);

    const [link] = await db.insert(userLinksTable).values({
      userId,
      originalUrl,
      shortCode,
      customAlias: customAlias?.trim() || null,
      qrCode,
      isPremium: true,
    }).returning();

    return NextResponse.json({
      id: link.id,
      shortCode: link.shortCode,
      shortUrl: `${baseUrl}/${link.shortCode}`,
      originalUrl: link.originalUrl,
      customAlias: link.customAlias,
    });
  } catch (error) {
    console.error('Error creating user link:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
