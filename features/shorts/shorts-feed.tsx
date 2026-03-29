'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Check, ChevronDown, Loader2, Volume2, VolumeX, X } from 'lucide-react';
import { useLocale } from '@/components/i18n/locale-provider';
import { localizeVideoList } from '@/lib/content-localization';
import { translate } from '@/lib/i18n/messages';
import { formatDuration, formatViews } from '@/lib/video-format';
import type { ShortsItem, ShortsResponse } from '@/types/shorts';

const PAGE_SIZE = 5;

type CategoryItem = {
  name: string;
  count: number;
};

async function fetchShorts(categories: string[], cursor?: string) {
  const params = new URLSearchParams({ take: String(PAGE_SIZE) });

  if (cursor) params.set('cursor', cursor);
  for (const category of categories) {
    params.append('category', category);
  }

  const response = await fetch(`/api/shorts?${params.toString()}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to load shorts');
  }

  return (await response.json()) as ShortsResponse;
}

async function fetchShortCategories() {
  const response = await fetch('/api/videos/categories?contentType=SHORT', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to load short categories');
  }

  return (await response.json()) as CategoryItem[];
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
            aria-label={muted ? translate(locale, 'shorts.unmute') : translate(locale, 'shorts.mute')}
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const sentViewRef = useRef<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ['shorts-categories'],
    queryFn: fetchShortCategories
  });

  const query = useInfiniteQuery({
    queryKey: ['shorts-feed', [...selectedCategories].sort()],
    queryFn: ({ pageParam }) => fetchShorts([...selectedCategories].sort(), pageParam || undefined),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
  });

  const rawItems = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  const items = useMemo(() => localizeVideoList(rawItems, locale), [rawItems, locale]);
  const categories = categoriesQuery.data ?? [];
  const normalizedSelectedCategories = useMemo(() => [...selectedCategories].sort(), [selectedCategories]);

  const selectedLabel = useMemo(() => {
    if (!normalizedSelectedCategories.length) {
      return translate(locale, 'home.allCategories');
    }

    if (normalizedSelectedCategories.length === 1) {
      return normalizedSelectedCategories[0];
    }

    return `${normalizedSelectedCategories.length} ${translate(locale, 'shorts.categoriesSelected')}`;
  }, [locale, normalizedSelectedCategories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveId(null);
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [normalizedSelectedCategories]);

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

    const viewKey = `${normalizedSelectedCategories.join('|')}:${activeItem.slug}`;
    if (sentViewRef.current.has(viewKey)) return;

    const timer = window.setTimeout(() => {
      sentViewRef.current.add(viewKey);
      void fetch(`/api/shorts/${activeItem.slug}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watchedMs: 2000 }),
        keepalive: true
      });
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [activeId, items, normalizedSelectedCategories]);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((current) =>
      current.includes(categoryName) ? current.filter((item) => item !== categoryName) : [...current, categoryName]
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <section className="rounded-[22px] border border-border bg-card px-4 py-3 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-primary/65">{translate(locale, 'categories.title')}</p>
            <p className="truncate text-[16px] font-semibold text-primary">{selectedLabel}</p>
          </div>

          <div ref={menuRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-[14px] font-semibold text-primary shadow-sm transition hover:bg-secondary"
            >
              <span className="max-w-[150px] truncate">{selectedLabel}</span>
              <ChevronDown className={`h-4 w-4 transition ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMenuOpen ? (
              <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-[280px] rounded-[20px] border border-border bg-card p-3 shadow-[0_20px_50px_rgba(15,78,107,0.18)]">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[14px] font-semibold text-primary">{translate(locale, 'home.allCategories')}</p>
                  {normalizedSelectedCategories.length ? (
                    <button
                      type="button"
                      onClick={() => setSelectedCategories([])}
                      className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary/70 transition hover:text-primary"
                    >
                      <X className="h-3.5 w-3.5" />
                      {translate(locale, 'shorts.clearFilters')}
                    </button>
                  ) : null}
                </div>

                <div className="no-scrollbar max-h-[280px] space-y-1 overflow-y-auto pr-1">
                  {categoriesQuery.isLoading ? (
                    <div className="flex items-center justify-center py-6 text-primary/70">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : (
                    categories.map((category) => {
                      const checked = normalizedSelectedCategories.includes(category.name);

                      return (
                        <button
                          key={category.name}
                          type="button"
                          onClick={() => toggleCategory(category.name)}
                          className={`flex w-full items-center justify-between rounded-[14px] px-3 py-2.5 text-left transition ${
                            checked ? 'bg-primary text-white' : 'bg-secondary text-secondary-foreground hover:bg-accent'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-semibold">{category.name}</p>
                            <p className={`text-[12px] ${checked ? 'text-white/75' : 'text-primary/65'}`}>{category.count}</p>
                          </div>
                          <span
                            className={`ml-3 inline-flex h-5 w-5 items-center justify-center rounded-full ${
                              checked ? 'bg-white/18 text-white' : 'border border-primary/15 bg-white text-transparent'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {query.isLoading ? (
        <div className="grid flex-1 place-items-center rounded-[22px] border border-border bg-card px-4 py-16 text-primary shadow-card">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : query.isError ? (
        <div className="rounded-[22px] border border-border bg-card p-5 text-[16px] text-primary/80 shadow-card">
          {translate(locale, 'shorts.loadError')}
        </div>
      ) : !items.length ? (
        <div className="rounded-[22px] border border-border bg-card p-5 text-[16px] text-primary/80 shadow-card">
          {translate(locale, 'shorts.empty')}
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="flex-1 space-y-4 overflow-y-auto overscroll-y-contain snap-y snap-mandatory scroll-smooth lg:mx-auto lg:max-w-[560px]"
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
      )}
    </div>
  );
}
