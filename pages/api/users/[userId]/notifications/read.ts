import { NextApiRequest, NextApiResponse } from 'next';

import { handleApiError, validateMethod } from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['PATCH']);

    const { userId, id: notificationId } = req.query as {
      userId: string;
      id: string;
    };

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!notificationId || typeof notificationId !== 'string') {
      return res.status(400).json({ error: 'Invalid notification ID' });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { userId: true },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return res.status(200).json({
      success: true,
      notification: updatedNotification,
    });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    handleApiError(res, error);
  }
}
