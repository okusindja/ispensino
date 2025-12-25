// pages/api/video/transcribe.ts
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

    const { lessonId, videoUrl, language } = req.body;

    if (!lessonId && !videoUrl) {
      return res.status(400).json({ error: 'lessonId or videoUrl required' });
    }

    // Verify access when lessonId present
    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
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
    }

    // Use videoUrl if supplied, otherwise get from lesson
    let sourceUrl = videoUrl;
    if (!sourceUrl) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
      });
      sourceUrl = lesson?.videoUrl;
    }

    if (!sourceUrl)
      return res.status(400).json({ error: 'No video URL available' });

    // Call OpenAI Whisper transcription (pseudo-code: adapt to your client)
    const resp = await openai.audio.transcriptions.create({
      file: sourceUrl,
      model: 'whisper-1',
      language: language || undefined,
      response_format: 'verbose_json',
    } as any);

    // resp should contain segments
    const content = resp.text || resp.data?.text || JSON.stringify(resp);
    const segments = resp.segments || resp.data?.segments || null;

    // Save transcript
    const saved = await prisma.transcript.upsert({
      where: { lessonId: lessonId ?? '' },
      create: { lessonId: lessonId ?? '', content, segments },
      update: { content, segments },
    });

    return res.status(200).json({ transcript: saved });
  } catch (err) {
    handleApiError(res, err);
  }
}
