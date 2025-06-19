// src/lib/gameLogic.ts
import { Board, Player, Tile, FlippedDisc } from './types';

// Direction vectors for scanning
const directions: [number, number][] = [
  [-1, 0], // N
  [-1, 1], // NE
  [0, 1],  // E
  [1, 1],  // SE
  [1, 0],  // S
  [1, -1], // SW
  [0, -1], // W
  [-1, -1] // NW
];

// Initialize 8×8 board with standard starting positions
export function initBoard(): Board {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill('empty'));
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';
  return board;
}

// Check if position is on board
function isOnBoard(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Given a move, return the discs to flip in one direction
function discsToFlip(
  board: Board,
  startRow: number,
  startCol: number,
  player: Player,
  dir: [number, number]
): [number, number][] {
  const flips: [number, number][] = [];
  const opponent: Player = player === 'black' ? 'white' : 'black';
  let [r, c] = [startRow + dir[0], startCol + dir[1]];

  if (!isOnBoard(r, c) || board[r][c] !== opponent) return [];
  flips.push([r, c]);

  while (true) {
    r += dir[0];
    c += dir[1];
    if (!isOnBoard(r, c) || board[r][c] === 'empty') {
      return [];
    }
    if (board[r][c] === player) {
      return flips;
    }
    flips.push([r, c]);
  }
}

// Compute valid moves for a player on a given board
enum Direction { N, NE, E, SE, S, SW, W, NW }
export function getValidMoves(board: Board, player: Player): [number, number][] {
  const moves: [number, number][] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] !== 'empty') continue;
      for (const dir of directions) {
        if (discsToFlip(board, row, col, player, dir).length > 0) {
          moves.push([row, col]);
          break;
        }
      }
    }
  }
  return moves;
}

export function getPreviewBoard(
  board: Board, row: number, col: number, player: Player
): Board | null {
  try {
    return applyMove(board.map(r => [...r]), row, col, player);
  } catch {
    return null;
  }
}

// Apply a move and flip discs
export function applyMove(
  board: Board,
  row: number,
  col: number,
  player: Player
): Board {
  const newBoard: Board = board.map(r => [...r]);
  const validFlips: [number, number][] = [];

  for (const dir of directions) {
    const flips = discsToFlip(board, row, col, player, dir);
    if (flips.length > 0) {
      validFlips.push(...flips);
    }
  }

  if (validFlips.length === 0) {
    throw new Error(`Invalid move at (${row}, ${col}) for player ${player}`);
  }

  // Place player's disc
  newBoard[row][col] = player;
  // Flip all discs
  for (const [r, c] of validFlips) {
    newBoard[r][c] = player;
  }

  return newBoard;
}

// Count discs by color
export function countDiscs(board: Board): Record<Player, number> {
  const counts: Record<Player, number> = { black: 0, white: 0 };
  for (const row of board) {
    for (const cell of row) {
      if (cell === 'black') counts.black++;
      if (cell === 'white') counts.white++;
    }
  }
  return counts;
}