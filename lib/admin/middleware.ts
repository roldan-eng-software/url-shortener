import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminUserFromRequest,
  createUnauthorizedResponse,
  createForbiddenResponse,
} from './auth';

/**
 * Middleware to protect admin routes
 * Checks if user is authenticated and has admin role
 */
export async function adminMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const adminUser = await getAdminUserFromRequest(request);

  if (!adminUser) {
    // Check if user is authenticated at all
    const authUser = await import('@/lib/auth').then((m) => m.getAuthUserFromRequest(request));

    if (!authUser) {
      // Not authenticated - redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated but not admin - forbidden
    return createForbiddenResponse('Access denied: Admin privileges required');
  }

  // User is admin - continue
  return null;
}

/**
 * Helper to check if a route is an admin route
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
}

/**
 * Get admin user or return error response
 * Useful in API routes
 */
export async function getAdminOrErrorResponse(request: NextRequest) {
  const adminUser = await getAdminUserFromRequest(request);

  if (!adminUser) {
    const authUser = await import('@/lib/auth').then((m) => m.getAuthUserFromRequest(request));

    if (!authUser) {
      return { adminUser: null, error: createUnauthorizedResponse() };
    }

    return { adminUser: null, error: createForbiddenResponse() };
  }

  return { adminUser, error: null };
}
