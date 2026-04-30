import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ isPremium: false, userId: null });
    }

    return NextResponse.json({
      isPremium: user.isPremium,
      userId: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error('Error checking premium:', error);
    return NextResponse.json({ isPremium: false, userId: null });
  }
}
