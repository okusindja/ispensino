import { NextApiRequest, NextApiResponse } from 'next';

import { sendNotification } from '@/lib';
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
    if (!commentId)
      return res.status(400).json({ error: 'Comment ID is required' });

    // First get the comment with author information
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        content: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    // Check for existing like
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: user.id,
        commentId: commentId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return res.status(200).json({ liked: false });
    }

    // Create new like
    await prisma.like.create({
      data: {
        commentId: commentId,
        userId: user.id,
      },
    });

    if (comment.author.id !== user.id) {
      await sendNotification(
        comment.author.id,
        `${user.name} liked your comment`,
        'LIKE'
      );
    }

    return res.status(200).json({ liked: true });
  } catch (error) {
    handleApiError(res, error);
  }
}
