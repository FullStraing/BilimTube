import { Heart } from 'lucide-react';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { VideoCard } from '@/components/video/video-card';
import { MainNavigation } from '@/components/layout/main-navigation';
import { HeaderProfileLink, PageHeader } from '@/components/layout/page-header';

export default async function FavoritesPage() {
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

  const favorites = user
    ? await prisma.favorite.findMany({
        where: { userId: user.id, childId: activeChildId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          video: {
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              category: true,
              ageGroup: true,
              thumbnailUrl: true,
              durationSec: true,
              viewsCount: true
            }
          }
        }
      })
    : [];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        center={
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-[48px] font-bold leading-none text-primary lg:text-[36px]">Избранное</h1>
          </div>
        }
        right={<HeaderProfileLink letter={profileLetter} />}
      />

      <main className="px-5 py-5 pb-24 pt-[88px] lg:pb-8">
        <MainNavigation active="favorites" />

        <div className="mx-auto w-full max-w-6xl lg:ml-[220px]">
          {!user ? (
            <div className="rounded-[22px] border border-border bg-card p-4 text-[16px] text-primary/85 shadow-card">
              Войдите в аккаунт, чтобы сохранять и смотреть избранные видео.
            </div>
          ) : favorites.length ? (
            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {favorites.map((item) => (
                <VideoCard key={item.id} video={item.video} />
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] border border-border bg-card p-4 text-[16px] text-primary/85 shadow-card">
              Вы пока ничего не добавили в избранное.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
