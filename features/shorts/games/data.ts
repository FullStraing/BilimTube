'use client';

import type { Locale } from '@/lib/i18n/messages';
import type { GameFeedItem, MiniGameData } from '@/features/shorts/games/types';
import type { ShortsItem } from '@/types/shorts';

const GAME_FREQUENCY_MIN = 5;
const GAME_FREQUENCY_MAX = 9;

const gameLibrary: MiniGameData[] = [
  {
    type: 'word-finder',
    prompt: {
      ru: 'Найди слово',
      en: 'Find the word',
      ky: 'Сөздү тап'
    },
    target: {
      ru: 'Космос',
      en: 'Space',
      ky: 'Космос'
    },
    options: {
      ru: ['Музыка', 'Космос', 'Спорт', 'Море', 'Наука', 'Лес'],
      en: ['Music', 'Space', 'Sports', 'Ocean', 'Science', 'Forest'],
      ky: ['Музыка', 'Космос', 'Спорт', 'Деңиз', 'Илим', 'Токой']
    }
  },
  {
    type: 'picture-finder',
    prompt: {
      ru: 'Где планета?',
      en: 'Where is the planet?',
      ky: 'Планета кайда?'
    },
    target: 'planet',
    options: [
      { id: 'planet', emoji: '🪐', label: { ru: 'Планета', en: 'Planet', ky: 'Планета' } },
      { id: 'leaf', emoji: '🍃', label: { ru: 'Лист', en: 'Leaf', ky: 'Жалбырак' } },
      { id: 'note', emoji: '🎵', label: { ru: 'Нота', en: 'Note', ky: 'Нота' } },
      { id: 'ball', emoji: '⚽', label: { ru: 'Мяч', en: 'Ball', ky: 'Топ' } }
    ]
  },
  {
    type: 'color-picker',
    prompt: {
      ru: 'Нажми на синий цвет',
      en: 'Tap the blue color',
      ky: 'Көк түстү бас'
    },
    target: 'blue',
    options: [
      { id: 'yellow', colorClassName: 'bg-[#FFD84D]', label: { ru: 'Желтый', en: 'Yellow', ky: 'Сары' } },
      { id: 'blue', colorClassName: 'bg-[#4EA8FF]', label: { ru: 'Синий', en: 'Blue', ky: 'Көк' } },
      { id: 'green', colorClassName: 'bg-[#42D392]', label: { ru: 'Зеленый', en: 'Green', ky: 'Жашыл' } },
      { id: 'pink', colorClassName: 'bg-[#FF7BB5]', label: { ru: 'Розовый', en: 'Pink', ky: 'Кызгылт' } }
    ]
  },
  {
    type: 'catch-object',
    prompt: {
      ru: 'Поймай звезду',
      en: 'Catch the star',
      ky: 'Жылдызды карма'
    },
    target: 'star',
    objects: [
      { id: 'star', emoji: '⭐', top: '16%', left: '18%', delayMs: 0, durationMs: 2600 },
      { id: 'moon', emoji: '🌙', top: '28%', left: '68%', delayMs: 250, durationMs: 2900 },
      { id: 'ball', emoji: '⚽', top: '58%', left: '20%', delayMs: 500, durationMs: 2400 },
      { id: 'heart', emoji: '💚', top: '62%', left: '68%', delayMs: 100, durationMs: 2800 }
    ]
  },
  {
    type: 'match-pair',
    prompt: {
      ru: 'Выбери пару для слова',
      en: 'Pick the matching pair',
      ky: 'Туура жупту тап'
    },
    left: {
      text: {
        ru: 'Кошка',
        en: 'Cat',
        ky: 'Мышык'
      }
    },
    options: [
      { id: 'cat', emoji: '🐱', correct: true },
      { id: 'dog', emoji: '🐶', correct: false },
      { id: 'fish', emoji: '🐟', correct: false }
    ]
  }
];

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function getGameFeedback(locale: Locale) {
  switch (locale) {
    case 'en':
      return ['Great!', 'Correct!', 'Awesome!'];
    case 'ky':
      return ['Сонун!', 'Туура!', 'Азамат!'];
    default:
      return ['Отлично!', 'Верно!', 'Супер!'];
  }
}

export function insertGamesIntoShorts(items: ShortsItem[]): Array<ShortsItem | GameFeedItem> {
  if (!items.length) return [];

  const result: Array<ShortsItem | GameFeedItem> = [];
  const seed = hashString(items[0]?.slug ?? 'shorts-feed');
  let nextGameAfter = GAME_FREQUENCY_MIN + (seed % (GAME_FREQUENCY_MAX - GAME_FREQUENCY_MIN + 1));
  let gameCount = 0;
  let videosSinceLastGame = 0;

  for (const item of items) {
    result.push(item);
    videosSinceLastGame += 1;

    if (videosSinceLastGame < nextGameAfter) {
      continue;
    }

    const boundarySeed = hashString(`${item.slug}:${gameCount}`);
    const game = gameLibrary[boundarySeed % gameLibrary.length];
    result.push({
      id: `game-${item.id}-${gameCount + 1}`,
      kind: 'game',
      game
    });

    gameCount += 1;
    videosSinceLastGame = 0;
    nextGameAfter = GAME_FREQUENCY_MIN + (boundarySeed % (GAME_FREQUENCY_MAX - GAME_FREQUENCY_MIN + 1));
  }

  return result;
}
