/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib';
import { handleApiError, validateMethod } from '@/lib/api-utils';

interface AddBalanceRequest {
  amount: number;
  enrollmentId?: string;
  reference?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['POST']);

    const { userId } = req.query;
    const { amount, enrollmentId } = req.body as AddBalanceRequest;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ error: 'Amount must be a positive number' });
    }

    if (enrollmentId && typeof enrollmentId !== 'string') {
      return res.status(400).json({ error: 'Invalid enrollment ID' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } },
      });

      const paymentData: any = {
        amount,
        currency: 'AOA',
        status: 'COMPLETED' as const,
        userId,
      };

      if (enrollmentId) {
        paymentData.enrollmentId = enrollmentId;
      }

      const payment = await tx.payment.create({
        data: paymentData,
      });

      if (enrollmentId) {
        await tx.enrollment.update({
          where: { id: enrollmentId },
          data: {
            payments: { connect: { id: payment.id } },
          },
        });
      }

      return { newBalance: user.balance, payment };
    });

    return res.status(200).json({
      success: true,
      newBalance: result.newBalance,
      transaction: result.payment,
    });
  } catch (error) {
    console.error('Failed to add balance:', error);
    handleApiError(res, error);
  }
}
