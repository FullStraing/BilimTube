import { apiFetch } from './fetcher';
import type { Category, VideoSummary } from './types';

export const api = {
  getFeatured: () => apiFetch<VideoSummary[]>('/videos/featured'),
  getShorts: () => apiFetch<VideoSummary[]>('/videos/shorts'),
  getCategories: () => apiFetch<Category[]>('/categories')
};
