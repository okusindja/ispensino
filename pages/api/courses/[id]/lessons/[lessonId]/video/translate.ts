// pages/api/video/translate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import {
  authenticateUser,
  validateMethod,
  handleApiError,
} from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

function segmentsToVTT(segments: any[]) {
  const s = ['WEBVTT\n'];
  segments.forEach((seg, i) => {
    const start = new Date(seg.start * 1000)
      .toISOString()
      .substr(11, 12)
      .replace('.', ',');
    const end = new Date(seg.end * 1000)
      .toISOString()
      .substr(11, 12)
      .replace('.', ',');
    s.push(`${i + 1}\n${start} --> ${end}\n${seg.text}\n`);
  });
  return s.join('\n');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['POST']);
    const user = await authenticateUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { lessonId, to } = req.body;
    if (!lessonId || !to)
      return res
        .status(400)
        .json({ error: 'lessonId and target language required' });

    const transcript = await prisma.transcript.findUnique({
      where: { lessonId },
    });
    if (!transcript)
      return res.status(404).json({ error: 'Transcript not found' });

    // Build prompt: translate segments preserving timestamps
    const segments = transcript.segments as any[];
    if (!segments)
      return res
        .status(400)
        .json({
          error: 'Segmented transcript required for accurate subtitles',
        });

    // Batch translate segments (keep it small) — using responses API
    const texts = segments.map((s) => s.text);

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: `Translate the following array of strings to ${to} and return a JSON array of same length:\n${JSON.stringify(texts)}`,
    });

    const translated = JSON.parse(response.output_text);

    const translatedSegments = segments.map((seg, idx) => ({
      ...seg,
      text: translated[idx],
    }));
    const vtt = segmentsToVTT(translatedSegments);

    // Optionally save translated transcript as new Transcript record with lessonId: `${lessonId}-${to}`
    await prisma.transcript.upsert({
      where: { lessonId: `${lessonId}-${to}` },
      create: {
        lessonId: `${lessonId}-${to}`,
        content: translated.join('\n'),
        segments: translatedSegments,
      },
      update: { content: translated.join('\n'), segments: translatedSegments },
    });

    return res.status(200).json({ vtt, segments: translatedSegments });
  } catch (err) {
    handleApiError(res, err);
  }
}
