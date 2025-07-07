import { NextApiRequest, NextApiResponse } from 'next';

import {
  authenticateUser,
  handleApiError,
  validateMethod,
} from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
// });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['POST']);
    const user = await authenticateUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.query;
    const course = await prisma.course.findUnique({
      where: { id: id as string },
    });

    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseId: course.id },
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Handle payment for paid courses
    // let paymentIntent = null;
    // if (!course.isFree) {
    //   paymentIntent = await stripe.paymentIntents.create({
    //     amount: Math.round(course.price! * 100),
    //     currency: 'usd',
    //     metadata: { userId: user.id, courseId: course.id },
    //     automatic_payment_methods: { enabled: true },
    //   });
    // }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        payments: course.isFree
          ? undefined
          : {
              create: {
                amount: course.price!,
                currency: 'AOA',
                status: 'COMPLETED',
                userId: user.id,
              },
            },
      },
      include: { course: true },
    });

    return res.status(201).json({ enrollment });
    // return res.status(201).json({ enrollment, clientSecret: paymentIntent?.client_secret });
  } catch (error) {
    handleApiError(res, error);
  }
}
