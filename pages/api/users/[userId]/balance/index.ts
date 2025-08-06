import { NotificationType, PaymentStatus } from '@prisma/client';
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
    validateMethod(req, res, ['GET', 'POST']);
    const authUser = await authenticateUser(req);
    if (!authUser) return res.status(401).json({ error: 'Unauthorized' });

    const userId = req.query.userId as string;

    if (req.method === 'GET') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          balance: true,
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      return res.status(200).json({
        balance: user?.balance || 0,
        transactions: user?.payments || [],
      });
    }

    if (req.method === 'POST') {
      const { amount, enrollmentId } = req.body;

      if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Valid amount is required' });
      }

      if (!enrollmentId) {
        return res.status(400).json({ error: 'enrollmentId is required' });
      }

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
          where: { id: userId },
          data: {
            balance: { increment: amount },
            payments: {
              create: {
                amount,
                currency: 'AOA',
                status: 'COMPLETED' as PaymentStatus,
                enrollmentId,
              },
            },
          },
          include: { payments: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });

        await tx.notification.create({
          data: {
            userId,
            type: 'PAYMENT' as NotificationType,
            message: `Your account was credited with ${amount} AOA`,
          },
        });

        return {
          newBalance: user.balance,
          payment: user.payments[0],
        };
      });

      return res.status(200).json({
        success: true,
        newBalance: result.newBalance,
        transaction: result.payment,
      });
    }
  } catch (error) {
    console.error('Payment error:', error);
    handleApiError(res, error);
  }
}
