'use client';

import { useState } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { useLocale } from '@/components/i18n/locale-provider';
import { useToast } from '@/components/ui/use-toast';
import { translate } from '@/lib/i18n/messages';
import { cn } from '@/lib/utils';

type Props = {
  videoId: string;
  videoSlug: string;
  initialIsFavorite: boolean;
  allowFavorite?: boolean;
};

export function VideoActions({ videoId, videoSlug, initialIsFavorite, allowFavorite = true }: Props) {
  const locale = useLocale();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const handleFavorite = async () => {
    if (!allowFavorite) return;
    if (isPending) return;
    setIsPending(true);
    try {
      const response = await fetch(`/api/favorites/${videoId}/toggle`, {
        method: 'POST'
      });

      if (response.status === 401) {
        toast({
          title: translate(locale, 'video.needLoginTitle'),
          description: translate(locale, 'video.needLoginDescription')
        });
        return;
      }

      if (!response.ok) {
        throw new Error(translate(locale, 'video.favoriteUpdateFailed'));
      }

      const result = (await response.json()) as { isFavorite: boolean };
      setIsFavorite(result.isFavorite);
    } catch {
      toast({
        title: translate(locale, 'quiz.errorTitle'),
        description: translate(locale, 'video.favoriteUpdateFailed')
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/video/${videoSlug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'BilimTube',
          url: shareUrl
        });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: translate(locale, 'video.shareCopiedTitle'),
        description: translate(locale, 'video.shareCopiedDescription')
      });
    } catch {
      toast({
        title: translate(locale, 'video.shareFailedTitle'),
        description: translate(locale, 'video.shareFailedDescription')
      });
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleFavorite}
        disabled={isPending || !allowFavorite}
        className={cn(
          'grid h-14 w-14 place-items-center rounded-[18px] transition',
          isFavorite ? 'bg-primary text-white hover:brightness-110' : 'bg-secondary text-primary hover:brightness-95',
          isPending && 'opacity-70',
          !allowFavorite && 'cursor-not-allowed opacity-50 hover:brightness-100'
        )}
        aria-label={translate(locale, 'video.favoriteAria')}
      >
        <Heart className={cn('h-6 w-6', isFavorite && 'fill-current')} />
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="grid h-14 w-14 place-items-center rounded-[18px] bg-secondary text-primary transition hover:brightness-95"
        aria-label={translate(locale, 'video.shareAria')}
      >
        <Share2 className="h-6 w-6" />
      </button>
    </div>
  );
}
