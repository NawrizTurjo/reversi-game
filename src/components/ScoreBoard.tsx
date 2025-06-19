// src/components/ScoreBoard.tsx
import React from 'react';
import { Player } from '../lib/types';

interface ScoreBoardProps {
  scores: Record<Player, number>;
  currentPlayer: Player;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores, currentPlayer }) => (
  <div className="flex space-x-4 mb-4 text-white">
    <div className={currentPlayer === 'black' ? 'font-bold' : ''}>
      Black: {scores.black}
    </div>
    <div className={currentPlayer === 'white' ? 'font-bold' : ''}>
      White: {scores.white}
    </div>
  </div>
);

export default ScoreBoard;