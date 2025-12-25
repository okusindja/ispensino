// pages/api/gamification/xp.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import {
  authenticateUser,
  validateMethod,
  handleApiError,
} from '@/lib/api-utils';

type Body = {
  xp: number;
  reason?: string;
  courseId?: string | null;
  lessonId?: string | null;
};

function calculateLevelFromXp(xp: number) {
  // Example leveling curve: level = floor(sqrt(xp / 100)) + 1
  // - tweak constants to control pacing
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['POST']);
    const user = await authenticateUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const body: Body = req.body;
    const xpToAdd = Number(body?.xp || 0);
    if (!xpToAdd || xpToAdd <= 0) {
      return res.status(400).json({ error: 'xp must be a positive number' });
    }

    // Use a transaction to avoid race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Try to get existing metric
      let metric = await tx.userMetric.findUnique({
        where: { userId: user.id },
      });

      if (!metric) {
        // create
        metric = await tx.userMetric.create({
          data: {
            userId: user.id,
            xp: xpToAdd,
            level: calculateLevelFromXp(xpToAdd),
          },
        });
      } else {
        // update xp atomically
        metric = await tx.userMetric.update({
          where: { id: metric.id },
          data: { xp: { increment: xpToAdd } as any },
        });
        // recalc level afterwards
        const newLevel = calculateLevelFromXp(metric.xp);
        if (newLevel !== metric.level) {
          metric = await tx.userMetric.update({
            where: { id: metric.id },
            data: { level: newLevel },
          });
        }
      }

      // compute whether they leveled up, using the previous xp snapshot
      // (we need the previous xp — we can approximate by subtracting xpToAdd)
      const previousXp = metric.xp - xpToAdd;
      const previousLevel = calculateLevelFromXp(previousXp);
      const leveledUp = metric.level > previousLevel;

      // Log activity (courseId/lessonId optional)
      await tx.lessonActivity.create({
        data: {
          userId: user.id,
          courseId: body.courseId ?? '',
          lessonId: body.lessonId ?? '',
          event: 'award_xp',
          data: {
            xp: xpToAdd,
            reason: body.reason || null,
            previousXp,
            newXp: metric.xp,
            previousLevel,
            newLevel: metric.level,
          },
        },
      });

      return { metric, leveledUp };
    });

    return res.status(200).json({
      xp: result.metric.xp,
      level: result.metric.level,
      leveledUp: result.leveledUp,
    });
  } catch (err) {
    handleApiError(res, err);
  }
}
