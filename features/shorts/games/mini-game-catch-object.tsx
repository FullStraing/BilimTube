'use client';

import type { Locale } from '@/lib/i18n/messages';
import { cn } from '@/lib/utils';
import type { CatchObjectGame } from '@/features/shorts/games/types';

export function CatchObjectGameCard({
  game,
  locale,
  onSolved,
  disabled
}: {
  game: CatchObjectGame;
  locale: Locale;
  onSolved: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <p className="text-[16px] font-semibold text-primary/70">{game.prompt[locale]}</p>

      <div className="relative mt-5 min-h-[320px] flex-1 overflow-hidden rounded-[24px] bg-white/65">
        {game.objects.map((object) => {
          const correct = object.id === game.target;

          return (
            <button
              key={object.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (correct) onSolved();
              }}
              className={cn(
                'absolute grid h-20 w-20 place-items-center rounded-full bg-white text-[38px] shadow-[0_10px_24px_rgba(15,78,107,0.16)] transition active:scale-[0.96]',
                disabled && 'opacity-75'
              )}
              style={{
                top: object.top,
                left: object.left,
                animation: `shorts-float ${object.durationMs}ms ease-in-out ${object.delayMs}ms infinite alternate`
              }}
            >
              <span>{object.emoji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
