'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { VideoCard } from '@/components/video/video-card';
import type { VideoListItem } from '@/types/video';

type CategoryItem = {
  name: string;
  count: number;
};

const AGE_OPTIONS = ['all', '4-6', '7-9', '10-13'] as const;
const skeletonItems = [1, 2, 3, 4];

async function fetchVideos(filters: { q: string; category: string; ageGroup: string }) {
  const params = new URLSearchParams({ limit: '40' });
  if (filters.q.trim()) params.set('q', filters.q.trim());
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.ageGroup !== 'all') params.set('ageGroup', filters.ageGroup);

  const response = await fetch(`/api/videos?${params.toString()}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Не удалось загрузить видео');
  }
  return (await response.json()) as VideoListItem[];
}

async function fetchCategories() {
  const response = await fetch('/api/videos/categories', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Не удалось загрузить категории');
  }
  return (await response.json()) as CategoryItem[];
}

export function HomeFeed() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [ageGroup, setAgeGroup] = useState<(typeof AGE_OPTIONS)[number]>('all');

  const videoQuery = useQuery({
    queryKey: ['videos', 'home', q, category, ageGroup],
    queryFn: () => fetchVideos({ q, category, ageGroup })
  });

  const categoryQuery = useQuery({
    queryKey: ['videos', 'categories'],
    queryFn: fetchCategories
  });

  const categories = useMemo(
    () => [{ name: 'all', count: 0 }, ...(categoryQuery.data ?? [])],
    [categoryQuery.data],
  );

  return (
    <div className="space-y-4">
      <section className="rounded-[20px] border border-border bg-card p-4 shadow-card">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <label className="flex h-12 items-center rounded-[14px] border border-border bg-background px-3">
            <Search className="h-5 w-5 text-primary/70" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по названию или категории"
              className="ml-2 w-full bg-transparent text-[16px] text-primary outline-none placeholder:text-primary/50"
            />
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 rounded-[14px] border border-border bg-background px-3 text-[16px] text-primary outline-none"
          >
            {categories.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name === 'all' ? 'Все категории' : item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {AGE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAgeGroup(option)}
              className={`rounded-full px-4 py-2 text-[14px] font-semibold transition ${
                ageGroup === option ? 'bg-primary text-white' : 'bg-secondary text-primary hover:brightness-95'
              }`}
            >
              {option === 'all' ? 'Все возрасты' : option}
            </button>
          ))}
        </div>
      </section>

      {videoQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
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
        </div>
      ) : videoQuery.isError ? (
        <div className="rounded-[22px] border border-border bg-card p-4 text-[16px] text-primary/80 shadow-card">
          Не удалось загрузить ленту. Попробуйте обновить страницу.
        </div>
      ) : !videoQuery.data?.length ? (
        <div className="rounded-[22px] border border-border bg-card p-4 text-[16px] text-primary/80 shadow-card">
          По выбранным фильтрам видео не найдено.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {videoQuery.data.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
