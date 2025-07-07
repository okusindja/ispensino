import { getAuth } from 'firebase-admin/auth';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '.';

// Verify Firebase token and get user
export const authenticateUser = async (req: NextApiRequest) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  const idToken = authHeader.split(' ')[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return await prisma.user.findUnique({
      where: { firebaseId: decodedToken.uid },
      include: {
        enrollments: true,
        assessments: true,
        likes: true,
        payments: true,
        posts: true,
        resources: true,
        responses: true,
        teachingCourses: true,
        comments: true,
      },
    });
  } catch (error) {
    return null;
  }
};

// Handle API errors
export const handleApiError = (
  res: NextApiResponse,
  error: unknown,
  status = 500
) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : 'Internal server error';
  return res.status(status).json({ error: message });
};

// Validate request method
export const validateMethod = (
  req: NextApiRequest,
  res: NextApiResponse,
  methods: string[]
) => {
  if (!methods.includes(req.method!)) {
    res.setHeader('Allow', methods);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};
