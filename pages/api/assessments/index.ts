import { NextApiRequest, NextApiResponse } from 'next';

import {
  authenticateUser,
  handleApiError,
  validateMethod,
} from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';
import { AssessmentSchema } from '@/zod';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['POST']);
    const user = await authenticateUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    // Validate request body
    const result = AssessmentSchema.safeParse(req.body);
    if (!result.success) {
      console.error('Validation errors:', result.error.flatten());
      return res.status(400).json({
        error: 'Invalid data',
        details: result.error.flatten(),
      });
    }

    const { lessonId, title, description, passScore, questions } = result.data;

    // Verify user has access to lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    if (lesson.course.teacherId !== user.id) {
      return res
        .status(403)
        .json({ error: 'Only course teacher can create assessments' });
    }

    // Create assessment
    const assessment = await prisma.lessonAssessment.create({
      data: {
        title,
        description: description || '',
        lessonId,
        passScore,
        questions: {
          create: questions.map((q, index) => ({
            text: q.text,
            type: q.type,
            explanation: q.explanation || '',
            order: index,
            options: q.options
              ? {
                  create: q.options.map((opt) => ({
                    text: opt.text,
                    isCorrect: opt.isCorrect,
                  })),
                }
              : undefined,
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return res.status(201).json(assessment);
  } catch (error) {
    console.error('Detailed error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      body: req.body,
    });
    handleApiError(res, error);
  }
}
