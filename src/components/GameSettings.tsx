// src/components/GameSettings.tsx
'use client';

import React from 'react';
import { GameSettings, Difficulty } from '../lib/types';

interface Props {
  settings: GameSettings;
  onChange: (newSettings: GameSettings) => void;
}
const GameSettingsComp: React.FC<Props> = ({ settings, onChange }) => {
  const modes: GameSettings['mode'][] = ['HvsH', 'HvsAI', 'AIvsAI'];
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  const handleMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...settings, mode: e.target.value as any });
  };
  const handleDiff = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...settings, difficulty: e.target.value as Difficulty });
  };

  return (
    <div className="flex space-x-4 mb-4">
      <select 
        value={settings.mode} onChange={handleMode} className="p-2 bg-green hover:bg-green-600 active:bg-green-700 rounded transition-colors">
        {modes.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      {settings.mode !== 'HvsH' && (
        <select value={settings.difficulty} onChange={handleDiff} className="p-2 bg-green hover:bg-green-600 active:bg-green-700 rounded transition-colors">
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      )}
      {settings.mode !== 'HvsH' && (
        <button
          className="p-2 bg-green hover:bg-green-600 active:bg-green-700 text-white rounded"
          onClick={() => onChange({ ...settings, customWeights: undefined })}
        >
          Default Heuristics
        </button>
      )}
    </div>
  );
};

export default GameSettingsComp;