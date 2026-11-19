/**
 * Unit tests for the pure helpers in lib/ — no database, no network,
 * no test framework to install. Run with Node.js 22.6+ (type stripping):
 *
 *   node --test tests/lib.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { toTitleCase } from '../lib/text.ts';
import { formatDuration, formatViews } from '../lib/video-format.ts';
import {
  ENTERTAINMENT_CATEGORIES,
  localizeCategoryName,
} from '../lib/categories.ts';
import {
  buildVideoLanguageWhere,
  uiLocaleToVideoLanguage,
} from '../lib/video-language.ts';
import {
  localizeQuiz,
  localizeVideo,
  localizeVideoList,
} from '../lib/content-localization.ts';

describe('toTitleCase (lib/text.ts)', () => {
  it('capitalizes every word', () => {
    assert.equal(toTitleCase('hello world'), 'Hello World');
  });

  it('trims and collapses extra spaces', () => {
    assert.equal(toTitleCase('  spaced   out  '), 'Spaced Out');
  });

  it('handles Russian words', () => {
    assert.equal(toTitleCase('математика для детей'), 'Математика Для Детей');
  });

  it('capitalizes both parts of hyphenated words', () => {
    assert.equal(toTitleCase('well-known fact'), 'Well-Known Fact');
  });

  it('handles empty and single-letter input', () => {
    assert.equal(toTitleCase(''), '');
    assert.equal(toTitleCase('a'), 'A');
  });
});

describe('formatDuration (lib/video-format.ts)', () => {
  it('formats zero and sub-minute durations', () => {
    assert.equal(formatDuration(0), '0:00');
    assert.equal(formatDuration(59), '0:59');
  });

  it('pads single-digit seconds', () => {
    assert.equal(formatDuration(65), '1:05');
  });

  it('formats multi-minute durations', () => {
    assert.equal(formatDuration(600), '10:00');
    assert.equal(formatDuration(3600), '60:00');
  });
});

describe('formatViews (lib/video-format.ts)', () => {
  it('shows small counts as-is, in Russian by default', () => {
    assert.equal(formatViews(0), '0 просмотров');
    assert.equal(formatViews(999), '999 просмотров');
  });

  it('shortens thousands with K', () => {
    assert.equal(formatViews(1000), '1.0K просмотров');
    assert.equal(formatViews(1500), '1.5K просмотров');
  });

  it('shortens millions with M and respects the locale', () => {
    assert.equal(formatViews(2_500_000, 'en'), '2.5M views');
    assert.equal(formatViews(1500, 'ky'), '1.5K көрүүлөр');
  });
});

describe('localizeCategoryName (lib/categories.ts)', () => {
  it('translates known categories', () => {
    assert.equal(localizeCategoryName('Наука', 'en'), 'Science');
    assert.equal(localizeCategoryName('Наука', 'ky'), 'Илим');
    assert.equal(localizeCategoryName('Мультфильмы', 'en'), 'Cartoons');
  });

  it('returns the input unchanged for unknown categories', () => {
    assert.equal(localizeCategoryName('Неизвестная', 'en'), 'Неизвестная');
  });

  it('has a Russian label identical to the key for every category', () => {
    const known = [
      'Наука',
      'Математика',
      'Языки',
      'Искусство',
      'Музыка',
      'Спорт',
      'Мультфильмы',
      'Игры',
      'Творчество',
      'Природа',
      'Космос',
      'Биология',
      'Развлечения',
    ];
    for (const category of known) {
      assert.equal(localizeCategoryName(category, 'ru'), category);
    }
  });

  it('lists entertainment categories that exist in the labels', () => {
    for (const category of ENTERTAINMENT_CATEGORIES) {
      assert.notEqual(localizeCategoryName(category, 'en'), category);
    }
  });
});

describe('video language helpers (lib/video-language.ts)', () => {
  it('maps every UI locale to the matching video language', () => {
    assert.equal(uiLocaleToVideoLanguage('ru'), 'ru');
    assert.equal(uiLocaleToVideoLanguage('en'), 'en');
    assert.equal(uiLocaleToVideoLanguage('ky'), 'ky');
  });

  it('builds a Prisma where-clause from the locale', () => {
    assert.deepEqual(buildVideoLanguageWhere('en'), { language: 'en' });
    assert.deepEqual(buildVideoLanguageWhere('ky'), { language: 'ky' });
  });
});

describe('localizeVideo (lib/content-localization.ts)', () => {
  const solar = {
    slug: 'solar-system-for-kids',
    title: 'Как устроена Солнечная система',
    description: 'Узнаем о планетах, звездах и удивительных явлениях в космосе.',
    category: 'Космос',
  };

  it('translates a known video to English', () => {
    const localized = localizeVideo(solar, 'en');
    assert.equal(localized.title, 'How the Solar System Works');
    assert.equal(localized.description, 'Learn about planets, stars, and amazing space facts.');
    assert.equal(localized.category, 'Space');
    assert.equal(localized.slug, 'solar-system-for-kids');
  });

  it('returns the same video for Russian (the source locale)', () => {
    assert.equal(localizeVideo(solar, 'ru'), solar);
  });

  it('returns an unknown slug unchanged', () => {
    const unknown = { ...solar, slug: 'not-a-real-video' };
    assert.equal(localizeVideo(unknown, 'en'), unknown);
  });
});

describe('localizeVideoList (lib/content-localization.ts)', () => {
  it('localizes each video in the list', () => {
    const videos = [
      { slug: 'solar-system-for-kids', title: 'RU', description: 'RU', category: 'Космос' },
      { slug: 'unknown-video', title: 'RU', description: 'RU', category: 'Наука' },
    ];
    const localized = localizeVideoList(videos, 'en');
    assert.equal(localized[0].title, 'How the Solar System Works');
    assert.equal(localized[1], videos[1]);
    assert.notEqual(localized, videos);
  });
});

describe('localizeQuiz (lib/content-localization.ts)', () => {
  const quiz = {
    title: 'Викторина: Солнечная система',
    description: 'Проверь, что ты запомнил.',
    questions: [
      {
        id: 'q1', sortOrder: 1, text: 'Какая звезда в центре?',
        options: [
          { id: 'q1o1', sortOrder: 1, text: 'Луна' },
          { id: 'q1o2', sortOrder: 2, text: 'Солнце' },
          { id: 'q1o3', sortOrder: 3, text: 'Марс' },
          { id: 'q1o4', sortOrder: 4, text: 'Венера' },
        ],
      },
      { id: 'q2', sortOrder: 2, text: 'У какой планеты кольца?', options: [{ id: 'q2o1', sortOrder: 1, text: 'Сатурн' }] },
      { id: 'q3', sortOrder: 3, text: 'На какой планете мы живём?', options: [{ id: 'q3o1', sortOrder: 1, text: 'Земля' }] },
      { id: 'q4', sortOrder: 4, text: 'Без перевода', options: [{ id: 'q4o1', sortOrder: 1, text: 'Ответ' }] },
    ],
  };

  it('translates the quiz title, questions and options to English', () => {
    const localized = localizeQuiz('solar-system-for-kids', quiz, 'en');
    assert.equal(localized.title, 'Quiz: Solar System');
    assert.equal(localized.description, 'Check what you remember from the video.');
    assert.equal(localized.questions[0].text, 'Which star is in the center of the Solar System?');
    assert.deepEqual(localized.questions[0].options.map((o) => o.text), ['Moon', 'Sun', 'Mars', 'Венера']);
    assert.equal(localized.questions[1].text, 'Which planet is known for its rings?');
    assert.equal(localized.questions[2].text, 'Which planet do we live on?');
  });

  it('leaves questions without a translation untouched', () => {
    const localized = localizeQuiz('solar-system-for-kids', quiz, 'en');
    assert.equal(localized.questions[3], quiz.questions[3]);
  });

  it('returns the same quiz for Russian and for unknown slugs', () => {
    assert.equal(localizeQuiz('solar-system-for-kids', quiz, 'ru'), quiz);
    assert.equal(localizeQuiz('not-a-real-quiz', quiz, 'en'), quiz);
  });
});

