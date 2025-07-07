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

    const { lessonId } = req.query;

    // Verify user has access to lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId as string },
      include: {
        course: {
          include: {
            enrollments: { where: { userId: user.id } },
          },
        },
      },
    });

    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    if (
      lesson.course.teacherId !== user.id &&
      lesson.course.enrollments.length === 0
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.method === 'GET') {
      const assessment = await prisma.lessonAssessment.findUnique({
        where: { lessonId: lesson.id },
        include: {
          questions: {
            include: { options: true },
            orderBy: { order: 'asc' },
          },
        },
      });

      return res.status(200).json(assessment);
    }

    if (req.method === 'POST') {
      // Submit assessment
      const { responses } = req.body;

      // Calculate score
      let correctCount = 0;
      const questionResults = [];

      for (const response of responses) {
        const question = await prisma.question.findUnique({
          where: { id: response.questionId },
          include: { options: true },
        });

        if (!question) continue;

        let isCorrect = false;

        if (question.type === 'SINGLE_CHOICE') {
          const correctOption = question.options.find((opt) => opt.isCorrect);
          isCorrect = correctOption?.id === response.optionId;
        } else if (question.type === 'MULTIPLE_CHOICE') {
          const selectedOptions = question.options.filter((opt) =>
            response.optionIds.includes(opt.id)
          );

          isCorrect =
            selectedOptions.every((opt) => opt.isCorrect) &&
            selectedOptions.length ===
              question.options.filter((opt) => opt.isCorrect).length;
        }

        if (isCorrect) correctCount++;
        questionResults.push({ questionId: question.id, isCorrect });
      }

      const score = (correctCount / responses.length) * 100;
      const assessment = await prisma.lessonAssessment.findUnique({
        where: { lessonId: lesson.id },
      });

      const isPassed = score >= (assessment?.passScore || 75);

      // Save results
      const userAssessment = await prisma.userAssessment.create({
        data: {
          userId: user.id,
          assessmentId: assessment!.id,
          score,
          isPassed,
          startedAt: new Date(),
          completedAt: new Date(),
          responses: {
            create: questionResults.map((result) => ({
              isCorrect: result.isCorrect,
              answer: '',
              user: {
                connect: { id: user.id },
              },
              question: {
                connect: { id: result.questionId },
              },
            })),
          },
        },
      });

      return res.status(201).json({ ...userAssessment, score, isPassed });
    }
  } catch (error) {
    handleApiError(res, error);
  }
}
