// components/AwardXpButton.tsx
import React, { useState } from 'react';
import { useAwardXp } from '@/lib/hooks/useAwardXp';
import { useUserMetrics } from '@/lib/hooks/useUserMetrics';
import LevelUpToast from './LevelUpToast';

export default function AwardXpButton({
  xp,
  reason,
  courseId,
  lessonId,
  children,
}: {
  xp: number;
  reason?: string;
  courseId?: string;
  lessonId?: string;
  children?: React.ReactNode;
}) {
  const { awardXp, response, isMutating } = useAwardXp();
  const { mutate } = useUserMetrics();
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number } | null>(
    null
  );

  async function handleClick() {
    try {
      const res = await awardXp({ xp, reason, courseId, lessonId });
      // update local metrics cache by revalidating
      await mutate();
      if (res?.leveledUp) {
        setLevelUpInfo({ level: res.level });
      }
    } catch (err) {
      console.error('award xp failed', err);
    }
  }

  return (
    <>
      <button
        className="btn"
        onClick={handleClick}
        disabled={isMutating}
        aria-busy={isMutating}
      >
        {children ?? `+${xp} XP`}
      </button>

      {levelUpInfo && (
        <LevelUpToast
          level={levelUpInfo.level}
          onClose={() => setLevelUpInfo(null)}
        />
      )}
    </>
  );
}
