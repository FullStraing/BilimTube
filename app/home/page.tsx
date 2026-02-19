import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { HomeFeed } from '@/features/videos/home-feed';
import { toTitleCase } from '@/lib/text';
import { HomeIntroSplash } from '@/components/home/home-intro-splash';
import { MainNavigation } from '@/components/layout/main-navigation';
import { HeaderProfileLink, PageHeader } from '@/components/layout/page-header';

export default async function HomePage() {
  const user = await getCurrentUserFromSession();
  const activeChildId = user ? await getActiveChildIdForUser(user.id) : null;
  const child =
    user && activeChildId
      ? await prisma.childProfile.findFirst({
          where: { userId: user.id, id: activeChildId },
          select: { name: true }
        })
      : null;

  const profileLetter = (child?.name?.trim()?.charAt(0) ?? 'M').toUpperCase();
  const helloName = child?.name ? toTitleCase(child.name) : 'друг';

  return (
    <div className="min-h-screen bg-background">
      <HomeIntroSplash />
      <PageHeader
        centerAlign="left"
        center={
          <span className="text-[36px] font-extrabold leading-none tracking-[0.03em] text-primary sm:text-[40px]">
            BILIMTUBE
          </span>
        }
        right={<HeaderProfileLink letter={profileLetter} />}
      />

      <main className="pb-28 pt-[88px] lg:pb-8">
        <MainNavigation active="home" />

        <section className="px-4 sm:px-5 lg:ml-[220px] lg:px-6">
          <h1 className="mb-4 text-[44px] font-bold leading-tight text-primary lg:mb-5 lg:text-[52px]">Привет, {helloName}!</h1>
          <HomeFeed />
        </section>
      </main>
    </div>
  );
}
