import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { assertSameOrigin } from '@/lib/auth';
import { isRateLimited } from '@/lib/rate-limit';
import { getZodErrorMessage, marketingLeadSchema } from '@/lib/validation';

const { marketingLeads } = schema;

export async function POST(request: NextRequest) {
  try {
    if (!assertSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }

    if (isRateLimited(request, 'marketing-lead')) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Aguarde um minuto e tente novamente.' },
        { status: 429 }
      );
    }

    const parsed = marketingLeadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: getZodErrorMessage(parsed.error) },
        { status: 400 }
      );
    }

    const [lead] = await getDb()
      .insert(marketingLeads)
      .values(parsed.data)
      .returning({
        id: marketingLeads.id,
        email: marketingLeads.email,
      });

    return NextResponse.json({
      lead,
      message: 'Recebemos seus dados. Vamos chamar você com um plano de links para sua campanha.',
    });
  } catch (error) {
    console.error('Error creating marketing lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
