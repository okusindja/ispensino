// pages/api/video/dub.ts
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

    const { lessonId, to, voice } = req.body;
    if (!lessonId || !to)
      return res
        .status(400)
        .json({ error: 'lessonId and target language required' });

    const transcript = await prisma.transcript.findUnique({
      where: { lessonId: `${lessonId}-${to}` },
    });
    if (!transcript)
      return res
        .status(404)
        .json({
          error: 'Translated transcript not found — run translate first',
        });

    // Aggregate text — be mindful of length limits, chunk if needed
    const text = transcript.content;

    // Call TTS API (pseudo-code) — adapt to the TTS provider you pick
    const ttsResp = await openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice: voice || 'alloy',
      input: text,
      format: 'mp3',
    } as any);

    // ttsResp may return a stream or base64; save it to your storage (Cloudinary / S3)
    // Here we assume base64 in ttsResp.data
    const audioBase64 = ttsResp.data;

    // Save to storage (example: convert & upload — left as exercise to integrate your storage)
    // Return base64 or temporary URL
    return res.status(200).json({ audioBase64 });
  } catch (err) {
    handleApiError(res, err);
  }
}
