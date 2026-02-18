import type { Route } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || 'Р';
}

export default async function ChildPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUserFromSession();
  if (!user) {
    redirect('/auth/login');
  }

  const child = await prisma.childProfile.findFirst({
    where: {
      id: params.id,
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

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      <div className="mx-auto w-full max-w-md space-y-5">
        <Link
          href={'/parent/profiles' as Route}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
          aria-label="Назад"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <section className="rounded-[24px] border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div
              className="grid h-16 w-16 place-items-center rounded-2xl text-4xl font-bold text-white"
              style={{ backgroundColor: child.avatarColor }}
            >
              {getInitial(child.name)}
            </div>
            <div>
              <h1 className="text-[38px] font-bold leading-none text-primary">{child.name}</h1>
              <p className="mt-1 text-[18px] text-primary/90">
                {child.age} лет • {child.allowedAgeGroups.join(', ')}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div>
              <p className="text-[16px] font-semibold text-primary">Интересы</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {child.interests.map((interest) => (
                  <span key={interest} className="rounded-full bg-secondary px-3 py-1 text-[14px] font-semibold text-primary">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[15px] text-primary/85">
              <p>Лимит в день: {child.dailyLimitMinutes} мин</p>
              <p>Контент: {child.educationalOnly ? 'только обучающий' : 'разрешенный контент'}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}