"use client";

import Image from 'next/image';
import { useMemo, useState } from 'react';

type AdaptiveVideoPlayerProps = {
  src: string;
  poster: string;
  isLikelyShort?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  className?: string;
};

export function AdaptiveVideoPlayer({
  src,
  poster,
  isLikelyShort = false,
  autoPlay = true,
  controls = true,
  playsInline = true,
  className = ''
}: AdaptiveVideoPlayerProps) {
  const [ratio, setRatio] = useState(isLikelyShort ? 9 / 16 : 16 / 9);
  const [isPortrait, setIsPortrait] = useState(isLikelyShort);

  const aspectRatio = useMemo(() => `${ratio}`, [ratio]);

  return (
    <div className={`relative overflow-hidden rounded-[22px] ${isPortrait ? 'bg-slate-950' : 'bg-black'} ${className}`.trim()}>
      {isPortrait ? (
        <div className="relative flex min-h-[560px] items-center justify-center bg-slate-950 sm:min-h-[640px] lg:min-h-[720px]">
          <Image
            src={poster}
            alt=""
            fill
            aria-hidden="true"
            className="object-cover opacity-30 blur-2xl scale-110"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%),linear-gradient(180deg,rgba(7,24,35,0.12)_0%,rgba(7,24,35,0.78)_100%)]" />
          <div className="relative z-10 flex h-full w-full items-center justify-center px-3 py-4 sm:px-4">
            <div
              className="relative w-full max-w-[420px] overflow-hidden rounded-[22px] bg-black shadow-[0_26px_60px_rgba(0,0,0,0.34)]"
              style={{ aspectRatio }}
            >
              <video
                autoPlay={autoPlay}
                playsInline={playsInline}
                preload="metadata"
                controls={controls}
                poster={poster}
                className="h-full w-full object-contain"
                onLoadedMetadata={(event) => {
                  const { videoWidth, videoHeight } = event.currentTarget;
                  if (!videoWidth || !videoHeight) return;
                  setRatio(videoWidth / videoHeight);
                  setIsPortrait(videoHeight > videoWidth);
                }}
              >
                <source src={src} />
              </video>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-black">
          <div className="w-full" style={{ aspectRatio }}>
            <video
              autoPlay={autoPlay}
              playsInline={playsInline}
              preload="metadata"
              controls={controls}
              poster={poster}
              className="h-full w-full object-contain"
              onLoadedMetadata={(event) => {
                const { videoWidth, videoHeight } = event.currentTarget;
                if (!videoWidth || !videoHeight) return;
                setRatio(videoWidth / videoHeight);
                setIsPortrait(videoHeight > videoWidth);
              }}
            >
              <source src={src} />
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
