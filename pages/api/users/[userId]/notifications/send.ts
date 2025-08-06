// pages/api/notifications/send.ts
import { NotificationType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { handleApiError, validateMethod } from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';

interface SendNotificationRequest {
  userId: string;
  message: string;
  type?: NotificationType;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['POST']);

    const {
      userId,
      message,
      type = 'GENERAL',
    } = req.body as SendNotificationRequest;

    // Validate inputs
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Verify user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        type,
      },
    });

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
    handleApiError(res, error);
  }
}
