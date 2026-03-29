'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { translate } from '@/lib/i18n/messages';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n/messages';
import { getGameFeedback } from '@/features/shorts/games/data';
import { CatchObjectGameCard } from '@/features/shorts/games/mini-game-catch-object';
import { ColorPickerGameCard } from '@/features/shorts/games/mini-game-color-picker';
import { MatchPairGameCard } from '@/features/shorts/games/mini-game-match-pair';
import { PictureFinderGameCard } from '@/features/shorts/games/mini-game-picture-finder';
import { WordFinderGameCard } from '@/features/shorts/games/mini-game-word-finder';
import type { MiniGameData } from '@/features/shorts/games/types';

type Props = {
  game: MiniGameData;
  locale: Locale;
  isActive: boolean;
  onAdvance: () => void;
};

export function GameShortCard({ game, locale, isActive, onAdvance }: Props) {
  const [solved, setSolved] = useState(false);
  const feedbackList = useMemo(() => getGameFeedback(locale), [locale]);
  const feedback = useMemo(() => feedbackList[(game.type.length + feedbackList.length) % feedbackList.length], [feedbackList, game.type]);

  useEffect(() => {
    if (!solved || !isActive) return;

    const timeout = window.setTimeout(() => {
      onAdvance();
      setSolved(false);
    }, 950);

    return () => window.clearTimeout(timeout);
  }, [isActive, onAdvance, solved]);

  useEffect(() => {
    if (!isActive) {
      setSolved(false);
    }
  }, [isActive]);

  const handleSolved = () => {
    if (!solved) {
      setSolved(true);
    }
  };

  return (
    <article className="relative h-full overflow-hidden rounded-[24px] border border-border bg-[linear-gradient(180deg,#EAF7FF_0%,#D5F0FF_48%,#C9E8FF_100%)] shadow-card">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_58%)]" />
      <div className="relative flex h-full flex-col p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-[12px] font-bold text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {translate(locale, 'shorts.gameBadge')}
            </div>
          </div>
          <div className="rounded-full bg-primary px-3 py-1 text-[12px] font-bold text-white">
            {translate(locale, 'shorts.gameDuration')}
          </div>
        </div>

        <div className="flex-1">
          {game.type === 'word-finder' ? <WordFinderGameCard game={game} locale={locale} onSolved={handleSolved} disabled={solved} /> : null}
          {game.type === 'picture-finder' ? <PictureFinderGameCard game={game} locale={locale} onSolved={handleSolved} disabled={solved} /> : null}
          {game.type === 'color-picker' ? <ColorPickerGameCard game={game} locale={locale} onSolved={handleSolved} disabled={solved} /> : null}
          {game.type === 'catch-object' ? <CatchObjectGameCard game={game} locale={locale} onSolved={handleSolved} disabled={solved} /> : null}
          {game.type === 'match-pair' ? <MatchPairGameCard game={game} locale={locale} onSolved={handleSolved} disabled={solved} /> : null}
        </div>

        <div
          className={cn(
            'pointer-events-none absolute inset-0 flex items-center justify-center bg-primary/14 opacity-0 transition duration-300',
            solved && 'opacity-100'
          )}
        >
          <div className="rounded-[22px] bg-white/95 px-6 py-4 text-center shadow-[0_18px_40px_rgba(15,78,107,0.2)]">
            <p className="text-[28px] font-extrabold text-primary">{feedback}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
