// pages/api/social/posts/[id].tsx
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
    validateMethod(req, res, ['GET', 'PUT', 'DELETE']);
    const user = await authenticateUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.query;

    if (req.method === 'GET') {
      const post = await prisma.post.findUnique({
        where: { id: id as string },
        include: {
          author: true,
          comments: true,
          likes: true,
          tags: true,
          course: true,
          resource: true,
        },
      });

      return res.status(200).json(post);
    }

    if (req.method === 'PUT') {
      const { content, tags } = req.body;

      const post = await prisma.post.update({
        where: { id: id as string, authorId: user.id },
        data: {
          content,
          tags: {
            set: [],
            connectOrCreate: tags.map((name: string) => ({
              where: { name },
              create: { name },
            })),
          },
        },
        include: { author: true, tags: true },
      });

      return res.status(200).json(post);
    }

    if (req.method === 'DELETE') {
      await prisma.post.delete({
        where: { id: id as string, authorId: user.id },
      });

      return res.status(204).end();
    }
  } catch (error) {
    handleApiError(res, error);
  }
}
