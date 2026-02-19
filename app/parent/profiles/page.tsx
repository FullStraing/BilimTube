import type { Route } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { toTitleCase } from '@/lib/text';

function getInitial(name: string) {
  return toTitleCase(name).charAt(0).toUpperCase() || 'Р';
}

export default async function ParentProfilesPage() {
  const user = await getCurrentUserFromSession();
  if (!user) {
    redirect('/auth/login');
  }

  const children = await prisma.childProfile.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      age: true,
      avatarColor: true,
      allowedAgeGroups: true,
      interests: true
    }
  });

  const canAddMore = children.length < 5;

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      <div className="mx-auto w-full max-w-md space-y-5">
        <Link
          href={'/parent/dashboard' as Route}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
          aria-label="Назад"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <section className="space-y-2">
          <h1 className="text-5xl font-extrabold leading-tight text-primary">Выберите профиль</h1>
          <p className="text-[18px] font-medium text-primary/85">Кто будет смотреть BILIMTUBE?</p>
        </section>

        <section className="space-y-3">
          {children.map((child) => (
            <Link
              key={child.id}
              href={`/child/${child.id}` as Route}
              className="block rounded-[24px] border border-border bg-card p-4 shadow-card transition hover:brightness-[0.98]"
            >
              <div className="flex items-start gap-4">
                <div
                  className="mt-1 grid h-14 w-14 place-items-center rounded-2xl text-4xl font-bold text-white"
                  style={{ backgroundColor: child.avatarColor }}
                >
                  {getInitial(child.name)}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-[40px] font-bold leading-none text-primary">{toTitleCase(child.name)}</p>
                  <p className="text-[20px] font-medium leading-none text-primary/90">
                    {child.age} лет • {child.allowedAgeGroups.join(', ')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {child.interests.slice(0, 3).map((interest) => (
                      <span key={interest} className="rounded-full bg-secondary px-3 py-1 text-[15px] font-semibold text-primary">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {canAddMore ? (
            <Link
              href={'/child/create' as Route}
              className="block rounded-[24px] border-2 border-dashed border-primary p-4 transition hover:bg-secondary/50"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary">
                  <Plus className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-[38px] font-bold leading-none text-primary">Добавить профиль</p>
                  <p className="mt-1 text-[18px] font-medium text-primary/85">Создайте профиль для ребёнка</p>
                </div>
              </div>
            </Link>
          ) : (
            <article className="rounded-[24px] border border-border bg-card p-4 shadow-card">
              <p className="text-[22px] font-semibold text-primary">Достигнут лимит профилей</p>
              <p className="mt-1 text-[16px] text-primary/80">Максимум 5 детей на один аккаунт родителя.</p>
            </article>
          )}
        </section>

        <Link
          href={'/parent/controls' as Route}
          className="block pt-2 text-center text-[24px] font-semibold text-primary hover:underline"
        >
          Родительские настройки
        </Link>
        <Link
          href={'/home' as Route}
          className="block text-center text-[18px] font-semibold text-primary hover:underline"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
