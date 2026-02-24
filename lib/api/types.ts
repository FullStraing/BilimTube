export type VideoSummary = {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  duration: string;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
};

