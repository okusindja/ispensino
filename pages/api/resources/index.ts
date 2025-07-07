import { ResourceType } from '@prisma/client';
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
      const { type, category, search } = req.query;
      const resources = await prisma.resource.findMany({
        where: {
          type: (type as ResourceType) || undefined,
          categories: category
            ? { some: { id: category as string } }
            : undefined,
          OR: search
            ? [
                { title: { contains: search as string, mode: 'insensitive' } },
                {
                  description: {
                    contains: search as string,
                    mode: 'insensitive',
                  },
                },
              ]
            : undefined,
        },
        include: { author: true, categories: true },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(resources);
    }

    if (req.method === 'POST') {
      const { title, description, type, url, categories, license } = req.body;

      const resource = await prisma.resource.create({
        data: {
          title,
          description,
          type,
          url,
          license,
          authorId: user.id,
          categories: {
            connect: categories.map((id: string) => ({ id })),
          },
        },
        include: { author: true, categories: true },
      });

      return res.status(201).json(resource);
    }
  } catch (error) {
    handleApiError(res, error);
  }
}
