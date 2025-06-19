'use client';

import React, { useState, useEffect } from 'react';
import Board from '../components/Board';
import ScoreBoard from '../components/ScoreBoard';
import Header from '../components/Header';
import GameSettingsComp from '../components/GameSettings';
import CustomAI from '../components/CustomAI';
import {
  initBoard,
  getValidMoves,
  applyMove,
  countDiscs,
} from '../lib/gameLogic';
import { pickAIMove, presets } from '../lib/ai';
import {
  Player,
  Board as BoardType,
  GameSettings,
  Weights,
} from '../lib/types';

export default function GamePage() {
  // ─── Game State ─────────────────────────────────────
  const [board, setBoard] = useState<BoardType>(initBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [scores, setScores] = useState<Record<Player, number>>({
    black: 2,
    white: 2,
  });
  const [gameOver, setGameOver] = useState(false);

  // ─── Settings State ─────────────────────────────────
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'HvsAI',
    difficulty: 'easy',
  });
  const [weights1, setWeights1] = useState<Weights>(
    presets[settings.difficulty!].weights
  );
  const [weights2, setWeights2] = useState<Weights>(
    presets[settings.difficulty!].weights
  );

  // ─── Control: show menu or game ─────────────────────
  const [hasStarted, setHasStarted] = useState(false);
  // ─── Track AI move state ────────────────────────────
  const [isAIMoving, setIsAIMoving] = useState(false);

  // ─── Compute Moves & Scores ─────────────────────────
  useEffect(() => {
    if (!hasStarted) return;
    const moves = getValidMoves(board, currentPlayer);
    if (moves.length === 0) {
      const opp: Player = currentPlayer === 'black' ? 'white' : 'black';
      const oppMoves = getValidMoves(board, opp);
      if (oppMoves.length === 0) {
        setGameOver(true);
      } else {
        setCurrentPlayer(opp);
      }
      setValidMoves([]);
    } else {
      setValidMoves(moves);
    }
    setScores(countDiscs(board));
  }, [board, currentPlayer, hasStarted]);

  // ─── Handle Human Moves ─────────────────────────────
  const handleCellClick = (r: number, c: number) => {
    if (!hasStarted || gameOver || isAIMoving) return;
    if (settings.mode === 'AIvsAI') return;
    if (
      (settings.mode === 'HvsAI' && currentPlayer === 'white') ||
      !validMoves.some(([vr, vc]) => vr === r && vc === c)
    )
      return;
    try {
      const newBoard = applyMove(board, r, c, currentPlayer);
      setBoard(newBoard);
      setCurrentPlayer((p) => (p === 'black' ? 'white' : 'black'));
    } catch {}
  };

  // ─── Handle AI Moves ────────────────────────────────
  const makeAIMove = () => {
    if (!hasStarted || gameOver) return;
    const weights =
      settings.mode === 'AIvsAI'
        ? currentPlayer === 'black'
          ? weights1
          : weights2
        : weights2;
    const move = pickAIMove(board, {
      player: currentPlayer,
      difficulty: settings.difficulty!,
      customWeights: weights,
    });
    if (move) {
      try {
        const newBoard = applyMove(board, move[0], move[1], currentPlayer);
        setBoard(newBoard);
        setCurrentPlayer((p) => (p === 'black' ? 'white' : 'black'));
      } catch {}
    }
    setIsAIMoving(false); // AI move complete
  };

  // ─── AI Move Logic for HvsAI and AIvsAI ─────────────
  useEffect(() => {
    if (!hasStarted || gameOver) return;
    if (settings.mode === 'HvsAI' && currentPlayer === 'white') {
      setIsAIMoving(true); // Disable interaction
      const delay = 300;
      const timer = setTimeout(() => {
        makeAIMove();
      }, delay);
      return () => clearTimeout(timer);
    }
    if (settings.mode === 'AIvsAI') {
      setIsAIMoving(true); // Disable interaction
      const delay = 800;
      const timer = setTimeout(() => {
        makeAIMove();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [board, currentPlayer, hasStarted, settings, weights1, weights2, gameOver]);

  // ─── Start Game Handler ─────────────────────────────
  const startGame = (newSettings: GameSettings) => {
    setSettings(newSettings);
    const presetWeights = presets[newSettings.difficulty!].weights;
    setWeights1(presetWeights);
    setWeights2(presetWeights);
    setBoard(initBoard());
    setCurrentPlayer('black');
    setGameOver(false);
    setIsAIMoving(false);
    setHasStarted(true);
  };

  // ─── Reset Game ─────────────────────────────────────
  const resetGame = () => {
    setBoard(initBoard());
    setCurrentPlayer('black');
    setGameOver(false);
    setIsAIMoving(false);
    setHasStarted(false);
  };

  // ─── Render ─────────────────────────────────────────
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg space-y-6">
          <Header />
          <GameSettingsComp
            settings={settings}
            onChange={(s) => {
              setSettings(s);
              const pw = presets[s.difficulty!].weights;
              setWeights1(pw);
              setWeights2(pw);
            }}
          />
          {settings.mode !== 'HvsH' && (
            <>
              <div>
                <h3 className="text-white font-semibold">Black AI</h3>
                <CustomAI weights={weights1} onChange={setWeights1} />
              </div>
              {settings.mode === 'AIvsAI' && (
                <div>
                  <h3 className="text-white font-semibold">White AI</h3>
                  <CustomAI weights={weights2} onChange={setWeights2} />
                </div>
              )}
            </>
          )}
          <button
            className="w-full py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold rounded transition"
            onClick={() => startGame(settings)}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-800 p-4">
      <Header />
      <div className="flex flex-col items-center space-y-4">
        <ScoreBoard scores={scores} currentPlayer={currentPlayer} />
        <Board
          board={board}
          validMoves={validMoves}
          currentPlayer={currentPlayer}
          onCellClick={handleCellClick}
          isAIMoving={isAIMoving}
        />
        {gameOver && (
          <div className="text-white text-xl">
            Game Over! Winner:{' '}
            {scores.black > scores.white
              ? 'Black'
              : scores.white > scores.black
              ? 'White'
              : 'Tie'}
          </div>
        )}
        <div className="flex space-x-4">
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded transition-colors"
          >
            Main Menu
          </button>
          <button
            onClick={() => {
              setBoard(initBoard());
              setCurrentPlayer('black');
              setGameOver(false);
              setIsAIMoving(false);
            }}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}