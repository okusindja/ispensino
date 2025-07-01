/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

import { adminAuth as firebaseAuth } from './firebase-admin';

// For client-side and getServerSideProps
export async function auth(ctx?: any) {
  try {
    const cookies = parseCookies(ctx);
    const sessionCookie = cookies.session;

    if (!sessionCookie) {
      return null;
    }

    const decodedClaims = await firebaseAuth.verifySessionCookie(
      sessionCookie,
      true
    );

    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// For API routes
export const authenticate = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // First try to get token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const idToken = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await firebaseAuth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ error: 'Unauthorized' });
      return null;
    }
  }

  // If no Authorization header, try to get session cookie
  const cookies = parseCookies({ req });
  const sessionCookie = cookies.session;

  if (!sessionCookie) {
    console.error('No session cookie found');
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  try {
    const decodedClaims = await firebaseAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
    };
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
};
