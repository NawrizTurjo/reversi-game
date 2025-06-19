// src/components/ColorSettings.tsx
'use client';
import React from 'react';

type Colors = {
  black: string;
  white: string;
  preview: string;
  converted: string;
};

interface Props {
  colors: Colors;
  onChange: (c: Colors) => void; // <- change this from setColors to onChange
}

const ColorSettings: React.FC<Props> = ({ colors, onChange }) => (
  <div className="flex space-x-4 my-2">
    {(['black', 'white', 'preview', 'converted'] as (keyof Colors)[]).map(k => (
      <div key={k} className="flex flex-col items-center">
        <label className="text-white">{k}</label>
        <input
          type="color"
          value={colors[k]}
          onChange={e => onChange({ ...colors, [k]: e.target.value })}
        />
      </div>
    ))}
  </div>
);

export default ColorSettings;
