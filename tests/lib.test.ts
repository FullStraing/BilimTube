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
