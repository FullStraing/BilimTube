import type { Locale } from '@/lib/i18n/messages';

export const ENTERTAINMENT_CATEGORIES = ['Мультфильмы', 'Игры', 'Творчество'] as const;

const categoryLabels: Record<string, Record<Locale, string>> = {
  'Наука': { ru: 'Наука', en: 'Science', ky: 'Илим' },
  'Математика': { ru: 'Математика', en: 'Math', ky: 'Математика' },
  'Языки': { ru: 'Языки', en: 'Languages', ky: 'Тилдер' },
  'Искусство': { ru: 'Искусство', en: 'Art', ky: 'Искусство' },
  'Музыка': { ru: 'Музыка', en: 'Music', ky: 'Музыка' },
  'Спорт': { ru: 'Спорт', en: 'Sports', ky: 'Спорт' },
  'Мультфильмы': { ru: 'Мультфильмы', en: 'Cartoons', ky: 'Мультфильмдер' },
  'Игры': { ru: 'Игры', en: 'Games', ky: 'Оюндар' },
  'Творчество': { ru: 'Творчество', en: 'Creativity', ky: 'Чыгармачылык' },
  'Природа': { ru: 'Природа', en: 'Nature', ky: 'Жаратылыш' },
  'Космос': { ru: 'Космос', en: 'Space', ky: 'Космос' },
  'Биология': { ru: 'Биология', en: 'Biology', ky: 'Биология' },
  'Развлечения': { ru: 'Развлечения', en: 'Entertainment', ky: 'Көңүл ачуу' }
};

export function localizeCategoryName(category: string, locale: Locale) {
  return categoryLabels[category]?.[locale] ?? category;
}
