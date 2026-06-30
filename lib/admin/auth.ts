import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { getAuthUserFromRequest, AuthUser } from '@/lib/auth';

const { users } = schema;

export interface AdminUser extends AuthUser {
  isAdmin: boolean;
}

/**
 * Get admin user from request
 * Returns null if user is not authenticated or not an admin
 */
export async function getAdminUserFromRequest(request: NextRequest): Promise<AdminUser | null> {
  const authUser = await getAuthUserFromRequest(request);
  
  if (!authUser) {
    return null;
  }

  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
    columns: {
      id: true,
      email: true,
      isPremium: true,
      isAdmin: true,
      premiumExpiresAt: true,
    },
  });

  if (!user || !user.isAdmin) {
    return null;
  }

  const isPremium = Boolean(
    user.isPremium && (!user.premiumExpiresAt || new Date(user.premiumExpiresAt) > new Date())
  );

  return {
    id: user.id,
    email: user.email,
    isPremium,
    premiumExpiresAt: user.premiumExpiresAt,
    isAdmin: user.isAdmin,
  };
}

/**
 * Check if user is admin
 * Returns true if user is authenticated and is an admin
 */
export async function isUserAdmin(request: NextRequest): Promise<boolean> {
  const adminUser = await getAdminUserFromRequest(request);
  return adminUser !== null;
}

/**
 * Require admin access
 * Returns admin user or throws error
 */
export async function requireAdmin(request: NextRequest): Promise<AdminUser> {
  const adminUser = await getAdminUserFromRequest(request);
  
  if (!adminUser) {
    throw new Error('Unauthorized: Admin access required');
  }

  return adminUser;
}

/**
 * Create unauthorized response
 */
export function createUnauthorizedResponse(message = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    { error: message, code: 'UNAUTHORIZED' },
    { status: 401 }
  );
}

/**
 * Create forbidden response
 */
export function createForbiddenResponse(message = 'Access denied'): NextResponse {
  return NextResponse.json(
    { error: message, code: 'FORBIDDEN' },
    { status: 403 }
  );
}
