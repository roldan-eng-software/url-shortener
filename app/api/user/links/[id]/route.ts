import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { assertSameOrigin, getAuthUserFromRequest } from '@/lib/auth';
import { getZodErrorMessage, updateUserLinkSchema } from '@/lib/validation';
import { findLinkByShortCode } from '@/lib/data/links';

const { userLinks: userLinksTable } = schema;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!assertSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }

    const authUser = await getAuthUserFromRequest(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!authUser.isPremium) {
      return NextResponse.json({ error: 'Recurso exclusivo para usuários Premium' }, { status: 403 });
    }

    const db = getDb();
    const { id } = await params;
    const parsed = updateUserLinkSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: getZodErrorMessage(parsed.error) },
        { status: 400 }
      );
    }

    const { originalUrl, customAlias } = parsed.data;

    const existingLink = await db.query.userLinks.findFirst({
      where: eq(userLinksTable.id, id),
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      );
    }

    if (existingLink.userId !== authUser.id) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    if (customAlias) {
      const aliasExists = await findLinkByShortCode(customAlias);

      if (aliasExists && aliasExists.id !== id) {
        return NextResponse.json(
          { error: 'Este alias já está em uso. Escolha outro.' },
          { status: 409 }
        );
      }
    }

    const [updatedLink] = await db.update(userLinksTable)
      .set({
        ...(originalUrl && { originalUrl }),
        ...(customAlias !== undefined && { customAlias }),
        ...(customAlias && { shortCode: customAlias }),
      })
      .where(eq(userLinksTable.id, id))
      .returning();

    return NextResponse.json({
      link: {
        id: updatedLink.id,
        originalUrl: updatedLink.originalUrl,
        shortCode: updatedLink.shortCode,
        customAlias: updatedLink.customAlias,
        clicksTotal: updatedLink.clicksTotal,
        createdAt: updatedLink.createdAt,
      },
    });
  } catch (error) {
    console.error('Error updating link:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!assertSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }

    const authUser = await getAuthUserFromRequest(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!authUser.isPremium) {
      return NextResponse.json({ error: 'Recurso exclusivo para usuários Premium' }, { status: 403 });
    }

    const db = getDb();
    const { id } = await params;

    const existingLink = await db.query.userLinks.findFirst({
      where: eq(userLinksTable.id, id),
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      );
    }

    if (existingLink.userId !== authUser.id) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    await db.delete(userLinksTable)
      .where(eq(userLinksTable.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
