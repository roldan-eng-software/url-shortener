import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { authSchema, getZodErrorMessage } from '@/lib/validation';
import { assertSameOrigin, setAuthCookie } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { isRateLimited } from '@/lib/rate-limit';
import { recordFunnelStep } from '@/lib/analytics/funnel';

const { users: usersTable } = schema;

function readStringField(body: unknown, field: string): string | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const value = (body as Record<string, unknown>)[field];
  return typeof value === 'string' && value.trim() ? value : null;
}

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

    const rawBody = await request.json();
    const parsed = authSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: getZodErrorMessage(parsed.error) }, { status: 400 });
    }

    const visitorId = readStringField(rawBody, 'visitorId');
    const source = readStringField(rawBody, 'source');

    const { email, password } = parsed.data;
    const db = getDb();

    const existingUser = await db.query.users.findFirst({
      where: eq(usersTable.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Usuário já existe' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const [newUser] = await db
      .insert(usersTable)
      .values({
        email,
        passwordHash,
      })
      .returning({
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

    // Funil anônimo -> Premium: conta criada (FR-005). Fire-and-forget: nunca
    // lança erro nem bloqueia a resposta de cadastro (FR-008).
    await recordFunnelStep({
      step: 'account_created',
      source,
      visitorId,
      userId: newUser.id,
    });

    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
