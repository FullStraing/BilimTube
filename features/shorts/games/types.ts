'use client';

import type { Locale } from '@/lib/i18n/messages';

export type GameFeedback = {
  success: string[];
};

export type WordFinderGame = {
  type: 'word-finder';
  prompt: Record<Locale, string>;
  target: Record<Locale, string>;
  options: Record<Locale, string[]>;
};

export type PictureFinderGame = {
  type: 'picture-finder';
  prompt: Record<Locale, string>;
  target: string;
  options: Array<{
    id: string;
    emoji: string;
    label: Record<Locale, string>;
  }>;
};

export type ColorPickerGame = {
  type: 'color-picker';
  prompt: Record<Locale, string>;
  target: string;
  options: Array<{
    id: string;
    colorClassName: string;
    label: Record<Locale, string>;
  }>;
};

export type CatchObjectGame = {
  type: 'catch-object';
  prompt: Record<Locale, string>;
  target: string;
  objects: Array<{
    id: string;
    emoji: string;
    top: string;
    left: string;
    delayMs: number;
    durationMs: number;
  }>;
};

export type MatchPairGame = {
  type: 'match-pair';
  prompt: Record<Locale, string>;
  left: {
    text?: Record<Locale, string>;
    emoji?: string;
  };
  options: Array<{
    id: string;
    text?: Record<Locale, string>;
    emoji?: string;
    correct: boolean;
  }>;
};

export type MiniGameData =
  | WordFinderGame
  | PictureFinderGame
  | ColorPickerGame
  | CatchObjectGame
  | MatchPairGame;

export type GameFeedItem = {
  id: string;
  kind: 'game';
  game: MiniGameData;
};
