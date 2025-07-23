import { randomUUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import slugify from 'slugify';

import {
  authenticateUser,
  enableCors,
  handleApiError,
  validateMethod,
} from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (enableCors(req, res)) return;
  try {
    validateMethod(req, res, ['GET', 'POST']);
    const { courseId } = req.query;
    const user = await authenticateUser(req);
    console.log('Authenticated user:', user);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (courseId && typeof courseId === 'string') {
      if (req.method === 'GET') {
        const course = await prisma.course.findUnique({
          where: { id: courseId },
          include: { teacher: true, categories: true },
        });

        if (!course) {
          return res.status(404).json({ error: 'Course not found' });
        }

        if (!course.isPublished && course.teacherId !== user.id) {
          return res.status(403).json({ error: 'Forbidden' });
        }

        // const lessonStatus = await prisma.userAssessment.findMany({
        //         where: { userId: user.id, assessment: { lesson: {
        //           id: { in: lessons.map(lesson => lesson.id) }
        //         } } },
        //         select: { assessment: true, isPassed: true },
        //       });

        //       return res.status(200).json(lessons.map(lesson =>({
        //         ...lesson,
        //         isPassed: lessonStatus.find(status => status.assessment.lessonId === lesson.id)?.isPassed || false,
        //       })));

        return res.status(200).json(course);
      }

      return res.status(405).json({ error: 'Method Not Allowed' });
    }

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

      const {
        title,
        description,
        thumbnail,
        startDate,
        price,
        categories,
        isPublished,
      } = req.body;
      const isFree = !price || price <= 0;

      const course = await prisma.course.create({
        data: {
          title,
          slug: slugify(title + '+' + randomUUID().slice(0, 5)),
          description,
          thumbnail: thumbnail || '',
          startDate: new Date(startDate) || new Date(),
          isPublished: isPublished !== undefined ? isPublished : false,
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
