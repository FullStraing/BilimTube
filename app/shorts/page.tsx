import { PlaySquare } from 'lucide-react';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MainNavigation } from '@/components/layout/main-navigation';
import { HeaderProfileLink, PageHeader } from '@/components/layout/page-header';
import { ShortsFeed } from '@/features/shorts/shorts-feed';

export default async function ShortsPage() {
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

  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-8">
      <PageHeader
        center={
          <div className="flex items-center gap-3">
            <PlaySquare className="h-8 w-8 text-primary" />
            <h1 className="text-[48px] font-bold leading-none text-primary lg:text-[36px]">Shorts</h1>
          </div>
        }
        right={<HeaderProfileLink letter={profileLetter} />}
      />

      <main className="space-y-4 px-4 py-4 pt-[88px] sm:px-5 lg:px-6">
        <MainNavigation active="shorts" />

        <section className="h-[calc(100dvh-88px-86px)] lg:ml-[220px] lg:h-[calc(100vh-108px)]">
          <ShortsFeed />
        </section>
      </main>
    </div>
  );
}
