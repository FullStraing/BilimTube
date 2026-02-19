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
      className="block overflow-hidden rounded-[22px] border border-border bg-card shadow-card transition hover:brightness-[0.99]"
    >
      <div className="relative h-52 bg-muted sm:h-56 lg:h-52 2xl:h-56">
        <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" sizes="100vw" />
        <div className="absolute right-3 top-3 rounded-full bg-[#0AC95E] px-3 py-1 text-[16px] font-bold leading-none text-white lg:text-[18px]">
          {video.ageGroup}
        </div>
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[15px] font-semibold text-white lg:text-[16px]">
          <Clock3 className="h-4 w-4" />
          {formatDuration(video.durationSec)}
        </div>
      </div>
      <div className="space-y-1 p-4 lg:p-5">
        <h3 className="text-[32px] font-bold leading-tight text-primary lg:text-[26px]">{video.title}</h3>
        <p className="line-clamp-2 text-[21px] text-primary/90 lg:text-[18px]">{video.description}</p>
        <p className="text-[20px] text-primary/85 lg:text-[17px]">
          {formatViews(video.viewsCount)} • {video.category}
        </p>
      </div>
    </Link>
  );
}
