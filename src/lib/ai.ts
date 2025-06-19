// src/lib/ai.ts
import { Board, Player, Weights, Difficulty } from './types';
import { getValidMoves, applyMove, countDiscs } from './gameLogic';

// 5 heuristics implementations
export function discParity(board: Board, player: Player): number {
  const counts = countDiscs(board);
  const my = counts[player];
  const opp = counts[player === 'black' ? 'white' : 'black'];
  return (my - opp) / (my + opp);
}

export function cornerControl(board: Board, player: Player): number {
  const corners: [number, number][] = [[0,0],[0,7],[7,0],[7,7]];
  let score = 0;
  corners.forEach(([r,c]) => {
    if (board[r][c] === player) score += 1;
    else if (board[r][c] !== 'empty') score -= 1;
  });
  return score / 4;
}

export function mobility(board: Board, player: Player): number {
  const myMoves = getValidMoves(board, player).length;
  const oppMoves = getValidMoves(board, player === 'black' ? 'white' : 'black').length;
  return (myMoves - oppMoves) / (myMoves + oppMoves + 1);
}

export function stability(board: Board, player: Player): number {
  // Simple stability: count edge discs
  let stable = 0;
  for (let i = 0; i < 8; i++) {
    [ [0, i], [7, i], [i, 0], [i,7] ].forEach(([r,c]) => {
      if (board[r][c] === player) stable++;
    });
  }
  return stable / 28; // max 28 edge positions
}

export function edgeControl(board: Board, player: Player): number {
  // penalize x-squares next to corners
  let score = 0;
  const xSquares: [number,number][] = [[0,1],[1,0],[1,1],[0,6],[1,6],[1,7],[6,0],[6,1],[7,1],[6,6],[6,7],[7,6]];
  xSquares.forEach(([r,c]) => {
    if (board[r][c] === player) score -= 1;
    else if (board[r][c] !== 'empty') score += 1;
  });
  return score / xSquares.length;
}

// Combine heuristics by weights
export type EvalFn = (b: Board, p: Player) => number;
export const heuristicFns: Record<keyof Weights, EvalFn> = {
  discParity,
  cornerControl,
  mobility,
};
// Add stability and edgeControl dynamically
(heuristicFns as any).stability = stability;
(heuristicFns as any).edgeControl = edgeControl;

// Difficulty presets
export const presets: Record<Difficulty, { depth: number; weights: Weights }> = {
  easy:   { depth: 2, weights: { discParity: 1, cornerControl: 0, mobility: 0 } },
  medium: { depth: 4, weights: { discParity: 1, cornerControl: 1, mobility: 1 } },
  hard:   { depth: 6, weights: { discParity: 2, cornerControl: 3, mobility: 2 } },
};

// Evaluation
export function evaluate(board: Board, player: Player, weights: Weights): number {
  return (Object.keys(weights) as Array<keyof Weights>)
    .reduce((sum, key) => sum + weights[key] * heuristicFns[key](board, player), 0);
}

// Minimax with alpha-beta
export type Move = [number, number];
export function minimax(
  board: Board,
  player: Player,
  depth: number,
  alpha: number,
  beta: number,
  weights: Weights,
  maximizing: boolean
): { score: number; move?: Move } {
  if (depth === 0) return { score: evaluate(board, player, weights) };
  const moves = getValidMoves(board, maximizing ? player : (player === 'black' ? 'white' : 'black'));
  if (moves.length === 0) return { score: evaluate(board, player, weights) };

  let bestMove: Move | undefined;
  if (maximizing) {
    let value = -Infinity;
    for (const m of moves) {
      const newB = applyMove(board, m[0], m[1], player);
      const res = minimax(newB, player, depth - 1, alpha, beta, weights, false);
      if (res.score > value) { value = res.score; bestMove = m; }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return { score: value, move: bestMove };
  } else {
    let value = Infinity;
    const opp = player === 'black' ? 'white' : 'black';
    for (const m of moves) {
      const newB = applyMove(board, m[0], m[1], opp);
      const res = minimax(newB, player, depth - 1, alpha, beta, weights, true);
      if (res.score < value) { value = res.score; bestMove = m; }
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return { score: value, move: bestMove };
  }
}

// Public AI move picker
export type AIMoveOpts = { player: Player; difficulty: Difficulty; customWeights?: Weights };
export function pickAIMove(
  board: Board,
  opts: AIMoveOpts
): Move | null {
  const { player, difficulty, customWeights } = opts;
  const { depth, weights } = customWeights
    ? { depth: presets[difficulty].depth, weights: customWeights }
    : presets[difficulty];
  const { move } = minimax(board, player, depth, -Infinity, Infinity, weights, true);
  return move || null;
}