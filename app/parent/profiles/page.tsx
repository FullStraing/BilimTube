import type { Route } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus } from 'lucide-react';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { toTitleCase } from '@/lib/text';
import { MainNavigation } from '@/components/layout/main-navigation';
import { HeaderBackLink, PageHeader } from '@/components/layout/page-header';

function getInitial(name: string) {
  return toTitleCase(name).charAt(0).toUpperCase() || 'M';
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
      <PageHeader left={<HeaderBackLink href={'/profile' as Route} />} center={<p className="text-[26px] font-bold text-primary">РџСЂРѕС„РёР»Рё</p>} />

      <main className="space-y-4 px-5 py-5 pt-[88px] lg:max-w-4xl lg:px-6">
        <MainNavigation active="profile" />

        <div className="space-y-4 lg:ml-[220px]">
          <section className="space-y-2">
            <h1 className="text-[52px] font-extrabold leading-[0.95] text-primary lg:text-[42px]">Р’С‹Р±РµСЂРёС‚Рµ РїСЂРѕС„РёР»СЊ</h1>
            <p className="text-[20px] text-primary/85 lg:text-[18px]">РљС‚Рѕ Р±СѓРґРµС‚ СЃРјРѕС‚СЂРµС‚СЊ BILIMTUBE?</p>
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
                          РђРєС‚РёРІРЅС‹Р№
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[28px] font-medium leading-none text-primary/90 lg:text-[18px]">
                      {child.age} Р»РµС‚ вЂў {child.allowedAgeGroups.join(', ')}
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
                    <p className="text-[44px] font-bold leading-none text-primary lg:text-[34px]">Р”РѕР±Р°РІРёС‚СЊ РїСЂРѕС„РёР»СЊ</p>
                    <p className="mt-1 text-[24px] font-medium text-primary/85 lg:text-[18px]">РЎРѕР·РґР°Р№С‚Рµ РїСЂРѕС„РёР»СЊ РґР»СЏ СЂРµР±С‘РЅРєР°</p>
                  </div>
                </div>
              </Link>
            ) : (
              <article className="rounded-[24px] border border-border bg-card p-4 shadow-card">
                <p className="text-[24px] font-semibold text-primary">Р”РѕСЃС‚РёРіРЅСѓС‚ Р»РёРјРёС‚ РїСЂРѕС„РёР»РµР№</p>
                <p className="mt-1 text-[16px] text-primary/80">РњР°РєСЃРёРјСѓРј 5 РґРµС‚РµР№ РЅР° РѕРґРёРЅ Р°РєРєР°СѓРЅС‚ СЂРѕРґРёС‚РµР»СЏ.</p>
              </article>
            )}
          </section>

          <section className="space-y-2 pt-2">
            <Link
              href={'/parent/controls' as Route}
              className="block text-center text-[28px] font-semibold text-primary hover:underline lg:text-[20px]"
            >
              Р РѕРґРёС‚РµР»СЊСЃРєРёРµ РЅР°СЃС‚СЂРѕР№РєРё
            </Link>
            <Link
              href={'/home' as Route}
              className="block text-center text-[24px] font-semibold text-primary hover:underline lg:text-[18px]"
            >
              РќР° РіР»Р°РІРЅСѓСЋ
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
