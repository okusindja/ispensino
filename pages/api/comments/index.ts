import { NextApiRequest, NextApiResponse } from 'next';

import { sendNotification } from '@/lib';
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
    validateMethod(req, res, ['GET', 'POST', 'DELETE']);
    const user = await authenticateUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { lessonId } = req.query;

    if (req.method === 'GET') {
      const comments = await prisma.comment.findMany({
        where: { lessonId: lessonId as string, parentId: null },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              firebaseId: true,
            },
          },
          likes: {
            include: {
              user: {
                select: {
                  firebaseId: true,
                },
              },
            },
            where: { userId: user.id },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  firebaseId: true,
                },
              },
              likes: {
                where: { userId: user.id },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
          _count: {
            select: {
              likes: true,
              replies: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(comments);
    }

    if (req.method === 'POST') {
      const { content, parentId, tempId } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      // First create the comment
      const comment = await prisma.comment.create({
        data: {
          content,
          authorId: user.id,
          lessonId: lessonId as string,
          parentId: parentId || null,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          likes: {
            where: { userId: user.id },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      // Then fetch additional relations if needed for notifications
      if (parentId) {
        const parentComment = await prisma.comment.findUnique({
          where: { id: parentId },
          select: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        if (parentComment && parentComment.author.id !== user.id) {
          await sendNotification(
            parentComment.author.id,
            `${user.name} replied to your comment`,
            'COMMENT'
          );
        }
      } else {
        const lessonWithTeacher = await prisma.lesson.findUnique({
          where: { id: lessonId as string },
          select: {
            course: {
              select: {
                teacher: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        if (lessonWithTeacher?.course.teacher.id !== user.id) {
          await sendNotification(
            lessonWithTeacher?.course.teacher.id as string,
            `${user.name} commented on your lesson`,
            'COMMENT'
          );
        }
      }

      return res.status(201).json({ ...comment, tempId });
    }

    if (req.method === 'DELETE') {
      const { commentId } = req.body;
      if (!commentId)
        return res.status(400).json({ error: 'Comment ID required' });

      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { authorId: true },
      });

      if (!comment) return res.status(404).json({ error: 'Comment not found' });
      if (comment.authorId !== user.id)
        return res.status(403).json({ error: 'Unauthorized' });

      await prisma.comment.delete({ where: { id: commentId } });
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    handleApiError(res, error);
  }
}
