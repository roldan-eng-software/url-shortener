import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { generateShortCode, isValidUrl, isValidShortCode, getBaseUrlFromRequest } from '@/lib/url';
import { eq } from 'drizzle-orm';

const { urls } = schema;

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { originalUrl, customCode } = body;

    if (!originalUrl) {
      return NextResponse.json(
        { error: 'URL original é obrigatória' },
        { status: 400 }
      );
    }

    if (typeof originalUrl !== 'string' || originalUrl.length > 2048) {
      return NextResponse.json(
        { error: 'URL inválida ou muito longa (máximo 2048 caracteres)' },
        { status: 400 }
      );
    }

    if (!isValidUrl(originalUrl)) {
      return NextResponse.json(
        { error: 'URL inválida. URLs locais (localhost) e IPs privados não são permitidos.' },
        { status: 400 }
      );
    }

    let shortCode: string;

    if (customCode && customCode.trim()) {
      const validation = isValidShortCode(customCode.trim());
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      const normalizedCode = customCode.trim().toLowerCase();
      
      const existingCustom = await db.query.urls.findFirst({
        where: eq(urls.shortCode, normalizedCode),
      });

      if (existingCustom) {
        return NextResponse.json(
          { error: 'Este código já está em uso. Escolha outro.' },
          { status: 409 }
        );
      }

      shortCode = normalizedCode;
    } else {
      let attempts = 0;
      const maxAttempts = 5;

      do {
        shortCode = generateShortCode();
        const existing = await db.query.urls.findFirst({
          where: eq(urls.shortCode, shortCode),
        });
        
        if (!existing) break;
        attempts++;
      } while (attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        return NextResponse.json(
          { error: 'Erro ao gerar código. Tente novamente.' },
          { status: 500 }
        );
      }
    }

    const [urlRecord] = await db.insert(urls).values({
      originalUrl,
      shortCode,
    }).returning();

    const shortUrl = `${getBaseUrlFromRequest(request)}/${shortCode}`;

    return NextResponse.json({
      shortCode: urlRecord.shortCode,
      shortUrl,
      originalUrl: urlRecord.originalUrl,
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
