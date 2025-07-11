// pages/api/categories.ts
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
      const categories = await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      });
      return res.status(200).json(categories);
    }

    if (req.method === 'POST') {
      if (user.role === 'STUDENT') {
        return res
          .status(403)
          .json({ error: 'Only admins can create categories' });
      }

      const { name, description } = req.body;
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Invalid category name' });
      }

      const existingCategory = await prisma.category.findUnique({
        where: { name },
      });

      if (existingCategory) {
        return res.status(409).json({ error: 'Category already exists' });
      }

      const newCategory = await prisma.category.create({
        data: {
          name: name.trim(),
          description: description?.trim(),
        },
        select: { id: true, name: true },
      });

      return res.status(201).json(newCategory);
    }
  } catch (error) {
    handleApiError(res, error);
  }
}
