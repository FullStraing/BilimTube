import { NextResponse } from 'next/server';
import { getCurrentUserFromSession } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUserFromSession();

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    phone: user.phone,
    accountType: user.accountType
  });
}
