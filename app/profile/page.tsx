import type { Route } from 'next';
import Link from 'next/link';
import { ChevronRight, Globe, History, Settings, Shield, User, UserRound } from 'lucide-react';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LogoutButton } from '@/components/profile/logout-button';
import { toTitleCase } from '@/lib/text';
import { MainNavigation } from '@/components/layout/main-navigation';
import { PageHeader } from '@/components/layout/page-header';

function getInitial(name: string) {
  return toTitleCase(name).charAt(0).toUpperCase() || 'M';
}

export default async function ProfilePage() {
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
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-[48px] font-bold leading-none text-primary lg:text-[36px]">Профиль</h1>
          </div>
        }
      />

      <main className="space-y-4 px-5 py-5 pt-[88px] lg:max-w-4xl lg:px-6">
        <MainNavigation active="profile" />

        <div className="space-y-4 lg:ml-[220px]">
          {child ? (
            <section className="rounded-[24px] border border-border bg-card p-5 shadow-card">
              <div className="flex items-start gap-4">
                <div
                  className="grid h-20 w-20 shrink-0 place-items-center rounded-[24px] text-[48px] font-bold text-white"
                  style={{ backgroundColor: child.avatarColor }}
                >
                  {getInitial(child.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-[48px] font-bold leading-none text-primary lg:text-[40px]">{toTitleCase(child.name)}</p>
                  <p className="mt-2 text-[30px] text-primary lg:text-[22px]">
                    {child.age} лет • {child.allowedAgeGroups.join(', ')}
                  </p>
                  <p className="text-[24px] text-primary/80 lg:text-[16px]">{user?.email ?? user?.phone ?? 'Аккаунт родителя'}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[28px] font-semibold text-primary lg:text-[20px]">Интересы:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {child.interests.map((interest) => (
                    <span key={interest} className="rounded-full bg-secondary px-4 py-1 text-[26px] font-semibold text-primary lg:text-[16px]">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-[24px] border border-border bg-card p-5 shadow-card">
              <p className="text-[28px] font-semibold text-primary lg:text-[22px]">Профиль ребёнка не создан</p>
              <p className="mt-2 text-[20px] text-primary/80 lg:text-[16px]">Создайте профиль, чтобы открыть родительские настройки.</p>
              <Link
                href={'/child/create' as Route}
                className="mt-4 inline-flex h-12 items-center justify-center rounded-[14px] bg-primary px-4 text-[16px] font-semibold text-white transition hover:brightness-110"
              >
                Создать профиль
              </Link>
            </section>
          )}

          <section className="grid grid-cols-3 gap-3">
            <article className="rounded-[18px] border border-border bg-card p-3 text-center shadow-card lg:p-4">
              <p className="text-[48px] font-bold leading-none text-primary lg:text-[36px]">{videosCount}</p>
              <p className="mt-2 text-[22px] text-primary/90 lg:text-[16px]">Видео</p>
            </article>
            <article className="rounded-[18px] border border-border bg-card p-3 text-center shadow-card lg:p-4">
              <p className="text-[48px] font-bold leading-none text-primary lg:text-[36px]">{testsCount}</p>
              <p className="mt-2 text-[22px] text-primary/90 lg:text-[16px]">Тесты</p>
            </article>
            <article className="rounded-[18px] border border-border bg-card p-3 text-center shadow-card lg:p-4">
              <p className="text-[48px] font-bold leading-none text-primary lg:text-[36px]">{favoritesCount}</p>
              <p className="mt-2 text-[22px] text-primary/90 lg:text-[16px]">Избранное</p>
            </article>
          </section>

          <section className="space-y-3">
            <Link
              href={'/profile/language' as Route}
              className="flex items-center justify-between rounded-[18px] border border-border bg-card px-4 py-4 text-[18px] font-semibold text-primary shadow-card transition hover:brightness-95"
            >
              <span className="inline-flex items-center gap-3">
                <Globe className="h-6 w-6" />
                Язык
              </span>
              <ChevronRight className="h-5 w-5" />
            </Link>

            <Link
              href={'/profile/history' as Route}
              className="flex items-center justify-between rounded-[18px] border border-border bg-card px-4 py-4 text-[18px] font-semibold text-primary shadow-card transition hover:brightness-95"
            >
              <span className="inline-flex items-center gap-3">
                <History className="h-6 w-6" />
                История просмотров
              </span>
              <ChevronRight className="h-5 w-5" />
            </Link>

            <Link
              href={'/profile/settings' as Route}
              className="flex items-center justify-between rounded-[18px] border border-border bg-card px-4 py-4 text-[18px] font-semibold text-primary shadow-card transition hover:brightness-95"
            >
              <span className="inline-flex items-center gap-3">
                <Settings className="h-6 w-6" />
                Настройки
              </span>
              <ChevronRight className="h-5 w-5" />
            </Link>

            <Link
              href={'/parent/controls' as Route}
              className="flex items-center justify-between rounded-[18px] border border-border bg-card px-4 py-4 text-[18px] font-semibold text-primary shadow-card transition hover:brightness-95"
            >
              <span className="inline-flex items-center gap-3">
                <Shield className="h-6 w-6" />
                Родительский контроль
              </span>
              <ChevronRight className="h-5 w-5" />
            </Link>

            <Link
              href={'/parent/profiles' as Route}
              className="flex items-center justify-between rounded-[18px] bg-secondary px-4 py-4 text-[18px] font-semibold text-primary transition hover:brightness-95"
            >
              <span className="inline-flex items-center gap-3">
                <UserRound className="h-6 w-6" />
                Сменить профиль
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
