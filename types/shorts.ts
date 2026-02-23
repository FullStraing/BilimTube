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
