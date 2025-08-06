// pages/api/user/[userId]/notifications.ts
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib';
import {
  authenticateUser,
  handleApiError,
  validateMethod,
} from '@/lib/api-utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  validateMethod(req, res, ['GET']);

  const user = await authenticateUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { userId } = req.query;

  if (user.id !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: userId as string },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return res.status(200).json(notifications);
  } catch (error) {
    handleApiError(res, error, 500);
  }
}
