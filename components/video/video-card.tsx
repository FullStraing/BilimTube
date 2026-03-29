import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock3 } from 'lucide-react';
import { formatDuration, formatViews } from '@/lib/video-format';
import type { VideoListItem } from '@/types/video';

type Props = {
  video: VideoListItem;
  priority?: boolean;
};

export function VideoCard({ video }: Props) {
  return (
    <Link
      href={`/video/${video.slug}` as Route}
      className="group block w-full max-w-[380px] overflow-hidden rounded-[24px] border border-border bg-card shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,78,107,0.14)]"
    >
      <div className="relative aspect-[16/10] w-full bg-muted">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
        <div className="absolute right-3 top-3 rounded-full bg-[#0AC95E] px-3 py-1 text-[12px] font-bold leading-none text-white sm:text-[13px]">
          {video.ageGroup}
        </div>
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[12px] font-semibold text-white sm:text-[13px]">
          <Clock3 className="h-4 w-4" />
          {formatDuration(video.durationSec)}
        </div>
      </div>
      <div className="space-y-2.5 p-4">
        <div className="inline-flex rounded-full bg-secondary px-3 py-1 text-[12px] font-semibold text-primary/85">{video.category}</div>
        <h3 className="line-clamp-2 text-[20px] font-bold leading-tight text-primary sm:text-[22px]">{video.title}</h3>
        <p className="line-clamp-2 text-[14px] leading-6 text-primary/85 sm:text-[15px]">{video.description}</p>
        <p className="text-[13px] text-primary/72 sm:text-[14px]">{formatViews(video.viewsCount)}</p>
      </div>
    </Link>
  );
}

