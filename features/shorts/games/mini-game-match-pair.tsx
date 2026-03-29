'use client';

import type { Locale } from '@/lib/i18n/messages';
import { cn } from '@/lib/utils';
import type { MatchPairGame } from '@/features/shorts/games/types';

export function MatchPairGameCard({
  game,
  locale,
  onSolved,
  disabled
}: {
  game: MatchPairGame;
  locale: Locale;
  onSolved: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <p className="text-[16px] font-semibold text-primary/70">{game.prompt[locale]}</p>

      <div className="mt-4 rounded-[22px] bg-white px-5 py-4 shadow-sm">
        <p className="text-center text-[30px] font-extrabold text-primary">
          {game.left.text ? game.left.text[locale] : game.left.emoji}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {game.options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (option.correct) onSolved();
            }}
            className={cn(
              'flex min-h-[116px] flex-col items-center justify-center rounded-[20px] bg-white p-3 text-primary shadow-sm transition active:scale-[0.98]',
              disabled && 'opacity-75'
            )}
          >
            {option.emoji ? <span className="text-[48px] leading-none">{option.emoji}</span> : null}
            {option.text ? <span className="mt-2 text-[15px] font-bold">{option.text[locale]}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
