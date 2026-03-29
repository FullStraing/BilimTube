'use client';

import { useEffect, useRef } from 'react';

type TrailPoint = {
  x: number;
  y: number;
};

type Sparkle = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  life: number;
  decay: number;
};

const MAX_POINTS = 18;
const SPARKLE_INTERVAL_MS = 45;

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!mediaQuery.matches || reducedMotion.matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const points: TrailPoint[] = [];
    const sparkles: Sparkle[] = [];
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let isActive = false;
    let animationFrame = 0;
    let lastSparkleAt = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const pushPoint = (x: number, y: number) => {
      points.unshift({ x, y });
      if (points.length > MAX_POINTS) {
        points.pop();
      }
    };

    const createSparkle = (x: number, y: number) => {
      sparkles.push({
        x,
        y,
        size: 4 + Math.random() * 4,
        alpha: 0.8,
        life: 1,
        decay: 0.028 + Math.random() * 0.018
      });
    };

    const drawSparkle = (sparkle: Sparkle) => {
      context.save();
      context.translate(sparkle.x, sparkle.y);
      context.globalAlpha = sparkle.alpha;
      context.strokeStyle = 'rgba(143, 214, 255, 0.95)';
      context.lineWidth = 1.4;
      context.beginPath();
      context.moveTo(0, -sparkle.size);
      context.lineTo(0, sparkle.size);
      context.moveTo(-sparkle.size, 0);
      context.lineTo(sparkle.size, 0);
      context.moveTo(-sparkle.size * 0.7, -sparkle.size * 0.7);
      context.lineTo(sparkle.size * 0.7, sparkle.size * 0.7);
      context.moveTo(sparkle.size * 0.7, -sparkle.size * 0.7);
      context.lineTo(-sparkle.size * 0.7, sparkle.size * 0.7);
      context.stroke();
      context.restore();
    };

    const render = (timestamp: number) => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (isActive) {
        pushPoint(pointerX, pointerY);

        if (timestamp - lastSparkleAt >= SPARKLE_INTERVAL_MS) {
          createSparkle(pointerX + (Math.random() - 0.5) * 18, pointerY + (Math.random() - 0.5) * 18);
          lastSparkleAt = timestamp;
        }
      }

      if (points.length > 1) {
        context.save();
        context.lineCap = 'round';
        context.lineJoin = 'round';

        for (let index = 0; index < points.length - 1; index += 1) {
          const current = points[index];
          const next = points[index + 1];
          const progress = 1 - index / points.length;

          context.beginPath();
          context.strokeStyle = `rgba(120, 205, 255, ${progress * 0.7})`;
          context.lineWidth = 2 + progress * 8;
          context.moveTo(current.x, current.y);
          context.lineTo(next.x, next.y);
          context.stroke();
        }

        context.restore();
      }

      for (let index = sparkles.length - 1; index >= 0; index -= 1) {
        const sparkle = sparkles[index];
        sparkle.life -= sparkle.decay;
        sparkle.alpha = Math.max(sparkle.life, 0);
        sparkle.y -= 0.15;

        if (sparkle.life <= 0) {
          sparkles.splice(index, 1);
          continue;
        }

        drawSparkle(sparkle);
      }

      if (!isActive && points.length) {
        points.pop();
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      isActive = true;
    };

    const handlePointerLeave = () => {
      isActive = false;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handlePointerLeave);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] hidden md:block"
    />
  );
}
