import { NextApiRequest, NextApiResponse } from 'next';
import {
  authenticateUser,
  validateMethod,
  handleApiError,
} from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['GET']);

    // Authenticate the user making the request
    const authUser = await authenticateUser(req);
    if (!authUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.query;

    // Verify the user is accessing their own data
    if (authUser.id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only teachers can access this endpoint
    if (authUser.role !== Role.TEACHER) {
      return res
        .status(403)
        .json({ error: 'Only teachers can view their courses' });
    }

    // Fetch teacher's courses
    const courses = await prisma.course.findMany({
      where: {
        teacherId: authUser.id,
        // isPublished: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        isPublished: true,
        createdAt: true,
        thumbnail: true,
        price: true,
        isFree: true,
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(courses);
  } catch (err) {
    handleApiError(res, err);
  }
}
