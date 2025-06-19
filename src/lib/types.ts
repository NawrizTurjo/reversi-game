export type Tile = 'empty' | 'black' | 'white';
export type Player = 'black' | 'white';
export type Board = Tile[][];
export type FlippedDisc = [number, number]; // [row, col] for flipped discs

export enum Heuristic {
  DiscParity = 'discParity',
  CornerControl = 'cornerControl',
  Mobility = 'mobility',
}

export interface Weights {
  [Heuristic.DiscParity]: number;
  [Heuristic.CornerControl]: number;
  [Heuristic.Mobility]: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameSettings {
  mode: 'HvsH' | 'HvsAI' | 'AIvsAI';
  difficulty?: Difficulty;
  customWeights?: Weights;
}

export type TileProps = {
  value: 'empty' | 'black' | 'white';
  isValidMove?: boolean;
  isFlipped?: boolean;
  isFlipping?: boolean; // New: Indicates if the tile is animating
  isPreviewing?: boolean;
  previewingFrom?: boolean;
  onClick: () => void;
  onHover: () => void;
  discColors?: { black: string; white: string };
  isAIMoving?: boolean;
};