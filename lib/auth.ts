import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { eq } from 'drizzle-orm';
import { auth as nextAuth } from '@/auth';
import { getDb, schema } from '@/lib/db';

const SESSION_COOKIE = 'session';
const LEGACY_USER_COOKIE = 'userId';

const { users } = schema;

export interface AuthUser {
  id: string;
  email: string;
  isPremium: boolean;
  premiumExpiresAt: Date | null;
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET or NEXTAUTH_SECRET is required in production');
  }

  return secret || 'development-only-auth-secret';
}

function signValue(value: string) {
  return createHmac('sha256', getAuthSecret()).update(value).digest('base64url');
}

function timingSafeStringEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export function createSessionToken(userId: string) {
  return `${userId}.${signValue(userId)}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  const [userId, signature] = token.split('.');
  if (!userId || !signature) {
    return null;
  }

  return timingSafeStringEqual(signature, signValue(userId)) ? userId : null;
}

export function setAuthCookie(response: NextResponse, userId: string) {
  response.cookies.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  response.cookies.set(LEGACY_USER_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

export function clearAuthCookie(response: NextResponse) {
  for (const name of [SESSION_COOKIE, LEGACY_USER_COOKIE]) {
    response.cookies.set(name, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
  }
}

export function getUserIdFromRequest(request: NextRequest) {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
}

export function getUserIdFromCookies() {
  return verifySessionToken(cookies().get(SESSION_COOKIE)?.value);
}

export async function getAuthUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
  const session = await nextAuth();
  const userId = session?.user?.id || getUserIdFromRequest(request);
  if (!userId) {
    return null;
  }

  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
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
  };
}

export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) {
    return true;
  }

  const requestUrl = new URL(request.url);
  const expectedOrigin = `${requestUrl.protocol}//${request.headers.get('host') || requestUrl.host}`;

  return origin === expectedOrigin || origin === process.env.NEXT_PUBLIC_APP_URL;
}
