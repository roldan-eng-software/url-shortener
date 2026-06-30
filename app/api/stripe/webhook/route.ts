import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const { users: usersTable, processedEvents: processedEventsTable } = schema;

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

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

async function isEventProcessed(db: ReturnType<typeof getDb>, eventId: string): Promise<boolean> {
  try {
    const existing = await db.query.processedEvents.findFirst({
      where: eq(processedEventsTable.id, eventId),
    });
    return !!existing;
  } catch {
    // Tabela processed_events pode não existir ainda
    return false;
  }
}

async function markEventProcessed(db: ReturnType<typeof getDb>, eventId: string): Promise<void> {
  try {
    await db.insert(processedEventsTable).values({ id: eventId });
  } catch {
    // Tabela processed_events pode não existir ainda - ignora
  }
}

export async function POST(request: NextRequest) {
  try {
    // Sem WEBHOOK_SECRET configurado: apenas aceitar e retornar 200
    // (permite que o Stripe valide a URL, mas não verifica assinatura)
    if (!WEBHOOK_SECRET) {
      console.warn('[Stripe] STRIPE_WEBHOOK_SECRET não configurada - aceitando sem verificação');
      const body = await request.text();
      let event: Stripe.Event;
      try {
        event = JSON.parse(body) as Stripe.Event;
      } catch {
        return NextResponse.json({ received: true });
      }
      return await handleEvent(event);
    }

    // Verificar assinatura
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Assinatura ausente' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = getStripe().webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    } catch (err) {
      console.error('[Stripe] Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 400 }
      );
    }

    return await handleEvent(event);
  } catch (error) {
    console.error('[Stripe] Webhook error:', error);
    return NextResponse.json(
      { error: 'Erro no webhook' },
      { status: 500 }
    );
  }
}

async function handleEvent(event: Stripe.Event) {
  const db = getDb();

  // Idempotência: verificar se evento já foi processado
  if (await isEventProcessed(db, event.id)) {
    console.log(`[Stripe] Evento ${event.id} já processado, ignorando`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Processar evento
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const customerId = session.customer as string;

      if (userId && customerId) {
        // Validar que metadata.userId confere com customer.metadata.userId
        try {
          const customer = await getStripe().customers.retrieve(customerId);

          if (customer.deleted) {
            console.error(`[Stripe] Customer ${customerId} foi deletado`);
            break;
          }

          const customerUserId = customer.metadata?.userId;

          if (customerUserId !== userId) {
            console.error(`[Stripe] userId mismatch: session.metadata.userId=${userId}, customer.metadata.userId=${customerUserId}`);
            break;
          }
        } catch (err) {
          console.error(`[Stripe] Erro ao buscar customer ${customerId}:`, err);
          break;
        }

        const subscription = await getStripe().subscriptions.retrieve(
          session.subscription as string
        );

        const trialEnd = subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await db.update(usersTable)
          .set({
            isPremium: true,
            stripeSubscriptionId: subscription.id,
            premiumExpiresAt: trialEnd,
          })
          .where(eq(usersTable.id, userId));

        console.log(`[Stripe] Premium ativado para user ${userId}, subscription ${subscription.id}`);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        const isActive = subscription.status === 'active' || subscription.status === 'trialing';
        const premiumExpiresAt = new Date(subscription.current_period_end * 1000);

        await db.update(usersTable)
          .set({
            isPremium: isActive,
            premiumExpiresAt,
          })
          .where(eq(usersTable.id, userId));

        console.log(`[Stripe] Subscription atualizada para user ${userId}: status=${subscription.status}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        await db.update(usersTable)
          .set({
            isPremium: false,
            stripeSubscriptionId: null,
            premiumExpiresAt: new Date(),
          })
          .where(eq(usersTable.id, userId));

        console.log(`[Stripe] Premium removido para user ${userId}`);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      if (customerId) {
        const user = await db.query.users.findFirst({
          where: eq(usersTable.stripeCustomerId, customerId),
        });

        if (user) {
          console.warn(`[Stripe] Pagamento falhou para user ${user.id} (${user.email}), subscription ${invoice.subscription}`);
        }
      }
      break;
    }

    case 'customer.subscription.trial_will_end': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId && subscription.trial_end) {
        const trialEndDate = new Date(subscription.trial_end * 1000);
        console.log(`[Stripe] Trial terminando em ${trialEndDate.toISOString()} para user ${userId}`);
      }
      break;
    }
  }

  // Marcar evento como processado APÓS sucesso
  await markEventProcessed(db, event.id);

  return NextResponse.json({ received: true });
}
