import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { userLinks } from '@/lib/db/schema';

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
