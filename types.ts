export enum GameStatus {
  MENU = 'MENU',
  STORY = 'STORY', // New status for story narrative
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum GameDifficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD'
}

export enum ElementType {
  FIRE = '火',
  WATER = '水',
  WOOD = '木',
  METAL = '金',
  EARTH = '土',
  HEALING = '靈' // Special type for healing
}

export interface Boss {
  name: string;
  title: string;
  element: ElementType;
  maxHealth: number;
  currentHealth: number;
  attackInterval: number; // ms
  damage: number;
  description: string;
  color: string;
}

export interface LevelConfig {
  levelNumber: number;
  element: ElementType;
  bossName: string;
  difficulty: number; // 1-5
  storyText: string; // Narrative text
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  text?: string;
  color: string;
  vx: number;
  vy: number;
  life: number;
}