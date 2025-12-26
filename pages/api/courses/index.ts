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
    const { courseId } = req.query;

    // Handle GET for all courses (no courseId)
    if (req.method === 'GET' && !courseId) {
      await handleGetCourses(req, res);
      return;
    }

    // Handle operations with courseId
    if (!courseId || typeof courseId !== 'string') {
      return res.status(400).json({ error: 'ID do curso é obrigatório' });
    }

    // Route based on method and courseId
    if (req.method === 'GET') {
      await handleGetCourse(req, res, courseId);
    } else if (req.method === 'PUT') {
      await handleUpdateCourse(req, res, courseId);
    } else if (req.method === 'DELETE') {
      await handleDeleteCourse(req, res, courseId);
    } else {
      return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (err) {
    handleApiError(res, err);
  }
}

async function handleGetCourses(req: NextApiRequest, res: NextApiResponse) {
  validateMethod(req, res, ['GET']);
  const user = await authenticateUser(req);

  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // Get courses based on user role
  let whereCondition = {};
  if (user.role === 'TEACHER') {
    // Teachers see their own courses
    whereCondition = { teacherId: user.id };
  } else if (user.role === 'ADMIN') {
    // Admins see all courses
    whereCondition = {};
  } else {
    // Students see published courses
    whereCondition = { isPublished: true };
  }

  const courses = await prisma.course.findMany({
    where: whereCondition,
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      categories: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json(courses);
}

async function handleGetCourse(
  req: NextApiRequest,
  res: NextApiResponse,
  courseId: string
) {
  validateMethod(req, res, ['GET']);
  const user = await authenticateUser(req);

  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      categories: true,
      lessons: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          order: true,
          isPreview: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
          lessons: true,
        },
      },
    },
  });

  if (!course) {
    return res.status(404).json({ error: 'Curso não encontrado' });
  }

  // Check permissions: admin, course owner, or published course for students
  const isAdmin = user.role === 'ADMIN';
  const isOwner = course.teacherId === user.id;
  const isPublishedForStudent = course.isPublished && user.role === 'STUDENT';

  if (!isAdmin && !isOwner && !isPublishedForStudent) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  return res.status(200).json(course);
}

// handleUpdateCourse and handleDeleteCourse remain the same...
async function handleUpdateCourse(
  req: NextApiRequest,
  res: NextApiResponse,
  courseId: string
) {
  validateMethod(req, res, ['PUT']);
  const user = await authenticateUser(req);

  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const {
    title,
    description,
    thumbnail,
    startDate,
    price,
    categories,
    isPublished,
    level,
    isFree,
  } = req.body;

  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!existingCourse) {
    return res.status(404).json({ error: 'Curso não encontrado' });
  }

  if (existingCourse.teacherId !== user.id && user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({
        error:
          'Apenas o proprietário do curso ou administradores podem editá-lo',
      });
  }

  if (!title || title.trim().length < 3) {
    return res
      .status(400)
      .json({ error: 'O título deve ter pelo menos 3 caracteres' });
  }

  if (!description || description.trim().length < 10) {
    return res
      .status(400)
      .json({ error: 'A descrição deve ter pelo menos 10 caracteres' });
  }

  const calculatedIsFree = !price || price <= 0;
  const coursePrice = calculatedIsFree ? null : parseFloat(price);

  try {
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: title.trim(),
        description: description.trim(),
        thumbnail: thumbnail?.trim() || null,
        startDate: startDate ? new Date(startDate) : null,
        price: coursePrice,
        isFree: calculatedIsFree,
        isPublished: isPublished === true || isPublished === 'true',
        level: level || 'BEGINNER',
        categories:
          categories?.length > 0
            ? {
                set: [],
                connect: categories.map((id: string) => ({ id })),
              }
            : undefined,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: true,
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: 'Curso atualizado com sucesso',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({ error: 'Erro ao atualizar o curso' });
  }
}

async function handleDeleteCourse(
  req: NextApiRequest,
  res: NextApiResponse,
  courseId: string
) {
  validateMethod(req, res, ['DELETE']);
  const user = await authenticateUser(req);

  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return res.status(404).json({ error: 'Curso não encontrado' });
  }

  if (course.teacherId !== user.id && user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({
        error:
          'Apenas o proprietário do curso ou administradores podem eliminá-lo',
      });
  }

  const enrollmentCount = await prisma.enrollment.count({
    where: { courseId },
  });

  if (enrollmentCount > 0) {
    return res.status(400).json({
      error:
        'Não é possível eliminar um curso com estudantes inscritos. Considere arquivá-lo em vez de eliminá-lo.',
    });
  }

  try {
    await prisma.lesson.deleteMany({
      where: { courseId },
    });

    await prisma.course.delete({
      where: { id: courseId },
    });

    return res.status(200).json({ message: 'Curso eliminado com sucesso' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({ error: 'Erro ao eliminar o curso' });
  }
}
