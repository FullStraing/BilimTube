import { NextResponse } from 'next/server';
import { getCurrentUserFromSession } from '@/lib/auth';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';

export async function GET() {
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();

  if (!user) {
    return NextResponse.json({ error: translate(locale, 'common.notAuthorized') }, { status: 401 });
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
