'use client';

import { useEffect, useRef } from 'react';

type TrailPoint = {
  x: number;
  y: number;
  life: number;
  decay: number;
  hue: number;
};

type Sparkle = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  life: number;
  decay: number;
  hue: number;
  driftX: number;
  driftY: number;
};

const MAX_POINTS = 22;

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reducedMotion.matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const points: TrailPoint[] = [];
    const sparkles: Sparkle[] = [];
    let animationFrame = 0;
    let hueSeed = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const addPoint = (x: number, y: number) => {
      hueSeed = (hueSeed + 11) % 360;

      points.unshift({
        x,
        y,
        life: 1,
        decay: 0.06,
        hue: hueSeed
      });

      if (points.length > MAX_POINTS) {
        points.pop();
      }
    };

    const addSparkles = (x: number, y: number) => {
      for (let index = 0; index < 2; index += 1) {
        const hue = (hueSeed + index * 26 + Math.random() * 18) % 360;

        sparkles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          size: 2.4 + Math.random() * 1.8,
          alpha: 0.85,
          life: 1,
          decay: 0.05 + Math.random() * 0.02,
          hue,
          driftX: (Math.random() - 0.5) * 0.45,
          driftY: -0.2 - Math.random() * 0.35
        });
      }
    };

    const drawSparkle = (sparkle: Sparkle) => {
      context.save();
      context.translate(sparkle.x, sparkle.y);
      context.globalAlpha = sparkle.alpha;
      context.strokeStyle = `hsla(${sparkle.hue} 100% 72% / 0.95)`;
      context.lineWidth = 1;
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

    const render = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (points.length > 1) {
        context.save();
        context.lineCap = 'round';
        context.lineJoin = 'round';

        for (let index = points.length - 1; index >= 1; index -= 1) {
          const current = points[index];
          const next = points[index - 1];
          const alpha = Math.min(current.life, next.life) * 0.72;

          context.beginPath();
          context.strokeStyle = `hsla(${next.hue} 100% 72% / ${alpha})`;
          context.lineWidth = 0.8 + next.life * 1.6;
          context.moveTo(current.x, current.y);
          context.lineTo(next.x, next.y);
          context.stroke();
        }

        context.restore();
      }

      for (let index = points.length - 1; index >= 0; index -= 1) {
        points[index].life -= points[index].decay;

        if (points[index].life <= 0) {
          points.splice(index, 1);
        }
      }

      for (let index = sparkles.length - 1; index >= 0; index -= 1) {
        const sparkle = sparkles[index];
        sparkle.life -= sparkle.decay;
        sparkle.alpha = Math.max(sparkle.life * 0.95, 0);
        sparkle.x += sparkle.driftX;
        sparkle.y += sparkle.driftY;

        if (sparkle.life <= 0) {
          sparkles.splice(index, 1);
          continue;
        }

        drawSparkle(sparkle);
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      addPoint(event.clientX, event.clientY);
      addSparkles(event.clientX, event.clientY);
    };

    const handlePointerDown = (event: PointerEvent) => {
      addPoint(event.clientX, event.clientY);
      addSparkles(event.clientX, event.clientY);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]" />;
}
