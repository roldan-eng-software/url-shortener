import { NextRequest, NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { getAdminOrErrorResponse } from '@/lib/admin/middleware';

const { users } = schema;

interface PaymentStatus {
  status: 'active' | 'expired' | 'cancelled' | 'trialing';
  label: string;
  color: 'green' | 'red' | 'yellow' | 'gray';
}

function getPaymentStatus(user: typeof users.$inferSelect): PaymentStatus {
  if (!user.isPremium) {
    return { status: 'cancelled', label: 'Não Premium', color: 'gray' };
  }

  if (!user.premiumExpiresAt) {
    return { status: 'active', label: 'Ativo', color: 'green' };
  }

  const expiryDate = new Date(user.premiumExpiresAt);
  const now = new Date();

  if (expiryDate > now) {
    // Check if in trial period (7 days from creation)
    const createdDate = new Date(user.createdAt || new Date());
    const trialEndDate = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (now < trialEndDate) {
      return { status: 'trialing', label: 'Trial', color: 'yellow' };
    }

    return { status: 'active', label: 'Ativo', color: 'green' };
  }

  return { status: 'expired', label: 'Expirado', color: 'red' };
}

export async function GET(request: NextRequest) {
  const { error } = await getAdminOrErrorResponse(request);

  if (error) {
    return error;
  }

  try {
    const db = getDb();
    const url = new URL(request.url);

    // Parse query parameters
    const statusFilter = url.searchParams.get('status') || 'all';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100);
    const offset = (page - 1) * limit;

    // Fetch premium users
    const premiumUsers = await db.query.users.findMany({
      where: eq(users.isPremium, true),
      orderBy: [desc(users.createdAt)],
      limit: limit + 1, // Fetch one extra to check if there are more
      offset: offset,
    });

    // Filter by payment status if needed
    let filteredUsers = premiumUsers;
    if (statusFilter !== 'all') {
      filteredUsers = premiumUsers.filter((user) => {
        const paymentStatus = getPaymentStatus(user);
        return paymentStatus.status === statusFilter;
      });
    }

    // Check if there are more results
    const hasMore = filteredUsers.length > limit;
    if (hasMore) {
      filteredUsers = filteredUsers.slice(0, limit);
    }

    // Transform users to include payment status
    const clients = filteredUsers.map((user) => {
      const paymentStatus = getPaymentStatus(user);
      return {
        id: user.id,
        email: user.email,
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt,
        stripeSubscriptionId: user.stripeSubscriptionId,
        paymentStatus: paymentStatus.status,
        paymentLabel: paymentStatus.label,
        paymentColor: paymentStatus.color,
        createdAt: user.createdAt,
      };
    });

    // Get total count for pagination
    const totalUsers = await db.query.users.findMany({
      where: eq(users.isPremium, true),
    });
    const total = totalUsers.length;

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore,
      },
    });
  } catch (err) {
    console.error('Error fetching clients:', err);
    return NextResponse.json(
      { error: 'Failed to fetch clients', code: 'CLIENTS_ERROR' },
      { status: 500 }
    );
  }
}
