import type { NextApiRequest, NextApiResponse } from 'next';

import { handleApiError, validateMethod } from '@/lib/api-utils';
import { adminAuth } from '@/lib/firebase-admin';

const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 dias

// Helper function to map Firebase error codes to user-friendly messages
const getFirebaseAuthErrorMessage = (code: string): string => {
  const errorMap: Record<string, string> = {
    'auth/invalid-email': 'Endereço de email inválido',
    'auth/invalid-credential': 'Senha incorreta',
  };

  return errorMap[code] || 'Ocorreu um erro durante o login. Tente novamente.';
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  validateMethod(req, res, ['POST']);

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autorizado' });
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

    return res.status(200).json({ message: 'Login bem-sucedido' });
  } catch (error) {
    if (error instanceof Error && 'code' in error) {
      const errorMessage = getFirebaseAuthErrorMessage(error.code as string);
      return res.status(401).json({ error: errorMessage });
    }
    handleApiError(res, error, 500);
  }
}
