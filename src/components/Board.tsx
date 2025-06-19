// src/components/Board.tsx
'use client';

import React, { useState } from 'react';
import Tile from './Tile';
import { Board as BoardType, Player } from '../lib/types';
import { applyMove } from '../lib/gameLogic';

export type BoardProps = {
  board: BoardType;
  validMoves: [number, number][];
  currentPlayer: Player;
  onCellClick: (row: number, col: number) => void;
  lastConverted?: [number, number][];
  discColors?: { black: string; white: string };
  isAIMoving?: boolean;
};

const Board: React.FC<BoardProps> = ({
  board,
  validMoves,
  currentPlayer,
  onCellClick,
  lastConverted = [],
  discColors = { black: 'bg-black', white: 'bg-white' },
  isAIMoving = false,
}) => {
  const [previewBoard, setPreviewBoard] = useState<BoardType | null>(null);

  const isValid = (r: number, c: number) =>
    validMoves.some(([vr, vc]) => vr === r && vc === c);

  const handleHover = (r: number, c: number) => {
    if (!isValid(r, c)) return setPreviewBoard(null);
    try {
      const preview = applyMove(board, r, c, currentPlayer);
      setPreviewBoard(preview);
    } catch {
      setPreviewBoard(null);
    }
  };

  const handleMouseLeave = () => setPreviewBoard(null);

  return (
    <div
      className="grid grid-cols-8 gap-0 bg-green-700 p-1"
      onMouseLeave={handleMouseLeave}
    >
      {board.map((rowArr, r) =>
        rowArr.map((cell, c) => {
          const previewValue = previewBoard?.[r]?.[c] ?? cell;
          const isFlipped = lastConverted.some(([fr, fc]) => fr === r && fc === c);

          return (
            <Tile
              key={`${r}-${c}`}
              value={previewValue}
              isValidMove={isValid(r, c)}
              onClick={() => isValid(r, c) && onCellClick(r, c)}
              onHover={() => handleHover(r, c)}
              isFlipped={isFlipped}
              discColors={discColors}
              isPreviewing={!!previewBoard}
              previewingFrom={cell !== previewValue}
              isAIMoving={isAIMoving}
            />
          );
        })
      )}
    </div>
  );
};

export default Board;
