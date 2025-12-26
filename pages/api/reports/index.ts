import { NextApiRequest, NextApiResponse } from 'next';
import {
  authenticateUser,
  validateMethod,
  handleApiError,
} from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      await handleCreateReport(req, res);
    } else if (req.method === 'GET') {
      await handleGetReports(req, res);
    } else {
      return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (err) {
    handleApiError(res, err);
  }
}

async function handleCreateReport(req: NextApiRequest, res: NextApiResponse) {
  validateMethod(req, res, ['POST']);
  const user = await authenticateUser(req);

  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const { targetId, targetType, reason, customReason, userId } = req.body;

  if (!targetId || !targetType || !reason || !userId) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  // Verify the reporting user exists
  if (user.id !== userId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  // Verify target exists based on type
  const targetExists = await verifyTargetExists(targetId, targetType);
  if (!targetExists) {
    return res.status(404).json({ error: 'Conteúdo não encontrado' });
  }

  // Create the report
  const report = await prisma.report.create({
    data: {
      reporterId: user.id,
      targetId,
      targetType,
      reason,
      customReason,
      status: 'PENDING',
      metadata: {
        reporterName: user.name,
        reporterEmail: user.email,
        createdAt: new Date().toISOString(),
      },
    },
  });

  // Create notification for all admins
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  });

  const notifications = admins.map((admin) => ({
    userId: admin.id,
    type: 'REPORT' as const,
    message: `Novo report submetido: ${targetType} (ID: ${targetId})`,
    metadata: {
      reportId: report.id,
      targetType,
      targetId,
      reason,
    },
  }));

  await prisma.notification.createMany({
    data: notifications,
  });

  return res.status(201).json({
    message: 'Report submetido com sucesso',
    report,
  });
}

async function handleGetReports(req: NextApiRequest, res: NextApiResponse) {
  validateMethod(req, res, ['GET']);
  const user = await authenticateUser(req);

  if (!user || user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'Apenas administradores podem ver reports' });
  }

  const {
    status = 'PENDING',
    targetType,
    page = '1',
    limit = '20',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};

  if (status) where.status = status;
  if (targetType) where.targetType = targetType;

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        resolvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [sortBy as string]: sortOrder,
      },
      skip,
      take: limitNum,
    }),
    prisma.report.count({ where }),
  ]);

  // Fetch target details for each report
  const reportsWithDetails = await Promise.all(
    reports.map(async (report) => {
      let targetDetails = null;

      try {
        targetDetails = await fetchTargetDetails(
          report.targetId,
          report.targetType
        );
      } catch (error) {
        console.error(
          `Error fetching target details for ${report.targetType} ${report.targetId}:`,
          error
        );
      }

      return {
        ...report,
        targetDetails,
      };
    })
  );

  return res.status(200).json({
    reports: reportsWithDetails,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
}

async function verifyTargetExists(
  targetId: string,
  targetType: string
): Promise<boolean> {
  switch (targetType) {
    case 'USER':
      return !!(await prisma.user.findUnique({ where: { id: targetId } }));
    case 'POST':
      return !!(await prisma.post.findUnique({ where: { id: targetId } }));
    case 'COURSE':
      return !!(await prisma.course.findUnique({ where: { id: targetId } }));
    case 'MONOGRAPH':
      return !!(await prisma.monograph.findUnique({ where: { id: targetId } }));
    case 'SCIENTIFIC_ARTICLE':
      return !!(await prisma.scientificArticle.findUnique({
        where: { id: targetId },
      }));
    case 'COMMENT':
      return !!(await prisma.comment.findUnique({ where: { id: targetId } }));
    case 'RESOURCE':
      return !!(await prisma.resource.findUnique({ where: { id: targetId } }));
    default:
      return false;
  }
}

async function fetchTargetDetails(targetId: string, targetType: string) {
  switch (targetType) {
    case 'USER':
      return await prisma.user.findUnique({
        where: { id: targetId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
        },
      });
    case 'POST':
      return await prisma.post.findUnique({
        where: { id: targetId },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      });
    case 'COURSE':
      return await prisma.course.findUnique({
        where: { id: targetId },
        select: {
          id: true,
          title: true,
          description: true,
          teacher: { select: { name: true } },
          isPublished: true,
        },
      });
    case 'MONOGRAPH':
      return await prisma.monograph.findUnique({
        where: { id: targetId },
        select: {
          id: true,
          title: true,
          author: true,
          advisor: true,
          course: true,
        },
      });
    case 'SCIENTIFIC_ARTICLE':
      return await prisma.scientificArticle.findUnique({
        where: { id: targetId },
        select: {
          id: true,
          title: true,
          abstract: true,
          authors: { include: { user: { select: { name: true } } } },
        },
      });
    case 'COMMENT':
      return await prisma.comment.findUnique({
        where: { id: targetId },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      });
    case 'RESOURCE':
      return await prisma.resource.findUnique({
        where: { id: targetId },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          author: { select: { name: true } },
        },
      });
    default:
      return null;
  }
}
