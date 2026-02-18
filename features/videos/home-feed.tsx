'use client';

import { useQuery } from '@tanstack/react-query';
import { VideoCard } from '@/components/video/video-card';
import type { VideoListItem } from '@/types/video';

async function fetchVideos() {
  const response = await fetch('/api/videos?limit=20', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Не удалось загрузить видео');
  }
  return (await response.json()) as VideoListItem[];
}

const skeletonItems = [1, 2, 3];

export function HomeFeed() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['videos', 'home'],
    queryFn: fetchVideos
  });

  if (isLoading) {
    return (
      <>
        {skeletonItems.map((item) => (
          <div key={item} className="overflow-hidden rounded-[22px] border border-border bg-card shadow-card">
            <div className="h-56 animate-pulse bg-gradient-to-r from-[#92c8eb] via-[#7db5db] to-[#92c8eb]" />
            <div className="space-y-2 p-4">
              <div className="h-7 w-4/5 animate-pulse rounded-md bg-[#E2E8EE]" />
              <div className="h-6 w-1/2 animate-pulse rounded-md bg-[#E7EDF2]" />
              <div className="h-6 w-2/3 animate-pulse rounded-md bg-[#E7EDF2]" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[22px] border border-border bg-card p-4 text-[16px] text-primary/80 shadow-card">
        Не удалось загрузить ленту. Попробуйте обновить страницу.
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-[22px] border border-border bg-card p-4 text-[16px] text-primary/80 shadow-card">
        Пока видео нет. Добавьте записи в таблицу `Video`.
      </div>
    );
  }

  return (
    <>
      {data.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </>
  );
}
