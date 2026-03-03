import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { users } from '@/lib/db/schema';

const { users: usersTable } = schema;

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ isPremium: false, userId: null });
    }

    const db = getDb();
    const user = await db.query.users.findFirst({
      where: eq(usersTable.id, userId),
    });

    if (!user) {
      return NextResponse.json({ isPremium: false, userId: null });
    }

    const isPremium = user.isPremium && 
      (!user.premiumExpiresAt || new Date(user.premiumExpiresAt) > new Date());

    return NextResponse.json({
      isPremium,
      userId: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error('Error checking premium:', error);
    return NextResponse.json({ isPremium: false, userId: null });
  }
}
