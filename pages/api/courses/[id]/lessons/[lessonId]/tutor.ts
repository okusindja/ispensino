// pages/api/tutor/lesson.ts
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

    const { lessonId, question } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        transcript: true,
        materials: true,
        assessment: { include: { questions: { include: { options: true } } } },
        course: {
          include: {
            lessons: true,
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

    const prompt = `
You are a private tutor. 
Context for this student:
- Lesson title: ${lesson.title}
- Full transcript: ${lesson.transcript?.content}
- Materials: ${lesson.materials.map((m) => m.title).join(', ')}
- Quiz questions: ${JSON.stringify(lesson.assessment?.questions)}

Student question: "${question}"

Give clear, friendly explanations.
`;

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
    });

    return res.status(200).json({ answer: response.output_text });
  } catch (err) {
    handleApiError(res, err);
  }
}
