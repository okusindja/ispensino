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
      const courses = await prisma.course.findMany({
        where: { OR: [{ isPublished: true }, { teacherId: user.id }] },
        include: { teacher: true, categories: true },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(courses);
    }

    if (req.method === 'POST') {
      if (user.role !== 'TEACHER') {
        return res
          .status(403)
          .json({ error: 'Only teachers can create courses' });
      }

      const { title, description, price, categories } = req.body;
      const isFree = !price || price <= 0;

      const course = await prisma.course.create({
        data: {
          title,
          description,
          price: isFree ? null : price,
          isFree,
          teacherId: user.id,
          categories: {
            connect: categories.map((id: string) => ({ id })),
          },
        },
        include: { teacher: true, categories: true },
      });

      return res.status(201).json(course);
    }
  } catch (error) {
    handleApiError(res, error);
  }
}
