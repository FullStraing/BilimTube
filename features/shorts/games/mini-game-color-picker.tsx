'use client';

import type { Locale } from '@/lib/i18n/messages';
import { cn } from '@/lib/utils';
import type { ColorPickerGame } from '@/features/shorts/games/types';

export function ColorPickerGameCard({
  game,
  locale,
  onSolved,
  disabled
}: {
  game: ColorPickerGame;
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
                'min-h-[104px] rounded-[22px] border-4 border-white/75 shadow-sm transition active:scale-[0.98]',
                option.colorClassName,
                disabled && 'opacity-75'
              )}
              aria-label={option.label[locale]}
            >
              <span className="sr-only">{option.label[locale]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
