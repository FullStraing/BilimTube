'use client';

import type { Locale } from '@/lib/i18n/messages';
import { cn } from '@/lib/utils';
import type { WordFinderGame } from '@/features/shorts/games/types';

export function WordFinderGameCard({
  game,
  locale,
  onSolved,
  disabled
}: {
  game: WordFinderGame;
  locale: Locale;
  onSolved: () => void;
  disabled: boolean;
}) {
  const target = game.target[locale];

  return (
    <div className="flex h-full flex-col">
      <p className="text-[16px] font-semibold text-primary/70">{game.prompt[locale]}</p>
      <h3 className="mt-1 text-[32px] font-extrabold leading-tight text-primary">{target}</h3>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {game.options[locale].map((option) => {
          const correct = option === target;

          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (correct) onSolved();
              }}
              className={cn(
                'rounded-[18px] bg-white px-4 py-4 text-[18px] font-bold text-primary shadow-sm transition active:scale-[0.98]',
                !disabled && 'hover:bg-white/90',
                disabled && 'opacity-75'
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
