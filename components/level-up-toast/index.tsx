// components/LevelUpToast.tsx
import React, { useEffect } from 'react';

export default function LevelUpToast({
  level,
  onClose,
}: {
  level: number;
  onClose?: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(), 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed right-4 bottom-6 z-50">
      <div className="px-4 py-3 rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-blue-400 text-white">
        <div className="font-bold">Level up! 🎉</div>
        <div>You reached level {level}</div>
      </div>
    </div>
  );
}
