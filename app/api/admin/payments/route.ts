import { NextRequest, NextResponse } from 'next/server';
import { getAdminOrErrorResponse } from '@/lib/admin/middleware';

interface PaymentMetrics {
  stripeConnected: boolean;
  totalRevenue: number;
  mrr: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
}

async function calculatePaymentMetrics(): Promise<PaymentMetrics> {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    return {
      stripeConnected: false,
      totalRevenue: 0,
      mrr: 0,
      activeSubscriptions: 0,
      trialSubscriptions: 0,
    };
  }

  try {
    // Dynamic import to avoid issues if Stripe is not configured
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-02-24.acacia',
    });

    // Test connection by listing subscriptions
    const subscriptions = await stripe.subscriptions.list({
      limit: 100,
      status: 'all',
    });

    let activeSubscriptions = 0;
    let trialSubscriptions = 0;
    let totalRevenue = 0;

    for (const subscription of subscriptions.data) {
      if (subscription.status === 'active') {
        activeSubscriptions++;
        // Add to total revenue
        const amount = subscription.items.data[0]?.plan?.amount || 0;
        totalRevenue += amount;
      } else if (subscription.status === 'trialing') {
        trialSubscriptions++;
      }
    }

    // Calculate MRR (Monthly Recurring Revenue)
    // For monthly subscriptions, MRR = sum of all active subscription amounts
    const mrr = totalRevenue;

    return {
      stripeConnected: true,
      totalRevenue,
      mrr,
      activeSubscriptions,
      trialSubscriptions,
    };
  } catch (err) {
    console.error('Error calculating payment metrics:', err);
    return {
      stripeConnected: false,
      totalRevenue: 0,
      mrr: 0,
      activeSubscriptions: 0,
      trialSubscriptions: 0,
    };
  }
}

export async function GET(request: NextRequest) {
  const { error } = await getAdminOrErrorResponse(request);

  if (error) {
    return error;
  }

  try {
    const metrics = await calculatePaymentMetrics();

    return NextResponse.json(metrics);
  } catch (err) {
    console.error('Error fetching payment metrics:', err);
    return NextResponse.json(
      { error: 'Failed to fetch payment metrics', code: 'PAYMENTS_ERROR' },
      { status: 500 }
    );
  }
}
