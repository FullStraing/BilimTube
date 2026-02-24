'use client';

import { useState } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

type Props = {
  videoId: string;
  videoSlug: string;
  initialIsFavorite: boolean;
};

export function VideoActions({ videoId, videoSlug, initialIsFavorite }: Props) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const handleFavorite = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      const response = await fetch(`/api/favorites/${videoId}/toggle`, {
        method: 'POST'
      });

      if (response.status === 401) {
        toast({
          title: 'РќСѓР¶РµРЅ РІС…РѕРґ',
          description: 'Р’РѕР№РґРёС‚Рµ РІ Р°РєРєР°СѓРЅС‚, С‡С‚РѕР±С‹ РґРѕР±Р°РІР»СЏС‚СЊ РІ РёР·Р±СЂР°РЅРЅРѕРµ.'
        });
        return;
      }

      if (!response.ok) {
        throw new Error('РќРµ СѓРґР°Р»РѕСЃСЊ РѕР±РЅРѕРІРёС‚СЊ РёР·Р±СЂР°РЅРЅРѕРµ');
      }

      const result = (await response.json()) as { isFavorite: boolean };
      setIsFavorite(result.isFavorite);
    } catch {
      toast({
        title: 'РћС€РёР±РєР°',
        description: 'РќРµ СѓРґР°Р»РѕСЃСЊ РѕР±РЅРѕРІРёС‚СЊ РёР·Р±СЂР°РЅРЅРѕРµ.'
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
        title: 'РЎСЃС‹Р»РєР° СЃРєРѕРїРёСЂРѕРІР°РЅР°',
        description: 'РћС‚РїСЂР°РІСЊС‚Рµ РµРµ С‚РѕРјСѓ, СЃ РєРµРј С…РѕС‚РёС‚Рµ РїРѕРґРµР»РёС‚СЊСЃСЏ РІРёРґРµРѕ.'
      });
    } catch {
      toast({
        title: 'РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕРґРµР»РёС‚СЊСЃСЏ',
        description: 'РџРѕРїСЂРѕР±СѓР№С‚Рµ СЃРЅРѕРІР°.'
      });
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleFavorite}
        disabled={isPending}
        className={cn(
          'grid h-14 w-14 place-items-center rounded-[18px] transition',
          isFavorite ? 'bg-primary text-white hover:brightness-110' : 'bg-secondary text-primary hover:brightness-95',
          isPending && 'opacity-70',
        )}
        aria-label="Р”РѕР±Р°РІРёС‚СЊ РІ РёР·Р±СЂР°РЅРЅРѕРµ"
      >
        <Heart className={cn('h-6 w-6', isFavorite && 'fill-current')} />
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="grid h-14 w-14 place-items-center rounded-[18px] bg-secondary text-primary transition hover:brightness-95"
        aria-label="РџРѕРґРµР»РёС‚СЊСЃСЏ"
      >
        <Share2 className="h-6 w-6" />
      </button>
    </div>
  );
}

