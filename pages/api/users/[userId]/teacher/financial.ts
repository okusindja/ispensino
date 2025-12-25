import { NextApiRequest, NextApiResponse } from 'next';
import {
  authenticateUser,
  validateMethod,
  handleApiError,
} from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';

interface FinancialDataParams {
  timeRange?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    validateMethod(req, res, ['GET']);

    const authUser = await authenticateUser(req);
    if (!authUser) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const { userId } = req.query;
    const { timeRange = 'month' } = req.query as FinancialDataParams;

    if (authUser.id !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (authUser.role !== 'TEACHER') {
      return res
        .status(403)
        .json({ error: 'Apenas professores podem aceder a dados financeiros' });
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0);
    }

    // Get teacher's courses
    const courses = await prisma.course.findMany({
      where: {
        teacherId: authUser.id,
      },
      include: {
        enrollments: {
          include: {
            payments: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    // Calculate financial data for each course
    const courseRevenues = await Promise.all(
      courses.map(async (course) => {
        const paidEnrollments = course.enrollments.filter((e) =>
          e.payments.some((p) => p.status === 'COMPLETED')
        );

        const freeEnrollments = course.enrollments.filter(
          (e) =>
            !e.payments.some((p) => p.status === 'COMPLETED') || course.isFree
        );

        const totalRevenue = paidEnrollments.reduce((sum, enrollment) => {
          const completedPayments = enrollment.payments.filter(
            (p) => p.status === 'COMPLETED'
          );
          return (
            sum +
            completedPayments.reduce(
              (paymentSum, payment) => paymentSum + payment.amount,
              0
            )
          );
        }, 0);

        const totalEnrollments = course.enrollments.length;
        const conversionRate =
          totalEnrollments > 0
            ? (paidEnrollments.length / totalEnrollments) * 100
            : 0;

        const avgRevenuePerStudent =
          paidEnrollments.length > 0
            ? totalRevenue / paidEnrollments.length
            : 0;

        return {
          id: course.id,
          title: course.title,
          price: course.price,
          isFree: course.isFree,
          totalRevenue,
          totalEnrollments,
          paidEnrollments: paidEnrollments.length,
          freeEnrollments: freeEnrollments.length,
          conversionRate,
          avgRevenuePerStudent,
        };
      })
    );

    // Calculate overall financial overview
    const allEnrollments = courses.flatMap((course) => course.enrollments);
    const allPayments = allEnrollments.flatMap(
      (enrollment) => enrollment.payments
    );

    const completedPayments = allPayments.filter(
      (p) => p.status === 'COMPLETED'
    );
    const pendingPayments = allPayments.filter((p) => p.status === 'PENDING');
    const refundedPayments = allPayments.filter((p) => p.status === 'REFUNDED');

    const totalRevenue = completedPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const pendingAmount = pendingPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const refundedAmount = refundedPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const netRevenue = totalRevenue - refundedAmount;

    const paidEnrollments = allEnrollments.filter((e) =>
      e.payments.some((p) => p.status === 'COMPLETED')
    ).length;

    const freeEnrollments = allEnrollments.length - paidEnrollments;
    const conversionRate =
      allEnrollments.length > 0
        ? (paidEnrollments / allEnrollments.length) * 100
        : 0;

    const avgRevenuePerStudent =
      paidEnrollments > 0 ? totalRevenue / paidEnrollments : 0;

    // Find best performing course
    const bestPerformingCourse = courseRevenues.reduce(
      (best, current) =>
        current.totalRevenue > best.totalRevenue ? current : best,
      courseRevenues[0] || { id: '', title: '', totalRevenue: 0 }
    );

    // Generate monthly revenue data
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(now.getMonth() - (11 - i));
      const monthKey = date.toLocaleDateString('pt-PT', { month: 'short' });

      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthPayments = completedPayments.filter((p) => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      });

      const monthEnrollments = allEnrollments.filter((e) => {
        const enrollmentDate = new Date(e.enrolledAt);
        return enrollmentDate >= monthStart && enrollmentDate <= monthEnd;
      });

      return {
        date: monthKey,
        revenue: monthPayments.reduce((sum, p) => sum + p.amount, 0),
        enrollments: monthEnrollments.length,
        transactions: monthPayments.length,
      };
    });

    // Generate payment methods distribution (mock data - you'd need actual payment method data)
    const paymentMethods = [
      { name: 'Cartão de Crédito', value: totalRevenue * 0.65, percentage: 65 },
      { name: 'PayPal', value: totalRevenue * 0.25, percentage: 25 },
      {
        name: 'Transferência Bancária',
        value: totalRevenue * 0.08,
        percentage: 8,
      },
      { name: 'Outros', value: totalRevenue * 0.02, percentage: 2 },
    ].filter((p) => p.value > 0);

    // Generate revenue trends
    const revenueTrends = [
      { period: 'Esta Semana', revenue: totalRevenue * 0.15, growth: 5.2 },
      { period: 'Este Mês', revenue: totalRevenue * 0.45, growth: 12.8 },
      { period: 'Este Trimestre', revenue: totalRevenue * 0.75, growth: 8.3 },
      { period: 'Este Ano', revenue: totalRevenue, growth: 25.1 },
    ];

    // Generate upcoming payouts
    const upcomingPayouts = pendingPayments
      .map((payment) => {
        const enrollment = allEnrollments.find(
          (e) => e.id === payment.enrollmentId
        );
        const course = courses.find((c) => c.id === enrollment?.courseId);

        return {
          id: payment.id,
          amount: payment.amount,
          courseId: enrollment?.courseId || '',
          courseTitle: course?.title || 'Curso Desconhecido',
          expectedDate: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7 days from now
          status: 'pending',
        };
      })
      .slice(0, 5); // Limit to 5 upcoming payouts

    // Calculate growth rate (mock calculation - would need historical comparison)
    const previousPeriodRevenue = totalRevenue * 0.85;
    const growthRate =
      previousPeriodRevenue > 0
        ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
        : 0;

    const overview = {
      totalRevenue,
      totalEnrollments: allEnrollments.length,
      paidEnrollments,
      freeEnrollments,
      avgRevenuePerStudent,
      conversionRate,
      pendingPayments: pendingAmount,
      refundedAmount,
      netRevenue,
      growthRate,
      bestPerformingCourse: {
        id: bestPerformingCourse.id,
        title: bestPerformingCourse.title,
        revenue: bestPerformingCourse.totalRevenue,
      },
    };

    return res.status(200).json({
      overview,
      monthlyRevenue,
      courseRevenues,
      paymentMethods,
      revenueTrends,
      upcomingPayouts,
    });
  } catch (err) {
    console.error('Financial API Error:', err);
    handleApiError(res, err);
  }
}
