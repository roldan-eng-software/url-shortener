import { NextResponse } from 'next/server';
import { and, asc, eq, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { bioHandleSchema } from '@/lib/validation';

const { bioPages, bioLinks } = schema;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle: rawHandle } = await params;
    const parsedHandle = bioHandleSchema.safeParse(rawHandle.replace(/^@/, ''));

    if (!parsedHandle.success) {
      return NextResponse.json({ error: 'Página não encontrada' }, { status: 404 });
    }

    const db = getDb();
    const page = await db.query.bioPages.findFirst({
      where: and(eq(bioPages.handle, parsedHandle.data), eq(bioPages.isActive, true)),
    });

    if (!page) {
      return NextResponse.json({ error: 'Página não encontrada' }, { status: 404 });
    }

    await db
      .update(bioPages)
      .set({ viewsTotal: sql`${bioPages.viewsTotal} + 1` })
      .where(eq(bioPages.id, page.id));

    const links = await db.query.bioLinks.findMany({
      where: and(eq(bioLinks.bioPageId, page.id), eq(bioLinks.isActive, true)),
      orderBy: [asc(bioLinks.position), asc(bioLinks.createdAt)],
    });

    return NextResponse.json({
      bioPage: {
        handle: page.handle,
        title: page.title,
        description: page.description,
        viewsTotal: page.viewsTotal + 1,
        publicUrl: new URL(`/@${page.handle}`, request.url).toString(),
        links: links.map((link) => ({
          id: link.id,
          title: link.title,
          url: `/api/bio/links/${link.id}/go`,
          clicksTotal: link.clicksTotal,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching public bio page:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
