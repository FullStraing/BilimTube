import type { Route } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Heart, Home, Layers, PlaySquare, Plus, User } from 'lucide-react';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
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
  const activeChildId = await getActiveChildIdForUser(user.id);

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
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-[72px] w-full items-center justify-between px-5 lg:px-6">
          <Link
            href={'/profile' as Route}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
            aria-label="Назад"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <p className="text-[26px] font-bold text-primary">Профили</p>
          <div className="h-10 w-10" aria-hidden />
        </div>
      </header>

      <main className="space-y-4 px-5 py-5 pt-[88px] lg:ml-[220px] lg:max-w-4xl lg:px-6">
        <section className="space-y-2">
          <h1 className="text-[52px] font-extrabold leading-[0.95] text-primary lg:text-[42px]">Выберите профиль</h1>
          <p className="text-[20px] text-primary/85 lg:text-[18px]">Кто будет смотреть BILIMTUBE?</p>
        </section>

        <section className="space-y-3">
          {children.map((child) => (
            <Link
              key={child.id}
              href={`/children/switch/${child.id}` as Route}
              className={`block rounded-[24px] border bg-card p-4 shadow-card transition hover:brightness-[0.98] ${
                child.id === activeChildId ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className="mt-1 grid h-14 w-14 place-items-center rounded-2xl text-[34px] font-bold text-white"
                  style={{ backgroundColor: child.avatarColor }}
                >
                  {getInitial(child.name)}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-[44px] font-bold leading-none text-primary lg:text-[34px]">{toTitleCase(child.name)}</p>
                    {child.id === activeChildId ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[12px] font-semibold text-white lg:text-[11px]">
                        Активный
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[28px] font-medium leading-none text-primary/90 lg:text-[18px]">
                    {child.age} лет • {child.allowedAgeGroups.join(', ')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {child.interests.slice(0, 3).map((interest) => (
                      <span key={interest} className="rounded-full bg-secondary px-3 py-1 text-[22px] font-semibold text-primary lg:text-[15px]">
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
                  <p className="text-[44px] font-bold leading-none text-primary lg:text-[34px]">Добавить профиль</p>
                  <p className="mt-1 text-[24px] font-medium text-primary/85 lg:text-[18px]">Создайте профиль для ребёнка</p>
                </div>
              </div>
            </Link>
          ) : (
            <article className="rounded-[24px] border border-border bg-card p-4 shadow-card">
              <p className="text-[24px] font-semibold text-primary">Достигнут лимит профилей</p>
              <p className="mt-1 text-[16px] text-primary/80">Максимум 5 детей на один аккаунт родителя.</p>
            </article>
          )}
        </section>

        <section className="space-y-2 pt-2">
          <Link
            href={'/parent/controls' as Route}
            className="block text-center text-[28px] font-semibold text-primary hover:underline lg:text-[20px]"
          >
            Родительские настройки
          </Link>
          <Link
            href={'/home' as Route}
            className="block text-center text-[24px] font-semibold text-primary hover:underline lg:text-[18px]"
          >
            На главную
          </Link>
        </section>
      </main>

      <aside className="fixed bottom-0 left-0 top-[72px] hidden w-[220px] border-r border-border bg-card px-4 py-5 lg:block">
        <nav className="space-y-1">
          <Link
            href={'/home' as Route}
            className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary/70 transition hover:bg-muted"
          >
            <Home className="h-5 w-5" />
            Главная
          </Link>
          <Link
            href={'/shorts' as Route}
            className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary/70 transition hover:bg-muted"
          >
            <PlaySquare className="h-5 w-5" />
            Shorts
          </Link>
          <Link
            href={'/categories' as Route}
            className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary/70 transition hover:bg-muted"
          >
            <Layers className="h-5 w-5" />
            Разделы
          </Link>
          <Link
            href={'/favorites' as Route}
            className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary/70 transition hover:bg-muted"
          >
            <Heart className="h-5 w-5" />
            Избранное
          </Link>
          <Link
            href={'/profile' as Route}
            className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary transition hover:bg-muted"
          >
            <User className="h-5 w-5" />
            Профиль
          </Link>
        </nav>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card lg:hidden">
        <div className="mx-auto grid w-full max-w-md grid-cols-5 px-4 py-2">
          <Link href={'/home' as Route} className="flex flex-col items-center text-[#8EC7E6]">
            <Home className="h-6 w-6" />
            <span className="text-[13px] font-semibold">Главная</span>
          </Link>
          <Link href={'/shorts' as Route} className="flex flex-col items-center text-[#8EC7E6]">
            <PlaySquare className="h-6 w-6" />
            <span className="text-[13px] font-semibold">Shorts</span>
          </Link>
          <Link href={'/categories' as Route} className="flex flex-col items-center text-[#8EC7E6]">
            <Layers className="h-6 w-6" />
            <span className="text-[13px] font-semibold">Разделы</span>
          </Link>
          <Link href={'/favorites' as Route} className="flex flex-col items-center text-[#8EC7E6]">
            <Heart className="h-6 w-6" />
            <span className="text-[13px] font-semibold">Избранное</span>
          </Link>
          <Link href={'/profile' as Route} className="flex flex-col items-center text-primary">
            <User className="h-6 w-6" />
            <span className="text-[13px] font-semibold">Профиль</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
