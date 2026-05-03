import { NextRequest, NextResponse } from 'next/server';
import { and, asc, eq, ne } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { assertSameOrigin, getAuthUserFromRequest } from '@/lib/auth';
import { upsertBioPageSchema, getZodErrorMessage } from '@/lib/validation';

const { bioPages, bioLinks } = schema;

function serializeBioPage(page: typeof bioPages.$inferSelect, links: Array<typeof bioLinks.$inferSelect>) {
  return {
    id: page.id,
    handle: page.handle,
    title: page.title,
    description: page.description,
    viewsTotal: page.viewsTotal,
    isActive: page.isActive,
    publicUrl: `/@${page.handle}`,
    links: links.map((link) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      position: link.position,
      clicksTotal: link.clicksTotal,
      isActive: link.isActive,
    })),
  };
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json({ bioPage: null }, { status: 401 });
    }

    const db = getDb();
    const page = await db.query.bioPages.findFirst({
      where: eq(bioPages.userId, authUser.id),
    });

    if (!page) {
      return NextResponse.json({ bioPage: null });
    }

    const links = await db.query.bioLinks.findMany({
      where: eq(bioLinks.bioPageId, page.id),
      orderBy: [asc(bioLinks.position), asc(bioLinks.createdAt)],
    });

    return NextResponse.json({ bioPage: serializeBioPage(page, links) });
  } catch (error) {
    console.error('Error fetching bio page:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!assertSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }

    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!authUser.isPremium) {
      return NextResponse.json({ error: 'Link na bio é exclusivo para usuários Premium' }, { status: 403 });
    }

    const parsed = upsertBioPageSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: getZodErrorMessage(parsed.error) }, { status: 400 });
    }

    const { handle, title, description, isActive, links } = parsed.data;
    const db = getDb();
    const currentPage = await db.query.bioPages.findFirst({
      where: eq(bioPages.userId, authUser.id),
    });

    const handleOwner = await db.query.bioPages.findFirst({
      where: currentPage
        ? and(eq(bioPages.handle, handle), ne(bioPages.id, currentPage.id))
        : eq(bioPages.handle, handle),
    });

    if (handleOwner) {
      return NextResponse.json({ error: 'Este @ já está em uso. Escolha outro.' }, { status: 409 });
    }

    const normalizedLinks = links.map((link, index) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      position: index,
      isActive: link.isActive,
    }));

    let page = currentPage;

    if (page) {
      const [updatedPage] = await db
        .update(bioPages)
        .set({
          handle,
          title,
          description,
          isActive,
          updatedAt: new Date(),
        })
        .where(eq(bioPages.id, page.id))
        .returning();

      page = updatedPage;
    } else {
      const [createdPage] = await db
        .insert(bioPages)
        .values({
          userId: authUser.id,
          handle,
          title,
          description,
          isActive,
        })
        .returning();

      page = createdPage;
    }

    const existingLinks = await db.query.bioLinks.findMany({
      where: eq(bioLinks.bioPageId, page.id),
    });
    const existingIds = new Set(existingLinks.map((link) => link.id));
    const keptIds = new Set(normalizedLinks.map((link) => link.id).filter(Boolean));

    await Promise.all(
      existingLinks
        .filter((link) => !keptIds.has(link.id))
        .map((link) => db.delete(bioLinks).where(eq(bioLinks.id, link.id)))
    );

    for (const link of normalizedLinks) {
      if (link.id && existingIds.has(link.id)) {
        await db
          .update(bioLinks)
          .set({
            title: link.title,
            url: link.url,
            position: link.position,
            isActive: link.isActive,
            updatedAt: new Date(),
          })
          .where(eq(bioLinks.id, link.id));
      } else {
        await db.insert(bioLinks).values({
          bioPageId: page.id,
          title: link.title,
          url: link.url,
          position: link.position,
          isActive: link.isActive,
        });
      }
    }

    const savedLinks = await db.query.bioLinks.findMany({
      where: eq(bioLinks.bioPageId, page.id),
      orderBy: [asc(bioLinks.position), asc(bioLinks.createdAt)],
    });

    return NextResponse.json({ bioPage: serializeBioPage(page, savedLinks) });
  } catch (error) {
    console.error('Error saving bio page:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
