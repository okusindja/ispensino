/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotificationType, PaymentStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib';
import { handleApiError, validateMethod } from '@/lib/api-utils';

interface PaymentRequest {
  amount: number;
  courseId?: string;
  resourceId?: string;
  enrollmentId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['POST']);

    const { userId } = req.query;
    const { amount, courseId, resourceId, enrollmentId } =
      req.body as PaymentRequest;

    // Validate inputs
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ error: 'Amount must be a positive number' });
    }

    if (!courseId && !resourceId) {
      return res
        .status(400)
        .json({ error: 'Either courseId or resourceId must be provided' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify user exists and has sufficient balance
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // 2. Handle course payment validation
      if (courseId) {
        if (!enrollmentId) {
          throw new Error('Enrollment ID is required for course payments');
        }

        const enrollment = await tx.enrollment.findUnique({
          where: { id: enrollmentId },
        });

        if (!enrollment || enrollment.courseId !== courseId) {
          throw new Error('Invalid enrollment for this course');
        }

        const course = await tx.course.findUnique({
          where: { id: courseId },
        });

        if (!course) {
          throw new Error('Course not found');
        }

        if (course.price !== amount) {
          throw new Error('Payment amount does not match course price');
        }
      }

      // 3. Handle resource payment validation
      if (resourceId) {
        const resource = await tx.resource.findUnique({
          where: { id: resourceId },
        });

        if (!resource) {
          throw new Error('Resource not found');
        }
      }

      // 4. Deduct from balance
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
      });

      // 5. Create payment record
      const paymentData: any = {
        amount: amount,
        currency: 'AOA',
        status: 'COMPLETED' as PaymentStatus,
        userId: userId,
      };
      if (enrollmentId) {
        paymentData.enrollmentId = enrollmentId;
      }
      const payment = await tx.payment.create({
        data: paymentData,
      });

      // 6. For resources, create a UserResource record
      if (resourceId) {
        await tx.user.update({
          where: { id: userId },
          data: {
            resources: {
              connect: { id: resourceId },
            },
          },
        });
      }

      // 7. Create notification
      await tx.notification.create({
        data: {
          userId: userId,
          type: 'PAYMENT' as NotificationType,
          message: `Payment of ${amount} AOA completed`,
        },
      });

      return {
        newBalance: updatedUser.balance,
        payment,
        ...(courseId && { courseId }),
        ...(resourceId && { resourceId }),
      };
    });

    return res.status(200).json({
      success: true,
      newBalance: result.newBalance,
      transaction: result.payment,
    });
  } catch (error) {
    console.error('Payment failed:', error);
    handleApiError(res, error);
  }
}
