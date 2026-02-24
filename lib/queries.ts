import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const queryKeys = {
  featured: ['videos', 'featured'] as const,
  shorts: ['videos', 'shorts'] as const,
  categories: ['categories'] as const
};

export function useFeaturedVideos() {
  return useQuery({
    queryKey: queryKeys.featured,
    queryFn: api.getFeatured
  });
}

export function useShorts() {
  return useQuery({
    queryKey: queryKeys.shorts,
    queryFn: api.getShorts
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: api.getCategories
  });
}

