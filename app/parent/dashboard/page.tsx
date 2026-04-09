import type { Route } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, BarChart3, Clock3, Eye, Medal, Settings } from 'lucide-react';
import { getCurrentUserFromSession } from '@/lib/auth';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { prisma } from '@/lib/prisma';
import { toTitleCase } from '@/lib/text';

function getInitial(name: string) {
  return toTitleCase(name).charAt(0).toUpperCase() || 'P';
}

export default async function ParentDashboardPage() {
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();
  if (!user) {
    redirect('/auth/login');
  }

  const child = await prisma.childProfile.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      age: true,
      avatarColor: true,
      dailyLimitMinutes: true,
      educationalOnly: true,
      allowedAgeGroups: true
    }
  });

  return (
    <div className="min-h-screen bg-background px-6 py-6">
      <div className="mx-auto w-full max-w-md space-y-6">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
            aria-label={translate(locale, 'common.back')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <p className="text-[34px] font-black tracking-[0.04em] text-[#0B3F58]">BILIMTUBE</p>
          <Link
            href={'/parent/controls' as Route}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
            aria-label={translate(locale, 'parentDashboard.controlsAria')}
          >
            <Settings className="h-5 w-5" />
          </Link>
        </header>

        <section className="space-y-2">
          <h1 className="text-4xl font-extrabold leading-tight text-primary">{translate(locale, 'parentDashboard.welcome')}</h1>
          <p className="text-2xl font-semibold text-primary/90">{translate(locale, 'parentDashboard.activity')}</p>
        </section>

        <section className="rounded-[28px] border border-border bg-card p-5 shadow-card">
          {child ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="grid h-16 w-16 place-items-center rounded-2xl text-4xl font-bold text-white"
                  style={{ backgroundColor: child.avatarColor }}
                >
                  {getInitial(child.name)}
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{toTitleCase(child.name)}</p>
                  <p className="text-sm font-medium text-primary/80">
                    {child.age} {translate(locale, 'common.years')} • {child.allowedAgeGroups.join(', ')}
                  </p>
                </div>
              </div>
              <Link href="/child/create" className="text-sm font-semibold text-primary hover:underline">
                {translate(locale, 'parentDashboard.change')}
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xl font-semibold text-primary">{translate(locale, 'parentDashboard.childMissingTitle')}</p>
              <p className="text-sm text-primary/70">{translate(locale, 'parentDashboard.childMissingDescription')}</p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <article className="rounded-[28px] border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Clock3 className="h-5 w-5" />
              <h2 className="text-2xl font-bold">{translate(locale, 'parentDashboard.today')}</h2>
            </div>
            {child ? (
              <p className="text-sm text-primary/70">
                {translate(locale, 'parentDashboard.dailyLimit', { count: child.dailyLimitMinutes })}
              </p>
            ) : (
              <p className="text-sm text-primary/70">{translate(locale, 'parentDashboard.noActivity')}</p>
            )}
          </article>

          <article className="rounded-[28px] border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <BarChart3 className="h-5 w-5" />
              <h2 className="text-2xl font-bold">{translate(locale, 'parentDashboard.weeklyActivity')}</h2>
            </div>
            {child ? (
              <p className="text-sm text-primary/70">
                {translate(locale, 'parentDashboard.contentMode', {
                  mode: child.educationalOnly
                    ? translate(locale, 'parentDashboard.educationalMode')
                    : translate(locale, 'parentDashboard.allowedMode')
                })}
              </p>
            ) : (
              <p className="text-sm text-primary/70">{translate(locale, 'parentDashboard.noData')}</p>
            )}
          </article>

          <article className="rounded-[28px] border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Medal className="h-5 w-5" />
              <h2 className="text-2xl font-bold">{translate(locale, 'parentDashboard.quizResults')}</h2>
            </div>
            <p className="text-sm text-primary/70">{translate(locale, 'parentDashboard.noTests')}</p>
          </article>

          <article className="rounded-[28px] border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Eye className="h-5 w-5" />
              <h2 className="text-2xl font-bold">{translate(locale, 'parentDashboard.recentViews')}</h2>
            </div>
            <p className="text-sm text-primary/70">{translate(locale, 'parentDashboard.noViews')}</p>
          </article>
        </section>

        <section className="space-y-3 pb-6">
          <Link
            href={'/parent/controls' as Route}
            className="flex h-16 w-full items-center justify-center rounded-[20px] bg-primary text-center text-2xl font-bold text-white transition hover:brightness-110"
          >
            {translate(locale, 'parentDashboard.controls')}
          </Link>
          <Link
            href={'/parent/profiles' as Route}
            className="flex h-14 w-full items-center justify-center rounded-[20px] bg-secondary text-center text-2xl font-semibold text-primary transition hover:brightness-95"
          >
            {translate(locale, 'parentDashboard.manageProfiles')}
          </Link>
        </section>
      </div>
    </div>
  );
}
