// pages/api/gamification/metrics.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import {
  authenticateUser,
  validateMethod,
  handleApiError,
} from '@/lib/api-utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['GET']);
    const user = await authenticateUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const metric = await prisma.userMetric.findUnique({
      where: { userId: user.id },
    });
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: user.id },
      include: { badge: true },
    });

    return res.status(200).json({
      xp: metric?.xp ?? 0,
      level: metric?.level ?? 1,
      badges: userBadges.map((ub) => ub.badge),
    });
  } catch (err) {
    handleApiError(res, err);
  }
}
