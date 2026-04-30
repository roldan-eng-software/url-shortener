import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { generateShortCode, isValidShortCode, getBaseUrlFromRequest } from '@/lib/url';
import { createUrlSchema, getZodErrorMessage } from '@/lib/validation';
import { getAuthUserFromRequest } from '@/lib/auth';
import { generateQrCodeDataUrl } from '@/lib/qr';
import { shortCodeExists } from '@/lib/data/links';

const { urls, userLinks } = schema;

export async function POST(request: NextRequest) {
  try {
    const parsed = createUrlSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: getZodErrorMessage(parsed.error) },
        { status: 400 }
      );
    }
    const { originalUrl, customCode } = parsed.data;
    const authUser = await getAuthUserFromRequest(request);

    let shortCode: string;

    if (customCode) {
      if (!authUser?.isPremium) {
        return NextResponse.json(
          { error: 'Código personalizado é exclusivo para usuários Premium.' },
          { status: 403 }
        );
      }

      const validation = isValidShortCode(customCode);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      if (await shortCodeExists(customCode)) {
        return NextResponse.json(
          { error: 'Este código já está em uso. Escolha outro.' },
          { status: 409 }
        );
      }

      shortCode = customCode;
    } else {
      let attempts = 0;
      const maxAttempts = 5;

      do {
        shortCode = generateShortCode();
        if (!(await shortCodeExists(shortCode))) break;
        attempts++;
      } while (attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        return NextResponse.json(
          { error: 'Erro ao gerar código. Tente novamente.' },
          { status: 500 }
        );
      }
    }

    const shortUrl = `${getBaseUrlFromRequest(request)}/${shortCode}`;
    const isPremiumLink = Boolean(authUser?.isPremium);
    const db = getDb();

    if (isPremiumLink && authUser) {
      const [link] = await db.insert(userLinks).values({
        userId: authUser.id,
        originalUrl,
        shortCode,
        customAlias: customCode || null,
        qrCode: await generateQrCodeDataUrl(shortUrl),
        isPremium: true,
      }).returning();

      return NextResponse.json({
        id: link.id,
        shortCode: link.shortCode,
        shortUrl,
        originalUrl: link.originalUrl,
        createdAt: link.createdAt,
      });
    }

    const [urlRecord] = await db.insert(urls).values({
      originalUrl,
      shortCode,
    }).returning();

    return NextResponse.json({
      shortCode: urlRecord.shortCode,
      shortUrl,
      originalUrl: urlRecord.originalUrl,
      createdAt: urlRecord.createdAt,
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
