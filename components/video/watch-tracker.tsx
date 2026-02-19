'use client';

import { useEffect, useRef } from 'react';

type Props = {
  slug: string;
};

export function WatchTracker({ slug }: Props) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;

    void fetch(`/api/videos/${slug}/watch`, {
      method: 'POST',
      keepalive: true
    });
  }, [slug]);

  return null;
}
