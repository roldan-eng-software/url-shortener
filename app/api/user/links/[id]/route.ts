import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';

const { userLinks: userLinksTable } = schema;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = getDb();
    const { id } = await params;
    const body = await request.json();
    const { originalUrl, customAlias } = body;

    const existingLink = await db.query.userLinks.findFirst({
      where: eq(userLinksTable.id, id),
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      );
    }

    if (existingLink.userId !== userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    if (customAlias && customAlias.trim()) {
      const normalizedAlias = customAlias.trim().toLowerCase();
      
      const aliasExists = await db.query.userLinks.findFirst({
        where: eq(userLinksTable.customAlias, normalizedAlias),
      });

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
        ...(customAlias !== undefined && { customAlias: customAlias?.trim() || null }),
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
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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

    if (existingLink.userId !== userId) {
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
