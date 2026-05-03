import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';

const { bioLinks } = schema;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const link = await db.query.bioLinks.findFirst({
      where: eq(bioLinks.id, id),
    });

    if (!link || !link.isActive) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    await db
      .update(bioLinks)
      .set({ clicksTotal: sql`${bioLinks.clicksTotal} + 1` })
      .where(eq(bioLinks.id, link.id));

    return NextResponse.redirect(link.url);
  } catch (error) {
    console.error('Error redirecting bio link:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
