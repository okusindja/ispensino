import type { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';

import { prisma } from '@/lib';
import { handleApiError, validateMethod } from '@/lib/api-utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  validateMethod(req, res, ['GET']);

  const cookies = nookies.get({ req });
  const sessionCookie = cookies.session || '';

  if (!sessionCookie) {
    console.error('Session cookie missing');
    return res
      .status(401)
      .json({ error: 'Unauthorized: Session cookie missing' });
  }

  try {
    const { userId } = req.query;
    const loggedUser = await prisma.user.findUnique({
      where: { id: String(userId) },
      include: {
        assessments: true,
        comments: true,
        enrollments: true,
        likes: true,
        payments: true,
        posts: true,
        resources: true,
        responses: true,
        teachingCourses: true,
      },
    });

    if (!loggedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(loggedUser);
  } catch (error) {
    handleApiError(res, error, 500);
  }
}
