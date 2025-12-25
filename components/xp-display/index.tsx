// components/XPDisplay.tsx
import React, { useMemo } from 'react';

function xpForLevel(level: number) {
  // inverse of the level formula: xp threshold for a level
  // For our simple formula level = floor(sqrt(xp/100))+1
  // -> xp >= ((level -1)^2) * 100
  return Math.pow(Math.max(level - 1, 0), 2) * 100;
}

export default function XPDisplay() {
  const { metrics, isLoading } = useUserMetrics();

  if (isLoading) return <div>Loading XP...</div>;
  if (!metrics) return <div>No XP data</div>;

  const xp = metrics.xp || 0;
  const level = metrics.level || 1;

  const xpThisLevel = xp - xpForLevel(level);
  const xpNextLevel = xpForLevel(level + 1) - xpForLevel(level);
  const progress = Math.min(100, Math.round((xpThisLevel / xpNextLevel) * 100));

  return (
    <div className="p-3 rounded-md shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Level</div>
          <div className="text-2xl font-bold">{level}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">XP</div>
          <div className="text-lg">{xp}</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="h-2 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-green-400"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {xpThisLevel}/{xpNextLevel} XP ({progress}%)
        </div>
      </div>
    </div>
  );
}
