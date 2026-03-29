'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

type CategoryChip = {
  name: string;
  count: number;
  href: Route;
  active: boolean;
};

export function CategoryChipSlider({
  categories,
  allLabel
}: {
  categories: CategoryChip[];
  allLabel: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (direction: 'left' | 'right') => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.min(320, node.clientWidth * 0.8);
    node.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-border bg-card/95 p-3 shadow-card sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => scrollByAmount('left')}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background/95 text-primary shadow-sm transition hover:bg-secondary"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-card via-card/90 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-card via-card/90 to-transparent" />

          <div
            ref={scrollerRef}
            onWheel={(event) => {
              const node = scrollerRef.current;
              if (!node) return;
              if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
              event.preventDefault();
              node.scrollBy({ left: event.deltaY, behavior: 'auto' });
            }}
            className="no-scrollbar flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto px-1 py-1 scroll-smooth"
          >
            <Link
              href={'/search' as Route}
              className="inline-flex h-11 shrink-0 snap-start items-center rounded-full bg-secondary px-4 text-[14px] font-semibold text-secondary-foreground transition hover:bg-accent"
            >
              {allLabel}
            </Link>

            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`inline-flex h-11 shrink-0 snap-start items-center rounded-full px-4 text-[14px] font-semibold transition ${
                  category.active
                    ? 'bg-primary text-white shadow-[0_10px_22px_rgba(15,78,107,0.2)]'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                <span className="truncate">{category.name}</span>
                <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[11px] ${category.active ? 'bg-white/16 text-white/90' : 'bg-white/70 text-primary/70'}`}>
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => scrollByAmount('right')}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background/95 text-primary shadow-sm transition hover:bg-secondary"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
