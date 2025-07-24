import {
  Comment,
  Course,
  Enrollment,
  Like,
  Payment,
  Post,
  Resource,
  User,
  UserAssessment,
  UserResponse,
} from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { adminAuth } from './firebase-admin';
import { prisma } from './prisma';

export const authenticateUser = async (req: NextApiRequest) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const idToken = authHeader.split(' ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const user:
      | (User & {
          enrollments: Enrollment[];
          assessments: UserAssessment[];
          likes: Like[];
          payments: Payment[];
          posts: Post[];
          resources: Resource[];
          responses: UserResponse[];
          teachingCourses: Course[];
          comments: Comment[];
        })
      | null = await prisma.user.findUnique({
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

    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error verifying token or fetching user:', error);
    return null;
  }
};

export const enableCors = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
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
