import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, clearAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  clearAuthCookie(response);

  return response;
}
