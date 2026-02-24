import type { Route } from 'next';
import Link from 'next/link';
import { ChevronRight, Globe, History, Settings, Shield, User, UserRound } from 'lucide-react';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LogoutButton } from '@/components/profile/logout-button';
import { toTitleCase } from '@/lib/text';
import { MainNavigation } from '@/components/layout/main-navigation';
import { PageHeader } from '@/components/layout/page-header';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';

function getInitial(name: string) {
  return toTitleCase(name).charAt(0).toUpperCase() || 'M';
}

export default async function ProfilePage() {
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();
  const activeChildId = user ? await getActiveChildIdForUser(user.id) : null;

  const child = user
    ? await prisma.childProfile.findFirst({
        where: { userId: user.id, ...(activeChildId ? { id: activeChildId } : {}) },
        orderBy: { createdAt: 'asc' },
        select: {
          name: true,
          age: true,
          avatarColor: true,
          interests: true,
          allowedAgeGroups: true
        }
      })
    : null;

  const favoritesCount = user ? await prisma.favorite.count({ where: { userId: user.id, childId: activeChildId } }) : 0;
  const testsCount = user ? await prisma.quizAttempt.count({ where: { userId: user.id, childId: activeChildId } }) : 0;
  const videosCount = await prisma.video.count({ where: { isPublished: true } });

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <PageHeader
        center={
          <div className="flex items-center gap-2 sm:gap-3">
            <User className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
            <h1 className="text-[28px] font-bold leading-none text-primary sm:text-[34px] lg:text-[36px]">{translate(locale, 'profile.title')}</h1>
          </div>
        }
      />

      <main className="space-y-4 px-4 py-4 pt-[88px] sm:px-5 sm:py-5 lg:max-w-4xl lg:px-6">
        <MainNavigation active="profile" />

        <div className="space-y-4 lg:ml-[220px]">
          {child ? (
            <section className="rounded-[24px] border border-border bg-card p-4 shadow-card sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-[20px] text-[36px] font-bold text-white sm:h-20 sm:w-20 sm:rounded-[24px] sm:text-[48px]"
                  style={{ backgroundColor: child.avatarColor }}
                >
                  {getInitial(child.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[28px] font-bold leading-none text-primary sm:text-[40px]">{toTitleCase(child.name)}</p>
                  <p className="mt-2 text-[20px] text-primary sm:text-[22px]">
                    {child.age} лет • {child.allowedAgeGroups.join(', ')}
                  </p>
                  <p className="truncate text-[14px] text-primary/80 sm:text-[16px]">{user?.email ?? user?.phone ?? 'Аккаунт родителя'}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[22px] font-semibold text-primary sm:text-[20px]">{translate(locale, 'profile.interests')}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {child.interests.map((interest) => (
                    <span key={interest} className="rounded-full bg-secondary px-3 py-1 text-[16px] font-semibold text-primary sm:px-4 sm:text-[16px]">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-[24px] border border-border bg-card p-5 shadow-card">
              <p className="text-[22px] font-semibold text-primary">{translate(locale, 'profile.noChildTitle')}</p>
              <p className="mt-2 text-[16px] text-primary/80">{translate(locale, 'profile.noChildDescription')}</p>
              <Link
                href={'/child/create' as Route}
                className="mt-4 inline-flex h-12 items-center justify-center rounded-[14px] bg-primary px-4 text-[16px] font-semibold text-white transition hover:brightness-110"
              >
                {translate(locale, 'profile.createChild')}
              </Link>
            </section>
          )}

          <section className="grid grid-cols-3 gap-2 sm:gap-3">
            <article className="rounded-[16px] border border-border bg-card p-3 text-center shadow-card lg:p-4">
              <p className="text-[28px] font-bold leading-none text-primary sm:text-[36px]">{videosCount}</p>
              <p className="mt-2 text-[14px] text-primary/90 sm:text-[16px]">{translate(locale, 'profile.videos')}</p>
            </article>
            <article className="rounded-[16px] border border-border bg-card p-3 text-center shadow-card lg:p-4">
              <p className="text-[28px] font-bold leading-none text-primary sm:text-[36px]">{testsCount}</p>
              <p className="mt-2 text-[14px] text-primary/90 sm:text-[16px]">{translate(locale, 'profile.tests')}</p>
            </article>
            <article className="rounded-[16px] border border-border bg-card p-3 text-center shadow-card lg:p-4">
              <p className="text-[28px] font-bold leading-none text-primary sm:text-[36px]">{favoritesCount}</p>
              <p className="mt-2 text-[14px] text-primary/90 sm:text-[16px]">{translate(locale, 'profile.favorites')}</p>
            </article>
          </section>

          <section className="space-y-3">
            <Link
              href={'/profile/language' as Route}
              className="flex items-center justify-between rounded-[18px] border border-border bg-card px-4 py-4 text-[18px] font-semibold text-primary shadow-card transition hover:brightness-95"
            >
              <span className="inline-flex items-center gap-3">
                <Globe className="h-6 w-6" />
                {translate(locale, 'profile.language')}
              </span>
              <ChevronRight className="h-5 w-5" />
            </Link>

            <Link
              href={'/profile/history' as Route}
              className="flex items-center justify-between rounded-[18px] border border-border bg-card px-4 py-4 text-[18px] font-semibold text-primary shadow-card transition hover:brightness-95"
            >
              <span className="inline-flex items-center gap-3">
                <History className="h-6 w-6" />
                {translate(locale, 'profile.history')}
              </span>
              <ChevronRight className="h-5 w-5" />
            </Link>

            <Link
              href={'/profile/settings' as Route}
              className="flex items-center justify-between rounded-[18px] border border-border bg-card px-4 py-4 text-[18px] font-semibold text-primary shadow-card transition hover:brightness-95"
            >
              <span className="inline-flex items-center gap-3">
                <Settings className="h-6 w-6" />
                {translate(locale, 'profile.settings')}
              </span>
              <ChevronRight className="h-5 w-5" />
            </Link>

            <Link
              href={'/parent/controls' as Route}
              className="flex items-center justify-between rounded-[18px] border border-border bg-card px-4 py-4 text-[18px] font-semibold text-primary shadow-card transition hover:brightness-95"
            >
              <span className="inline-flex items-center gap-3">
                <Shield className="h-6 w-6" />
                {translate(locale, 'profile.parental')}
              </span>
              <ChevronRight className="h-5 w-5" />
            </Link>

            <Link
              href={'/parent/profiles' as Route}
              className="flex items-center justify-between rounded-[18px] bg-secondary px-4 py-4 text-[18px] font-semibold text-primary transition hover:brightness-95"
            >
              <span className="inline-flex items-center gap-3">
                <UserRound className="h-6 w-6" />
                {translate(locale, 'profile.switch')}
              </span>
              <ChevronRight className="h-5 w-5" />
            </Link>

            <LogoutButton />
          </section>
        </div>
      </main>
    </div>
  );
}

