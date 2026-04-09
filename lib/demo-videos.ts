import type { Locale } from '@/lib/i18n/messages';
import { localizeVideo, localizeVideoList } from '@/lib/content-localization';

export type DemoVideo = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  language: 'ru' | 'en' | 'ky';
  ageGroup: string;
  thumbnailUrl: string;
  videoUrl: string;
  contentType: 'LONG';
  durationSec: number;
  viewsCount: number;
};

const demoLongVideos: DemoVideo[] = [
  {
    id: 'demo-solar-system',
    slug: 'solar-system-for-kids',
    title: 'Как устроена Солнечная система',
    description: 'Узнаем о планетах, звездах и удивительных явлениях в космосе.',
    category: 'Космос',
    language: 'ru',
    ageGroup: '4-6',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    contentType: 'LONG',
    durationSec: 420,
    viewsCount: 12500
  },
  {
    id: 'demo-dinosaurs',
    slug: 'dinosaur-world',
    title: 'Динозавры: кто они и как жили',
    description: 'Древний мир динозавров простыми словами.',
    category: 'Наука',
    language: 'ru',
    ageGroup: '7-9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547700055-b61cacebece9?w=1200&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    contentType: 'LONG',
    durationSec: 480,
    viewsCount: 9800
  },
  {
    id: 'demo-english-alphabet',
    slug: 'fun-english-alphabet',
    title: 'Английский алфавит: весело учим',
    description: 'Учимся читать буквы и слова вместе.',
    category: 'Языки',
    language: 'ru',
    ageGroup: '4-6',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    contentType: 'LONG',
    durationSec: 360,
    viewsCount: 22300
  },
  {
    id: 'demo-human-body',
    slug: 'human-body-basics',
    title: 'Как работает наш организм',
    description: 'Интересные факты о теле человека.',
    category: 'Биология',
    language: 'ru',
    ageGroup: '7-9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=1200&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    contentType: 'LONG',
    durationSec: 600,
    viewsCount: 15400
  },
  {
    id: 'demo-nature',
    slug: 'nature-adventure',
    title: 'Путешествие в мир природы',
    description: 'Животные, леса и океаны для детей.',
    category: 'Природа',
    language: 'ru',
    ageGroup: '4-6',
    thumbnailUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    contentType: 'LONG',
    durationSec: 540,
    viewsCount: 8700
  }
];

export function getDemoLongVideos(locale: Locale) {
  return localizeVideoList(demoLongVideos, locale);
}

export function getFilteredDemoLongVideos(
  locale: Locale,
  filters: {
    q?: string | null;
    category?: string | null;
    ageGroup?: string | null;
    limit?: number;
  } = {}
) {
  const q = filters.q?.trim().toLowerCase();

  let items = getDemoLongVideos(locale);

  if (filters.category) {
    items = items.filter((video) => video.category === filters.category);
  }

  if (filters.ageGroup) {
    items = items.filter((video) => video.ageGroup === filters.ageGroup);
  }

  if (q) {
    items = items.filter((video) => {
      const haystack = `${video.title} ${video.description} ${video.category}`.toLowerCase();
      return haystack.includes(q);
    });
  }

  if (filters.limit) {
    items = items.slice(0, filters.limit);
  }

  return items;
}

export function getDemoLongVideoBySlug(slug: string, locale: Locale) {
  const video = demoLongVideos.find((item) => item.slug === slug);
  return video ? localizeVideo(video, locale) : null;
}

export function getDemoLongCategoryCounts(locale: Locale) {
  const items = getDemoLongVideos(locale);
  const counts = new Map<string, number>();

  for (const video of items) {
    counts.set(video.category, (counts.get(video.category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0], undefined, { sensitivity: 'base' }))
    .map(([name, count]) => ({ name, count }));
}

export function getSimilarDemoLongVideos(slug: string, locale: Locale, limit = 8) {
  const current = demoLongVideos.find((item) => item.slug === slug);
  if (!current) return [];

  const localized = getDemoLongVideos(locale);

  return localized
    .filter((item) => item.slug !== slug)
    .filter((item) => item.category === current.category || item.ageGroup === current.ageGroup)
    .slice(0, limit);
}
