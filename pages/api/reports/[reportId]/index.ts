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
    const { reportId } = req.query;

    if (!reportId || typeof reportId !== 'string') {
      return res.status(400).json({ error: 'ID do report é obrigatório' });
    }

    if (req.method === 'GET') {
      await handleGetReport(req, res, reportId);
    } else if (req.method === 'PUT') {
      await handleUpdateReport(req, res, reportId);
    } else if (req.method === 'DELETE') {
      await handleDeleteReport(req, res, reportId);
    } else {
      return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (err) {
    handleApiError(res, err);
  }
}

async function handleGetReport(
  req: NextApiRequest,
  res: NextApiResponse,
  reportId: string
) {
  validateMethod(req, res, ['GET']);
  const user = await authenticateUser(req);

  if (!user || user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'Apenas administradores podem ver detalhes do report' });
  }

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      reporter: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
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
  });

  if (!report) {
    return res.status(404).json({ error: 'Report não encontrado' });
  }

  // Fetch target details
  const targetDetails = await fetchTargetDetails(
    report.targetId,
    report.targetType
  );

  return res.status(200).json({
    ...report,
    targetDetails,
  });
}

async function handleUpdateReport(
  req: NextApiRequest,
  res: NextApiResponse,
  reportId: string
) {
  validateMethod(req, res, ['PUT']);
  const user = await authenticateUser(req);

  if (!user || user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'Apenas administradores podem atualizar reports' });
  }

  const { status, resolutionNotes, actionTaken } = req.body;

  if (
    !status ||
    !['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'].includes(status)
  ) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    return res.status(404).json({ error: 'Report não encontrado' });
  }

  const updatedReport = await prisma.report.update({
    where: { id: reportId },
    data: {
      status,
      resolutionNotes,
      actionTaken,
      resolvedAt:
        status === 'RESOLVED' || status === 'DISMISSED' ? new Date() : null,
      resolvedById: user.id,
      metadata: {
        ...(report.metadata as any),
        resolvedAt: new Date().toISOString(),
        resolvedByName: user.name,
        actionTaken,
      },
    },
    include: {
      resolvedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Create notification for reporter if report is resolved
  if (status === 'RESOLVED' || status === 'DISMISSED') {
    await prisma.notification.create({
      data: {
        userId: report.reporterId,
        type: 'REPORT_RESOLUTION',
        message: `O seu report foi ${status === 'RESOLVED' ? 'resolvido' : 'dismissed'}.`,
        metadata: {
          reportId: report.id,
          status,
          actionTaken,
          resolvedAt: new Date().toISOString(),
        },
      },
    });
  }

  return res.status(200).json({
    message: `Report ${status === 'RESOLVED' ? 'resolvido' : 'atualizado'} com sucesso`,
    report: updatedReport,
  });
}

async function handleDeleteReport(
  req: NextApiRequest,
  res: NextApiResponse,
  reportId: string
) {
  validateMethod(req, res, ['DELETE']);
  const user = await authenticateUser(req);

  if (!user || user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'Apenas administradores podem eliminar reports' });
  }

  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    return res.status(404).json({ error: 'Report não encontrado' });
  }

  await prisma.report.delete({
    where: { id: reportId },
  });

  return res.status(200).json({ message: 'Report eliminado com sucesso' });
}

async function fetchTargetDetails(targetId: string, targetType: string) {
  // Same function as in the index.ts file
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
