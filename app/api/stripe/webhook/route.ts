import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const { users: usersTable } = schema;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
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
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 400 }
      );
    }

    const db = getDb();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
          const subscription = await stripe.subscriptions.retrieve(
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
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        if (subscription.metadata?.userId) {
          const userId = subscription.metadata.userId;
          const isActive = subscription.status === 'active' || subscription.status === 'trialing';
          const premiumExpiresAt = new Date(subscription.current_period_end * 1000);

          await db.update(usersTable)
            .set({
              isPremium: isActive,
              premiumExpiresAt,
            })
            .where(eq(usersTable.id, userId));
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        if (subscription.metadata?.userId) {
          const userId = subscription.metadata.userId;

          await db.update(usersTable)
            .set({
              isPremium: false,
              stripeSubscriptionId: null,
              premiumExpiresAt: new Date(),
            })
            .where(eq(usersTable.id, userId));
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Erro no webhook' },
      { status: 500 }
    );
  }
}
