import type { NextApiRequest, NextApiResponse } from 'next';

import { adminAuth } from '@/lib/firebase-admin';

const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

/**
 * API endpoint to log in a user by creating a session cookie.
 * This endpoint expects a Firebase ID token in the Authorization header.
 * It creates a session cookie that can be used for authenticated requests.
 * The session cookie is set to expire in 5 days.
 * The session cookie is set as an HttpOnly cookie to prevent client-side access.
 * The cookie is set to Secure in production to ensure it is only sent over HTTPS.
 * The cookie is set to SameSite=Strict to prevent CSRF attacks.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const idToken = authHeader.split(' ')[1];

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const isProduction = process.env.NODE_ENV === 'production';
    res.setHeader(
      'Set-Cookie',
      `session=${sessionCookie}; Path=/; HttpOnly; ${isProduction ? 'Secure;' : ''} Max-Age=${expiresIn / 1000}; SameSite=Strict`
    );

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ error: errorMessage });
  }
}
