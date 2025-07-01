import type { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';

import { prisma } from '@/lib';
import { adminAuth } from '@/lib/firebase-admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const cookies = nookies.get({ req });
  const sessionCookie = cookies.session || '';

  if (!sessionCookie) {
    console.error('Session cookie missing');
    return res
      .status(401)
      .json({ error: 'Unauthorized: Session cookie missing' });
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    const loggedUser = await prisma.user.findUnique({
      where: { email: decodedClaims.email },
      select: {
        id: true,
        email: true,
      },
    });

    if (!loggedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(loggedUser);
  } catch (error) {
    console.error('Session cookie verification error:', error);
    return res
      .status(401)
      .json({ error: 'Unauthorized: Invalid session cookie' });
  }
}
