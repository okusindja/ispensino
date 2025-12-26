import { AcademicalCourses } from '@prisma/client';
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
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Monograph ID is required' });
    }

    if (req.method === 'GET') {
      validateMethod(req, res, ['GET']);
      const user = await authenticateUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const monograph = await prisma.monograph.findUnique({
        where: { id },
      });

      if (!monograph) {
        return res.status(404).json({ error: 'Monograph not found' });
      }

      return res.status(200).json(monograph);
    } else if (req.method === 'PUT') {
      validateMethod(req, res, ['PUT']);
      const user = await authenticateUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { title, author, advisor, course, publishedAt, url, tags } =
        req.body;

      // Validation
      if (!title || !author || !advisor || !course || !publishedAt || !url) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!Object.values(AcademicalCourses).includes(course)) {
        return res.status(400).json({ error: 'Invalid course value' });
      }

      // Update the Monograph
      const monograph = await prisma.monograph.update({
        where: { id },
        data: {
          title,
          author,
          advisor,
          course: course as AcademicalCourses,
          publishedAt: new Date(publishedAt),
          url,
          tags: tags || [],
        },
      });

      return res.status(200).json(monograph);
    } else {
      res.setHeader('Allow', ['GET', 'PUT']);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    handleApiError(res, error);
  }
}
