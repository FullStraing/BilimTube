'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2, Volume2, VolumeX } from 'lucide-react';
import type { ShortsItem, ShortsResponse } from '@/types/shorts';
import { formatDuration, formatViews } from '@/lib/video-format';
import { useLocale } from '@/components/i18n/locale-provider';
import { translate } from '@/lib/i18n/messages';

const PAGE_SIZE = 5;

async function fetchShorts(cursor?: string) {
  const params = new URLSearchParams({ take: String(PAGE_SIZE) });
  if (cursor) params.set('cursor', cursor);

  const response = await fetch(`/api/shorts?${params.toString()}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Не удалось загрузить shorts');
  }

  return (await response.json()) as ShortsResponse;
}

function ShortCard({
  item,
  isActive,
  muted,
  onToggleMuted,
  videoRef,
  containerRef,
  locale
}: {
  item: ShortsItem;
  isActive: boolean;
  muted: boolean;
  onToggleMuted: () => void;
  videoRef: (node: HTMLVideoElement | null) => void;
  containerRef: (node: HTMLDivElement | null) => void;
  locale: ReturnType<typeof useLocale>;
}) {
  return (
    <article
      ref={containerRef}
      className="relative h-full min-h-0 snap-start snap-always overflow-hidden rounded-[24px] border border-border bg-card shadow-card"
    >
      <video
        ref={videoRef}
        src={item.videoUrl}
        poster={item.thumbnailUrl}
        playsInline
        loop
        preload="metadata"
        muted={muted}
        className="h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-4 text-white">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div className="max-w-[78%]">
            <h2 className="line-clamp-2 text-[24px] font-bold leading-tight">{item.title}</h2>
            <p className="mt-1 line-clamp-2 text-[15px] text-white/85">{item.description}</p>
            <p className="mt-2 text-[14px] text-white/80">
              {item.category} • {formatDuration(item.durationSec)} • {formatViews(item.viewsCount)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full bg-[#0AC95E] px-3 py-1 text-[15px] font-bold text-white">{item.ageGroup}</span>
            <span className="rounded-full bg-black/55 px-3 py-1 text-[14px] font-semibold">
              {item.isFavorite ? translate(locale, 'shorts.favoriteBadge') : translate(locale, 'common.shorts')}
            </span>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMuted}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
            aria-label={muted ? 'Включить звук' : 'Выключить звук'}
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>

          <a
            href={`/video/${item.slug}`}
            className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-[14px] font-semibold text-white transition hover:brightness-110"
          >
            {translate(locale, 'shorts.openVideo')}
          </a>

          <span className="ml-auto text-[13px] text-white/80">
            {isActive ? translate(locale, 'shorts.nowPlaying') : translate(locale, 'shorts.swipeHint')}
          </span>
        </div>
      </div>
    </article>
  );
}

export function ShortsFeed() {
  const locale = useLocale();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const sentViewRef = useRef<Set<string>>(new Set());

  const query = useInfiniteQuery({
    queryKey: ['shorts-feed'],
    queryFn: ({ pageParam }) => fetchShorts(pageParam || undefined),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
  });

  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);

  useEffect(() => {
    if (!items.length || activeId) return;
    setActiveId(items[0].id);
  }, [items, activeId]);

  useEffect(() => {
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let winner: { id: string; ratio: number } | null = null;

        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.shortId;
          if (!id || !entry.isIntersecting) continue;
          if (!winner || entry.intersectionRatio > winner.ratio) {
            winner = { id, ratio: entry.intersectionRatio };
          }
        }

        if (winner && winner.ratio >= 0.6) {
          setActiveId(winner.id);
        }
      },
      {
        threshold: [0.35, 0.6, 0.8],
        root: scrollerRef.current,
        rootMargin: '0px'
      }
    );

    for (const item of items) {
      const node = containerRefs.current[item.id];
      if (!node) continue;
      node.dataset.shortId = item.id;
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    for (const item of items) {
      const video = videoRefs.current[item.id];
      if (!video) continue;

      if (item.id === activeId) {
        video.muted = muted;
        void video.play().catch(() => null);
      } else {
        video.pause();
      }
    }
  }, [activeId, items, muted]);

  useEffect(() => {
    if (!activeId || !items.length) return;

    const activeIndex = items.findIndex((item) => item.id === activeId);
    if (activeIndex < 0) return;

    if (activeIndex >= items.length - 2 && query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [activeId, items, query]);

  useEffect(() => {
    if (!activeId) return;
    const activeItem = items.find((item) => item.id === activeId);
    if (!activeItem) return;
    if (sentViewRef.current.has(activeItem.slug)) return;

    const timer = window.setTimeout(() => {
      sentViewRef.current.add(activeItem.slug);
      void fetch(`/api/shorts/${activeItem.slug}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watchedMs: 2000 }),
        keepalive: true
      });
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [activeId, items]);

  if (query.isLoading) {
    return (
      <div className="grid place-items-center rounded-[22px] border border-border bg-card px-4 py-16 text-primary shadow-card">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="rounded-[22px] border border-border bg-card p-5 text-[16px] text-primary/80 shadow-card">
        Не удалось загрузить shorts. Попробуйте обновить страницу.
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-[22px] border border-border bg-card p-5 text-[16px] text-primary/80 shadow-card">
        {translate(locale, 'shorts.empty')}
      </div>
    );
  }

  return (
    <div
      ref={scrollerRef}
      className="h-full space-y-4 overflow-y-auto overscroll-y-contain snap-y snap-mandatory scroll-smooth lg:mx-auto lg:max-w-[560px]"
    >
      {items.map((item) => (
        <ShortCard
          key={item.id}
          item={item}
          isActive={item.id === activeId}
          muted={muted}
          onToggleMuted={() => setMuted((prev) => !prev)}
          videoRef={(node) => {
            videoRefs.current[item.id] = node;
          }}
          containerRef={(node) => {
            containerRefs.current[item.id] = node;
          }}
          locale={locale}
        />
      ))}

      {query.isFetchingNextPage ? (
        <div className="flex items-center justify-center py-3 text-primary/70">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : null}
    </div>
  );
}
