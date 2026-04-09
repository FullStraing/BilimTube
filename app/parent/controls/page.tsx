import type { Route } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCurrentUserFromSession } from '@/lib/auth';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { prisma } from '@/lib/prisma';
import { toTitleCase } from '@/lib/text';

function getInitial(name: string) {
  return toTitleCase(name).charAt(0).toUpperCase() || 'P';
}

export default async function ParentControlsPage() {
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();
  if (!user) {
    redirect('/auth/login');
  }

  const childrenProfiles = await prisma.childProfile.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      age: true,
      avatarColor: true,
      allowedAgeGroups: true
    }
  });

  if (childrenProfiles.length === 1) {
    redirect(`/parent/controls/${childrenProfiles[0].id}` as Route);
  }

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      <div className="mx-auto w-full max-w-md space-y-5">
        <Link
          href={'/parent/dashboard' as Route}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
          aria-label={translate(locale, 'common.back')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <section className="space-y-2">
          <h1 className="text-[42px] font-bold leading-tight text-primary">{translate(locale, 'parentControls.title')}</h1>
          <p className="text-[18px] text-primary/85">{translate(locale, 'parentControls.subtitle')}</p>
        </section>

        {childrenProfiles.length === 0 ? (
          <article className="rounded-[22px] border border-border bg-card p-4 shadow-card">
            <p className="text-[18px] font-semibold text-primary">{translate(locale, 'parentControls.empty')}</p>
            <Link href={'/child/create' as Route} className="mt-2 inline-block text-[16px] text-primary underline">
              {translate(locale, 'parentControls.addProfile')}
            </Link>
          </article>
        ) : (
          <section className="space-y-3">
            {childrenProfiles.map((child) => (
              <article key={child.id} className="rounded-[22px] border border-border bg-card p-4 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="grid h-14 w-14 place-items-center rounded-2xl text-[34px] font-bold text-white"
                      style={{ backgroundColor: child.avatarColor }}
                    >
                      {getInitial(child.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[30px] font-bold leading-none text-primary">{toTitleCase(child.name)}</p>
                      <p className="mt-1 text-[16px] text-primary/90">
                        {child.age} {translate(locale, 'common.years')} • {child.allowedAgeGroups.join(', ')}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/parent/controls/${child.id}` as Route}
                    className="inline-flex h-10 items-center rounded-xl px-3 text-[16px] font-semibold text-primary hover:bg-secondary"
                  >
                    {translate(locale, 'parentControls.configure')}
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}

        <Link href={'/parent/dashboard' as Route} className="block pt-2 text-center text-[18px] font-semibold text-primary hover:underline">
          {translate(locale, 'parentControls.backToDashboard')}
        </Link>
      </div>
    </div>
  );
}
