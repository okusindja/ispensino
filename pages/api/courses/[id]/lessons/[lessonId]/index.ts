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
    validateMethod(req, res, ['GET']);
    const user = await authenticateUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { id, lessonId } = req.query;

    // Verify user has access to course
    const course = await prisma.course.findUnique({
      where: { id: id as string },
      include: {
        enrollments: { where: { userId: user.id } },
        lessons: {
          include: {
            assessment: {
              include: {
                userAssessments: {
                  where: { userId: user.id },
                },
              },
            },
          },
        },
      },
    });

    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (course.teacherId !== user.id && course.enrollments.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.method === 'GET') {
      if (lessonId) {
        const lesson = await prisma.lesson.findUnique({
          where: {
            id: lessonId as string,
            courseId: course.id,
          },
          include: {
            materials: true,
            assessment: true,
            course: {
              include: {
                lessons: true,
              },
            },
          },
        });

        if (!lesson) {
          return res.status(404).json({ error: 'Lesson not found' });
        }

        const assessmentStatus = lesson.assessment
          ? await prisma.userAssessment.findFirst({
              where: {
                userId: user.id,
                assessmentId: lesson.assessment.id,
              },
              select: { isPassed: true },
            })
          : null;

        return res.status(200).json({
          ...lesson,
          isPassed: assessmentStatus?.isPassed || false,
        });
      }

      const lessons = await prisma.lesson.findMany({
        where: { courseId: course.id },
        orderBy: { order: 'asc' },
        include: { materials: true, assessment: true },
      });

      const lessonStatus = await prisma.userAssessment.findMany({
        where: {
          userId: user.id,
          assessment: {
            lesson: {
              id: { in: lessons.map((lesson) => lesson.id) },
            },
          },
        },
        select: { assessment: true, isPassed: true },
      });

      return res.status(200).json(
        lessons.map((lesson) => ({
          ...lesson,
          isPassed:
            lessonStatus.find(
              (status) => status.assessment.lessonId === lesson.id
            )?.isPassed || false,
        }))
      );
    }
  } catch (error) {
    handleApiError(res, error);
  }
}
