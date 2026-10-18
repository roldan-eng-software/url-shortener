import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { recordFunnelStep } from '@/lib/analytics/funnel';

const { users: usersTable, processedEvents: processedEventsTable } = schema;

type FunnelContext = {
  userId: string;
  source: string;
  visitorId?: string;
};

function funnelContextFromSubscription(subscription: Stripe.Subscription): FunnelContext | null {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    return null;
  }

  return {
    userId,
    source: subscription.metadata?.source || 'unknown',
    visitorId: subscription.metadata?.visitorId || undefined,
  };
}

function subscriptionCycle(subscription: Stripe.Subscription): string {
  const interval = subscription.items?.data?.[0]?.price?.recurring?.interval;
  return interval === 'year' ? 'annual' : 'monthly';
}

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
      return NextResponse.json({ error: 'Assinatura ausente' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = getStripe().webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    } catch (err) {
      console.error('[Stripe] Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 });
    }

    return await handleEvent(event);
  } catch (error) {
    console.error('[Stripe] Webhook error:', error);
    return NextResponse.json({ error: 'Erro no webhook' }, { status: 500 });
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
            console.error(
              `[Stripe] userId mismatch: session.metadata.userId=${userId}, customer.metadata.userId=${customerUserId}`
            );
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

        await db
          .update(usersTable)
          .set({
            isPremium: true,
            stripeSubscriptionId: subscription.id,
            premiumExpiresAt: trialEnd,
          })
          .where(eq(usersTable.id, userId));

        // Funil: trial iniciado (ou assinatura ativa, quando não há trial)
        const trialActive = Boolean(
          subscription.trial_end && subscription.trial_end * 1000 > Date.now()
        );

        await recordFunnelStep({
          step: trialActive ? 'trial_started' : 'subscription_active',
          source: subscription.metadata?.source ?? session.metadata?.source,
          visitorId: subscription.metadata?.visitorId ?? session.metadata?.visitorId,
          userId,
          metadata: { cycle: subscriptionCycle(subscription) },
        });

        console.log(
          `[Stripe] Premium ativado para user ${userId}, subscription ${subscription.id}`
        );
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        const isActive = subscription.status === 'active' || subscription.status === 'trialing';
        const premiumExpiresAt = new Date(subscription.current_period_end * 1000);

        await db
          .update(usersTable)
          .set({
            isPremium: isActive,
            premiumExpiresAt,
          })
          .where(eq(usersTable.id, userId));

        // Funil: mapeia o estado da assinatura para a etapa correspondente
        const context = funnelContextFromSubscription(subscription);

        if (context) {
          const cycle = subscriptionCycle(subscription);
          const step =
            subscription.status === 'trialing'
              ? 'trial_started'
              : subscription.status === 'active'
                ? 'subscription_active'
                : subscription.status === 'past_due' || subscription.status === 'unpaid'
                  ? 'payment_failed'
                  : null;

          if (step) {
            await recordFunnelStep({
              step,
              source: context.source,
              visitorId: context.visitorId,
              userId: context.userId,
              metadata: { cycle },
              dedupeSuffix: step === 'payment_failed' ? event.id : null,
            });
          }
        }

        console.log(
          `[Stripe] Subscription atualizada para user ${userId}: status=${subscription.status}`
        );
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        await db
          .update(usersTable)
          .set({
            isPremium: false,
            stripeSubscriptionId: null,
            premiumExpiresAt: new Date(),
          })
          .where(eq(usersTable.id, userId));

        // Funil: cancelamento (pode ocorrer mais de uma vez por usuário)
        const context = funnelContextFromSubscription(subscription);

        await recordFunnelStep({
          step: 'subscription_canceled',
          source: context?.source,
          visitorId: context?.visitorId,
          userId,
          metadata: { cycle: subscriptionCycle(subscription) },
          dedupeSuffix: event.id,
        });

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
          // Funil: falha de pagamento (recorrente -> usa o id do evento)
          let source: string | undefined;
          let visitorId: string | undefined;

          try {
            const subscription = await getStripe().subscriptions.retrieve(
              invoice.subscription as string
            );
            source = subscription.metadata?.source;
            visitorId = subscription.metadata?.visitorId;
          } catch {
            // Metadados indisponíveis: registra mesmo assim, com origem unknown
          }

          await recordFunnelStep({
            step: 'payment_failed',
            source,
            visitorId,
            userId: user.id,
            dedupeSuffix: event.id,
          });

          console.warn(
            `[Stripe] Pagamento falhou para user ${user.id} (${user.email}), subscription ${invoice.subscription}`
          );
        }
      }
      break;
    }

    case 'customer.subscription.trial_will_end': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId && subscription.trial_end) {
        const trialEndDate = new Date(subscription.trial_end * 1000);
        console.log(
          `[Stripe] Trial terminando em ${trialEndDate.toISOString()} para user ${userId}`
        );
      }
      break;
    }
  }

  // Marcar evento como processado APÓS sucesso
  await markEventProcessed(db, event.id);

  return NextResponse.json({ received: true });
}
