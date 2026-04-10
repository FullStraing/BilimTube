import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { SURVEY_ANALYTICS_COOKIE, SURVEY_ANALYTICS_PASSWORD } from '@/lib/survey-auth';

export async function POST(req: Request) {
  const locale = await getLocaleFromCookie();
  const body = await req.json().catch(() => null);
  const password = typeof body?.password === 'string' ? body.password.trim() : '';

  if (password !== SURVEY_ANALYTICS_PASSWORD) {
    return NextResponse.json({ error: translate(locale, 'survey.analyticsWrongPassword') }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SURVEY_ANALYTICS_COOKIE, 'granted', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12
  });

  return NextResponse.json({ ok: true });
}
