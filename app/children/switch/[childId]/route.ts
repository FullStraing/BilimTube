import { NextResponse } from 'next/server';
import { getCurrentUserFromSession, setActiveChildCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ childId: string }> },
) {
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  const { childId } = await params;

  const child = await prisma.childProfile.findFirst({
    where: { id: childId, userId: user.id },
    select: { id: true }
  });

  if (!child) {
    return NextResponse.redirect(new URL('/parent/profiles', req.url));
  }

  await setActiveChildCookie(child.id);
  return NextResponse.redirect(new URL('/home', req.url));
}
