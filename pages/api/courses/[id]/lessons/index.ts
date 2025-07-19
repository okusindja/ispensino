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

    const { id } = req.query;

    // Verify user has access to course
    const course = await prisma.course.findUnique({
      where: { id: id as string },
      include: { enrollments: { where: { userId: user.id } } },
    });

    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (course.teacherId !== user.id && course.enrollments.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.method === 'GET') {
      const lessons = await prisma.lesson.findMany({
        where: { courseId: course.id },
        orderBy: { order: 'asc' },
        include: { materials: true, assessment: true },
      });

      return res.status(200).json(lessons);
    }

    if (req.method === 'POST') {
      if (course.teacherId !== user.id) {
        return res
          .status(403)
          .json({ error: 'Only course teacher can add lessons' });
      }

      const { title, description, videoUrl, isPreview, materials } = req.body;

      // Get next order number
      const lastLesson = await prisma.lesson.findFirst({
        where: { courseId: course.id },
        orderBy: { order: 'desc' },
      });

      const lesson = await prisma.lesson.create({
        data: {
          title,
          description,
          videoUrl,
          isPreview,
          order: lastLesson ? lastLesson.order + 1 : 1,
          courseId: course.id,
          materials: {
            create: materials.map(
              (mat: { name: string; url: string; type: string }) => ({
                name: mat.name,
                url: mat.url,
                type: mat.type,
              })
            ),
          },
        },
      });

      return res.status(201).json(lesson);
    }
  } catch (error) {
    handleApiError(res, error);
  }
}
