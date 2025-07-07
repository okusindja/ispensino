// pages/api/social/posts/index.tsx
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
    validateMethod(req, res, ['GET', 'POST']);
    const user = await authenticateUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
      const { cursor, limit = 10 } = req.query;
      const posts = await prisma.post.findMany({
        where: { OR: [{ authorId: user.id }, { author: { role: 'TEACHER' } }] },
        include: {
          author: true,
          comments: { take: 3 },
          tags: true,
          course: true,
          resource: true,
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        cursor: cursor ? { id: cursor as string } : undefined,
        skip: cursor ? 1 : 0,
      });

      return res.status(200).json(posts);
    }

    if (req.method === 'POST') {
      const { content, courseId, resourceId, tags } = req.body;

      const post = await prisma.post.create({
        data: {
          content,
          authorId: user.id,
          courseId: courseId || null,
          resourceId: resourceId || null,
          tags: {
            connectOrCreate: tags.map((name: string) => ({
              where: { name },
              create: { name },
            })),
          },
        },
        include: { author: true, tags: true },
      });

      return res.status(201).json(post);
    }
  } catch (error) {
    handleApiError(res, error);
  }
}
