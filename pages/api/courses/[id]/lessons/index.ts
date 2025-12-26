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
    if (req.method === 'GET') {
      await handleGetLessons(req, res);
    } else if (req.method === 'POST') {
      await handleCreateLesson(req, res);
    } else {
      return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    handleApiError(res, error);
  }
}

async function handleGetLessons(req: NextApiRequest, res: NextApiResponse) {
  validateMethod(req, res, ['GET']);
  const user = await authenticateUser(req);
  if (!user) return res.status(401).json({ error: 'Não autorizado' });

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID do curso é obrigatório' });
  }

  // Verify user has access to course
  const course = await prisma.course.findUnique({
    where: { id },
    include: { enrollments: { where: { userId: user.id } } },
  });

  if (!course) return res.status(404).json({ error: 'Curso não encontrado' });
  if (course.teacherId !== user.id && course.enrollments.length === 0) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const lessons = await prisma.lesson.findMany({
    where: { courseId: course.id },
    orderBy: { order: 'asc' },
    include: { materials: true, assessment: true },
  });

  const lessonStatus = await prisma.userAssessment.findMany({
    where: {
      userId: user.id,
      assessment: {
        lesson: {
          id: { in: lessons.map((lesson) => lesson.id) },
        },
      },
    },
    select: { assessment: true, isPassed: true },
  });

  return res.status(200).json(
    lessons.map((lesson) => ({
      ...lesson,
      isPassed:
        lessonStatus.find((status) => status.assessment.lessonId === lesson.id)
          ?.isPassed || false,
    }))
  );
}

async function handleCreateLesson(req: NextApiRequest, res: NextApiResponse) {
  validateMethod(req, res, ['POST']);
  const user = await authenticateUser(req);

  if (!user) return res.status(401).json({ error: 'Não autorizado' });

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID do curso é obrigatório' });
  }

  const {
    title,
    description,
    videoUrl,
    isPreview = false,
    materials = [],
    estimatedTime,
    order,
  } = req.body;

  // Validate required fields
  if (!title || !description || !videoUrl) {
    return res.status(400).json({
      error: 'Título, descrição e vídeo são obrigatórios',
    });
  }

  try {
    // Verify course exists and user is the teacher
    const course = await prisma.course.findUnique({
      where: { id },
      select: { id: true, teacherId: true },
    });

    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    if (course.teacherId !== user.id) {
      return res.status(403).json({
        error: 'Apenas o professor do curso pode adicionar aulas',
      });
    }

    // Get the next order if not provided
    let lessonOrder = order;
    if (!lessonOrder) {
      const lastLesson = await prisma.lesson.findFirst({
        where: { courseId: course.id },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      lessonOrder = lastLesson ? lastLesson.order + 1 : 1;
    }

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim(),
        isPreview: Boolean(isPreview),
        estimatedTime: estimatedTime ? parseInt(estimatedTime) : null,
        order: lessonOrder,
        courseId: course.id,
      },
      include: {
        materials: true,
      },
    });

    // Create materials if provided
    if (materials && materials.length > 0) {
      for (const material of materials) {
        await prisma.lessonMaterial.create({
          data: {
            name: material.name?.trim() || 'Material',
            url: material.url.trim(),
            type: material.type || 'PDF',
            lessonId: lesson.id,
          },
        });
      }
    }

    // Return the lesson with updated materials
    const updatedLesson = await prisma.lesson.findUnique({
      where: { id: lesson.id },
      include: {
        materials: true,
      },
    });

    return res.status(201).json({
      message: 'Aula criada com sucesso',
      lesson: updatedLesson,
    });
  } catch (error: any) {
    console.error('Erro ao criar aula:', error);

    // Handle Prisma errors
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'Já existe uma aula com esta ordem neste curso' });
    }

    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Curso não encontrado' });
    }

    return res.status(500).json({
      error: 'Erro ao criar a aula. Por favor, tente novamente.',
    });
  }
}
