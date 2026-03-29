export type ShortsItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  ageGroup: string;
  thumbnailUrl: string;
  videoUrl: string;
  durationSec: number;
  viewsCount: number;
  isFavorite: boolean;
};

export type ShortsResponse = {
  items: ShortsItem[];
  nextCursor: string | null;
};

export function isShortsItem(value: ShortsItem | { kind?: string }): value is ShortsItem {
  return !('kind' in value);
}
