export function formatDuration(durationSec: number) {
  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatViews(viewsCount: number) {
  if (viewsCount >= 1_000_000) {
    return `${(viewsCount / 1_000_000).toFixed(1)}M просмотров`;
  }
  if (viewsCount >= 1_000) {
    return `${(viewsCount / 1_000).toFixed(1)}K просмотров`;
  }
  return `${viewsCount} просмотров`;
}

