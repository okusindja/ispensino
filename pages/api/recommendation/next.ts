// pages/api/recommendations/next.ts
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

    const { courseId } = req.body;

    const data = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          include: {
            assessment: {
              include: { userAssessments: { where: { userId: user.id } } },
            },
          },
        },
      },
    });

    const input = `
Student performance data:  
${JSON.stringify(data, null, 2)}

Based on difficulty + scores + order, recommend:
- Next lesson
- Weak areas
- Study advice
Return JSON only:
{
  "nextLessonId": "",
  "weakAreas": [],
  "advice": ""
}
`;

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input,
    });

    return res.status(200).json(JSON.parse(response.output_text));
  } catch (err) {
    handleApiError(res, err);
  }
}
