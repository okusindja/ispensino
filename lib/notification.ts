import { NotificationType } from '@prisma/client';

import { auth } from './firebase';

export async function sendNotification(
  userId: string,
  message: string,
  type?: NotificationType
): Promise<void> {
  const user = auth.currentUser?.uid;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user}/notifications/send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          message,
          type,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send notification');
    }
  } catch (error) {
    console.error('Notification error:', error);
    throw error;
  }
}
