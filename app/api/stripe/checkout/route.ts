import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { assertSameOrigin, getAuthUserFromRequest } from '@/lib/auth';

const { users: usersTable } = schema;

// Lazy initialization - só cria o cliente quando necessário
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY não configurada');
    }
    stripeClient = new Stripe(apiKey, {
      apiVersion: '2025-02-24.acacia',
    });
  }
  return stripeClient;
}

const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly';

function getAppUrl(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }

  const url = new URL(request.url);
  const protocol = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;

  return `${protocol}://${host}`;
}

export async function POST(request: NextRequest) {
  try {
    if (!assertSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }

    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const db = getDb();
    const user = await db.query.users.findFirst({
      where: eq(usersTable.id, authUser.id),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    if (user.isPremium && user.premiumExpiresAt && new Date(user.premiumExpiresAt) > new Date()) {
      return NextResponse.json(
        { error: 'Você já é premium' },
        { status: 400 }
      );
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;

      await db.update(usersTable)
        .set({ stripeCustomerId: customerId })
        .where(eq(usersTable.id, authUser.id));
    }

    const appUrl = getAppUrl(request);
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PREMIUM_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/premium?canceled=true`,
      metadata: {
        userId: user.id,
      },
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
