export type VideoListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  ageGroup: string;
  thumbnailUrl: string;
  durationSec: number;
  viewsCount: number;
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
