'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const STORAGE_KEY = 'bilimtube_home_splash_seen';

export function HomeIntroSplash() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return;

    setIsVisible(true);

    const fadeTimer = window.setTimeout(() => setIsFading(true), 1150);
    const hideTimer = window.setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setIsVisible(false);
    }, 1750);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-background transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="splash-logo relative h-[180px] w-[180px] sm:h-[220px] sm:w-[220px]">
          <Image src="/assets/bars.png" alt="BilimTube" fill priority className="object-contain" />
        </div>
        <p className="text-[44px] font-extrabold tracking-[0.04em] text-primary sm:text-[56px]">BILIMTUBE</p>
      </div>
    </div>
  );
}
