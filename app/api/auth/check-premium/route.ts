import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        isPremium: false,
        isAdmin: false,
        userId: null,
        user: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      isPremium: user.isPremium,
      isAdmin: user.isAdmin,
      userId: user.id,
      email: user.email,
      user: {
        id: user.id,
        email: user.email,
        isPremium: user.isPremium,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Error checking premium:', error);
    return NextResponse.json({
      authenticated: false,
      isPremium: false,
      isAdmin: false,
      userId: null,
      user: null,
    });
  }
}
