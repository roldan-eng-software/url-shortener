import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { authSchema, getZodErrorMessage } from '@/lib/validation';
import { assertSameOrigin, hashPassword, needsPasswordRehash, setAuthCookie, verifyPassword } from '@/lib/auth';
import { isRateLimited } from '@/lib/rate-limit';

const { users: usersTable } = schema;

export async function POST(request: NextRequest) {
  try {
    if (!assertSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }

    if (isRateLimited(request, 'login')) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Aguarde um minuto e tente novamente.' },
        { status: 429 }
      );
    }

    const db = getDb();
    const parsed = authSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: getZodErrorMessage(parsed.error) },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;

    const user = await db.query.users.findFirst({
      where: eq(usersTable.email, email),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    if (needsPasswordRehash(user.passwordHash)) {
      await db.update(usersTable)
        .set({ passwordHash: await hashPassword(password), updatedAt: new Date() })
        .where(eq(usersTable.id, user.id));
    }

    const isPremium = user.isPremium && 
      (!user.premiumExpiresAt || new Date(user.premiumExpiresAt) > new Date());

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        isPremium: isPremium,
      },
    });

    setAuthCookie(response, user.id);

    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
