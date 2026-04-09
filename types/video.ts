export type VideoListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  language?: 'ru' | 'en' | 'ky';
  ageGroup: string;
  thumbnailUrl: string;
  durationSec: number;
  viewsCount: number;
  contentType?: 'LONG' | 'SHORT';
  isFavorite?: boolean;
};

export type VideoDetails = VideoListItem & {
  videoUrl: string;
};

export type FavoriteItem = {
  id: string;
  createdAt: string;
  video: VideoListItem;
};
