'use client';

import type { Locale } from '@/lib/i18n/messages';
import { cn } from '@/lib/utils';
import type { PictureFinderGame } from '@/features/shorts/games/types';

export function PictureFinderGameCard({
  game,
  locale,
  onSolved,
  disabled
}: {
  game: PictureFinderGame;
  locale: Locale;
  onSolved: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <p className="text-[16px] font-semibold text-primary/70">{game.prompt[locale]}</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {game.options.map((option) => {
          const correct = option.id === game.target;

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (correct) onSolved();
              }}
              className={cn(
                'flex min-h-[132px] flex-col items-center justify-center rounded-[22px] bg-white p-4 text-primary shadow-sm transition active:scale-[0.98]',
                !disabled && 'hover:bg-white/90',
                disabled && 'opacity-75'
              )}
            >
              <span className="text-[52px] leading-none">{option.emoji}</span>
              <span className="mt-3 text-[16px] font-bold">{option.label[locale]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
