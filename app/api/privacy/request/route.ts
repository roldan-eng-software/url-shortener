import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { assertSameOrigin } from '@/lib/auth';
import { isRateLimited } from '@/lib/rate-limit';
import { getZodErrorMessage, privacyRequestSchema } from '@/lib/validation';

const { privacyRequests } = schema;

export async function POST(request: NextRequest) {
  try {
    if (!assertSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }

    if (isRateLimited(request, 'privacy-request')) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Aguarde um minuto e tente novamente.' },
        { status: 429 }
      );
    }

    const parsed = privacyRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: getZodErrorMessage(parsed.error) }, { status: 400 });
    }

    const [privacyRequest] = await getDb().insert(privacyRequests).values(parsed.data).returning({
      id: privacyRequests.id,
      requestType: privacyRequests.requestType,
      email: privacyRequests.email,
    });

    return NextResponse.json({
      request: privacyRequest,
      message: 'Recebemos sua solicitação LGPD. Responderemos pelo email informado.',
    });
  } catch (error) {
    console.error('Error creating privacy request:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
