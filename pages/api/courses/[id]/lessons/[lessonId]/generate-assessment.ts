// pages/api/lessons/generate-quiz.ts
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
    if (!user || user.role !== 'TEACHER') {
      return res
        .status(403)
        .json({ error: 'Only teachers can generate quizzes' });
    }

    const { lessonId } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { transcript: true },
    });

    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const prompt = `
Generate a JSON quiz with 5 questions based on this transcript:

${lesson.transcript?.content}

Return format:
{
  "questions": [
    {
      "type": "SINGLE_CHOICE",
      "question": "...",
      "options": [
        { "text": "...", "isCorrect": true },
        { "text": "...", "isCorrect": false }
      ]
    }
  ]
}
`;

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
    });

    const quiz = JSON.parse(response.output_text);

    const assessment = await prisma.lessonAssessment.create({
      data: {
        lessonId,
        passScore: 70,
        questions: {
          create: quiz.questions.map((q: any, index: number) => ({
            order: index,
            question: q.question,
            type: q.type,
            options: {
              create: q.options.map((opt: any) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
              })),
            },
          })),
        },
      },
    });

    return res.status(201).json(assessment);
  } catch (err) {
    handleApiError(res, err);
  }
}
