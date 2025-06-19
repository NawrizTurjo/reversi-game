// src/components/CustomAI.tsx
'use client';

import React from 'react';
import { Weights } from '../lib/types';

interface Props {
  weights: Weights;
  onChange: (newWeights: Weights) => void;
}
const CustomAI: React.FC<Props> = ({ weights, onChange }) => {
  return (
    <div className="space-y-2">
      {Object.entries(weights).map(([key, value]) => (
        <div key={key} className="flex items-center space-x-2">
          <label>{key}</label>
          <input
            type="range"
            min={0} max={5}
            value={value}
            onChange={e => onChange({ ...weights, [key]: +e.target.value })}
          />
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomAI;