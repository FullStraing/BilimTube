import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE = 'session_token';
const ACTIVE_CHILD_COOKIE = 'active_child_id';
const SESSION_TTL_DAYS = 30;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits ? `+${digits}` : '';
}

export function createSessionToken() {
  return randomBytes(32).toString('hex');
}

export function createSessionExpiry() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS);
  return expiresAt;
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
  cookieStore.set(ACTIVE_CHILD_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
}

export async function setActiveChildCookie(childId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_CHILD_COOKIE, childId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60
  });
}

export async function clearActiveChildCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_CHILD_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
}

export async function getActiveChildIdForUser(userId: string) {
  const cookieStore = await cookies();
  const cookieChildId = cookieStore.get(ACTIVE_CHILD_COOKIE)?.value;

  if (cookieChildId) {
    const cookieChild = await prisma.childProfile.findFirst({
      where: { id: cookieChildId, userId },
      select: { id: true }
    });
    if (cookieChild) return cookieChild.id;
  }

  const firstChild = await prisma.childProfile.findFirst({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    select: { id: true }
  });

  return firstChild?.id ?? null;
}

export async function getCurrentUserFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!session) return null;
  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => null);
    await clearSessionCookie();
    return null;
  }

  return session.user;
}

