import { NextResponse } from 'next/server';
import { getCurrentUserFromSession } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUserFromSession();

  if (!user) {
    return NextResponse.json({ error: 'РќРµ Р°РІС‚РѕСЂРёР·РѕРІР°РЅ' }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    phone: user.phone,
    accountType: user.accountType,
    authMethod: user.authMethod,
    language: user.language
  });
}

