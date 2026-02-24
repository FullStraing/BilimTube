import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clearSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }

  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}

