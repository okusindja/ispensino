// pages/api/video/ask.ts
import { NextApiRequest, NextApiResponse } from 'next';
import {
  authenticateUser,
  validateMethod,
  handleApiError,
} from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['POST']);
    const user = await authenticateUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { lessonId, question, timestamp } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        transcript: true,
        course: { include: { enrollments: { where: { userId: user.id } } } },
      },
    });

    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    if (
      lesson.course.teacherId !== user.id &&
      lesson.course.enrollments.length === 0
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const transcript = lesson.transcript?.content || '';

    const prompt = `
You are a tutor. 
User's question: "${question}"
Lesson transcript:
${transcript}

If timestamp ${timestamp ?? 'none'} is provided, answer based only on the transcript near that moment.
`;

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
    });

    return res.status(200).json({
      answer: response.output_text,
    });
  } catch (err) {
    handleApiError(res, err);
  }
}
