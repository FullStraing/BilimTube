import type { Route } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCurrentUserFromSession } from '@/lib/auth';
import { localizeCategoryName } from '@/lib/categories';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { prisma } from '@/lib/prisma';
import { toTitleCase } from '@/lib/text';

function getInitial(name: string) {
  return toTitleCase(name).charAt(0).toUpperCase() || 'P';
}

export default async function ChildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getLocaleFromCookie();

  const user = await getCurrentUserFromSession();
  if (!user) {
    redirect('/auth/login');
  }

  const child = await prisma.childProfile.findFirst({
    where: {
      id,
      userId: user.id
    },
    select: {
      id: true,
      name: true,
      age: true,
      avatarColor: true,
      interests: true,
      allowedAgeGroups: true,
      dailyLimitMinutes: true,
      educationalOnly: true
    }
  });

  if (!child) {
    notFound();
  }

  const childName = toTitleCase(child.name);

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      <div className="mx-auto w-full max-w-md space-y-5">
        <Link
          href={'/parent/profiles' as Route}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
          aria-label={translate(locale, 'common.back')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <section className="rounded-[24px] border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div
              className="grid h-16 w-16 place-items-center rounded-2xl text-4xl font-bold text-white"
              style={{ backgroundColor: child.avatarColor }}
            >
              {getInitial(childName)}
            </div>
            <div>
              <h1 className="text-[38px] font-bold leading-none text-primary">{childName}</h1>
              <p className="mt-1 text-[18px] text-primary/90">
                {child.age} {translate(locale, 'common.years')} • {child.allowedAgeGroups.join(', ')}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div>
              <p className="text-[16px] font-semibold text-primary">{translate(locale, 'profile.interests')}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {child.interests.map((interest) => (
                  <span key={interest} className="rounded-full bg-secondary px-3 py-1 text-[14px] font-semibold text-primary">
                    {localizeCategoryName(interest, locale)}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[15px] text-primary/85">
              <p>{translate(locale, 'childProfile.limit', { count: child.dailyLimitMinutes })}</p>
              <p>
                {translate(locale, 'childProfile.content', {
                  mode: child.educationalOnly
                    ? translate(locale, 'childProfile.educational')
                    : translate(locale, 'childProfile.allowed')
                })}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
