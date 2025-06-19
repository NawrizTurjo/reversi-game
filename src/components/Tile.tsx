//src/components/Tile.tsx
'use client';

import React from 'react';

export type TileProps = {
  value: 'empty' | 'black' | 'white';
  isValidMove?: boolean;
  isFlipped?: boolean;
  isPreviewing?: boolean;
  previewingFrom?: boolean;
  onClick: () => void;
  onHover: () => void;
  discColors?: { black: string; white: string };
  isAIMoving?: boolean;
};

const Tile: React.FC<TileProps> = ({
  value,
  isValidMove = false,
  isFlipped = false,
  isPreviewing = false,
  previewingFrom = false,
  onClick,
  onHover,
  discColors = { black: 'bg-black', white: 'bg-white' },
  isAIMoving = false,
}) => {
  const base = 'w-10 h-10 border border-gray-600 flex items-center justify-center transition duration-200';
  const hoverBg = isValidMove && !isAIMoving ? 'bg-yellow-200 cursor-pointer' : '';
  const flippedRing = isFlipped ? 'ring-2 ring-purple-500' : '';
  const previewOpacity = isPreviewing && previewingFrom ? 'opacity-50 scale-90' : '';

  let disc = null;
  if (value === 'black') {
    disc = (
      <div
        className={`w-8 h-8 rounded-full ${discColors.black} ${previewOpacity} transition-all`}
      />
    );
  }
  if (value === 'white') {
    disc = (
      <div
        className={`w-8 h-8 rounded-full ${discColors.white} border ${previewOpacity} transition-all`}
      />
    );
  }

  return (
    <div
      className={`${base} ${hoverBg} ${flippedRing}`}
      onClick={isAIMoving ? undefined : onClick}
      onMouseEnter={isAIMoving ? undefined : onHover}
    >
      {disc}
    </div>
  );
};

export default Tile;