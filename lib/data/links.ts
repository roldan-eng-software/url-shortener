import { and, eq, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';

const { urls, userLinks } = schema;

export async function findLinkByShortCode(shortCode: string) {
  const db = getDb();

  const urlRecord = await db.query.urls.findFirst({
    where: eq(urls.shortCode, shortCode),
  });

  if (urlRecord) {
    return {
      type: 'anonymous' as const,
      id: urlRecord.id,
      originalUrl: urlRecord.originalUrl,
      shortCode: urlRecord.shortCode,
      clicks: urlRecord.clicks,
      expiresAt: urlRecord.expiresAt,
      createdAt: urlRecord.createdAt,
    };
  }

  const userLink = await db.query.userLinks.findFirst({
    where: eq(userLinks.shortCode, shortCode),
  });

  if (!userLink) {
    return null;
  }

  return {
    type: 'user' as const,
    id: userLink.id,
    originalUrl: userLink.originalUrl,
    shortCode: userLink.shortCode,
    clicks: userLink.clicksTotal || 0,
    expiresAt: null,
    createdAt: userLink.createdAt,
  };
}

export async function shortCodeExists(shortCode: string) {
  const link = await findLinkByShortCode(shortCode);
  return Boolean(link);
}

export async function incrementLinkClicks(shortCode: string) {
  const db = getDb();
  const link = await findLinkByShortCode(shortCode);

  if (!link) {
    return null;
  }

  if (link.type === 'anonymous') {
    await db.update(urls)
      .set({ clicks: sql`${urls.clicks} + 1` })
      .where(eq(urls.id, link.id));
  } else {
    await db.update(userLinks)
      .set({ clicksTotal: sql`${userLinks.clicksTotal} + 1` })
      .where(eq(userLinks.id, link.id));
  }

  return { ...link, clicks: link.clicks + 1 };
}

export async function findUserLinkByShortCodeForOwner(shortCode: string, userId: string) {
  const db = getDb();

  return db.query.userLinks.findFirst({
    where: and(eq(userLinks.shortCode, shortCode), eq(userLinks.userId, userId)),
  });
}
