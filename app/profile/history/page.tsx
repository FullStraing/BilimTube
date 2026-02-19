import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock3 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDuration, formatViews } from '@/lib/video-format';

function formatWatchedAt(value: Date) {
  const diffMs = Date.now() - value.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));

  if (diffMin < 1) return 'только что';
  if (diffMin < 60) return `${diffMin} мин назад`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} ч назад`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} дн назад`;

  return value.toLocaleDateString('ru-RU');
}

export default async function ProfileHistoryPage() {
  const user = await getCurrentUserFromSession();
  if (!user) {
    redirect('/auth/login');
  }
  const activeChildId = await getActiveChildIdForUser(user.id);

  const history = await prisma.watchHistory.findMany({
    where: { userId: user.id, childId: activeChildId },
    orderBy: { watchedAt: 'desc' },
    take: 30,
    select: {
      id: true,
      watchedAt: true,
      video: {
        select: {
          id: true,
          slug: true,
          title: true,
          category: true,
          ageGroup: true,
          thumbnailUrl: true,
          durationSec: true,
          viewsCount: true
        }
      }
    }
  });

  return (
    <div className="min-h-screen bg-background px-5 py-5">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <Link
          href={'/profile' as Route}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
          aria-label="Назад"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <div>
          <h1 className="text-[34px] font-bold text-primary">История просмотров</h1>
          <p className="mt-1 text-[16px] text-primary/80">Последние просмотренные видео</p>
        </div>

        {history.length === 0 ? (
          <div className="rounded-[20px] border border-border bg-card p-4 text-[16px] text-primary/80 shadow-card">
            История пока пустая. Откройте любое видео, и оно появится здесь.
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <Link
                key={item.id}
                href={`/video/${item.video.slug}` as Route}
                className="flex gap-3 rounded-[16px] border border-border bg-card p-3 shadow-card transition hover:brightness-[0.99]"
              >
                <div className="relative h-[96px] w-[140px] shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image src={item.video.thumbnailUrl} alt={item.video.title} fill className="object-cover" sizes="160px" />
                  <div className="absolute right-1 top-1 rounded-full bg-[#0AC95E] px-2 py-0.5 text-[12px] font-bold text-white">
                    {item.video.ageGroup}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="line-clamp-2 text-[20px] font-bold leading-tight text-primary">{item.video.title}</p>
                  <p className="mt-1 text-[16px] text-primary/85">{item.video.category}</p>
                  <p className="text-[15px] text-primary/75">
                    {formatDuration(item.video.durationSec)} • {formatViews(item.video.viewsCount)}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[14px] text-primary/70">
                    <Clock3 className="h-4 w-4" />
                    {formatWatchedAt(item.watchedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
