import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { generateShortCode, isValidShortCode, getBaseUrlFromRequest } from '@/lib/url';
import { generateQrCodeDataUrl } from '@/lib/qr';
import { assertSameOrigin, getAuthUserFromRequest } from '@/lib/auth';
import { createUserLinkSchema, getZodErrorMessage } from '@/lib/validation';
import { shortCodeExists } from '@/lib/data/links';

const { userLinks: userLinksTable } = schema;

function serializeUserLink(link: typeof userLinksTable.$inferSelect) {
  return {
    id: link.id,
    user_id: link.userId,
    original_url: link.originalUrl,
    short_code: link.shortCode,
    custom_alias: link.customAlias,
    clicks_total: link.clicksTotal,
    clicks_geo: link.clicksGeo,
    clicks_device: link.clicksDevice,
    clicks_referrers: link.clicksReferrers,
    qr_code: link.qrCode,
    is_premium: link.isPremium,
    created_at: link.createdAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10', 10) || 10, 1), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10) || 0, 0);

    if (!authUser) {
      return NextResponse.json({ links: [] });
    }

    const db = getDb();
    const links = await db.query.userLinks.findMany({
      where: eq(userLinksTable.userId, authUser.id),
      orderBy: [desc(userLinksTable.createdAt)],
      limit,
      offset,
    });

    return NextResponse.json({ links: links.map(serializeUserLink) });
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
    if (!assertSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }

    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!authUser.isPremium) {
      return NextResponse.json({ error: 'Dashboard é exclusivo para usuários Premium' }, { status: 403 });
    }

    const db = getDb();
    const parsed = createUserLinkSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: getZodErrorMessage(parsed.error) }, { status: 400 });
    }
    const { originalUrl, customAlias } = parsed.data;

    let shortCode: string;

    if (customAlias) {
      const validation = isValidShortCode(customAlias);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      if (await shortCodeExists(customAlias)) {
        return NextResponse.json({ error: 'Este alias já está em uso. Escolha outro.' }, { status: 409 });
      }

      shortCode = customAlias;
    } else {
      let attempts = 0;
      const maxAttempts = 5;

      do {
        shortCode = generateShortCode();
        if (!(await shortCodeExists(shortCode))) break;
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
      userId: authUser.id,
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
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
