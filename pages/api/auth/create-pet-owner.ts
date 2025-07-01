import { NextApiRequest, NextApiResponse } from 'next';

import { adminAuth, authenticate, prisma } from '@/lib';

/**
 * API endpoint to create a new admin user.
 * This endpoint is intended to be called by an authenticated user with admin privileges.
 * It creates a new user in Firebase and the database with the provided email, role, and password.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  const user = await authenticate(req, res);
  if (!user) return;

  if (req.method === 'POST') {
    try {
      const firebaseUserCreated = await adminAuth.createUser({
        email: Array.isArray(email) ? email[0] : email || '',
        emailVerified: false,
        password: password as string,
      });

      const emailString = Array.isArray(email) ? email[0] : email || '';
      const user = await prisma.user.create({
        data: {
          email: emailString,
          firebaseId: firebaseUserCreated.uid,
        },
      });
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Cannot create user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
