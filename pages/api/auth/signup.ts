import { NextApiRequest, NextApiResponse } from 'next';

import { adminAuth } from '@/lib';
import { handleApiError, validateMethod } from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['POST']);

    const { email, password, confirmPassword, name, phone, address } = req.body;

    if (!email || !password || !confirmPassword || !name) {
      return res
        .status(400)
        .json({ error: 'Verifique os campos e corrija-os!' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'As senhas não coincidem!' });
    }

    const firebaseUserCreated = await adminAuth.createUser({
      emailVerified: false,
      password: password as string,
      email: Array.isArray(email) ? email[0] : email || '',
      displayName: Array.isArray(name) ? name[0] : name || '',
    });

    const emailString = Array.isArray(email) ? email[0] : email || '';

    const user = await prisma.user.create({
      data: {
        email: emailString,
        firebaseId: firebaseUserCreated.uid,
        name: Array.isArray(name) ? name[0] : name || '',
        phone: Array.isArray(phone) ? phone[0] : phone || '',
        address: Array.isArray(address) ? address[0] : address || '',
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    handleApiError(res, error);
  }
}
