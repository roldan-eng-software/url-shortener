import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { authSchema, getZodErrorMessage } from '@/lib/validation';
import { assertSameOrigin, setAuthCookie } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { isRateLimited } from '@/lib/rate-limit';

const { users: usersTable } = schema;

export async function POST(request: NextRequest) {
  try {
    if (!assertSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }

    if (isRateLimited(request, 'register')) {
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

    const existingUser = await db.query.users.findFirst({
      where: eq(usersTable.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já existe' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const [newUser] = await db.insert(usersTable).values({
      email,
      passwordHash,
    }).returning({
      id: usersTable.id,
      email: usersTable.email,
      isPremium: usersTable.isPremium,
    });

    const response = NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        isPremium: newUser.isPremium,
      },
    });

    setAuthCookie(response, newUser.id);

    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
