import { NextApiRequest, NextApiResponse } from 'next';

import {
  authenticateUser,
  handleApiError,
  validateMethod,
} from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['POST']);
    const user = await authenticateUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { commentId } = req.body;

    if (!commentId) {
      return res.status(400).json({ error: 'Comment ID is required' });
    }

    // Check if user already liked the comment
    const existingLike = await prisma.like.findFirst({
      where: {
        user: {
          firebaseId: user.firebaseId,
        },
        userId: user.id,
      },
    });

    if (existingLike) {
      // Unlike the comment
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return res.status(200).json({ liked: false });
    } else {
      // Like the comment
      await prisma.like.create({
        data: {
          comment: {
            connect: { id: commentId },
          },
          user: {
            connect: { firebaseId: user.firebaseId },
          },
        },
      });
      return res.status(200).json({ liked: true });
    }
  } catch (error) {
    handleApiError(res, error);
  }
}
