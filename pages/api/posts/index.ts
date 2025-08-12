import { Tag } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib';
import {
  authenticateUser,
  handleApiError,
  validateMethod,
} from '@/lib/api-utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  validateMethod(req, res, ['GET', 'POST']);
  const user = await authenticateUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10 } = req.query;

      const pageNum = Number(page);
      const limitNum = Number(limit);

      if (isNaN(pageNum) || isNaN(limitNum)) {
        return res
          .status(400)
          .json({ error: 'Invalid page or limit parameters' });
      }

      const posts = await prisma.post.findMany({
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              image: true,
            },
          },
          tags: true,
          attachments: true,
          comments: {
            take: 3,
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const transformedPosts = posts.map((post) => ({
        ...post,
        comments: post.comments || [],
        likes: post.likes || [],
        attachments: post.attachments || [],
        tags: post.tags || [],
        isLiked: post.likes.some((like) => like.userId === user.id),
      }));

      return res.status(200).json(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { content, tags = [], attachments = [] } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const post = await prisma.post.create({
        data: {
          content,
          author: {
            connect: {
              id: user.id,
            },
          },
          tags: {
            connectOrCreate: tags.map((tag: Tag) => ({
              where: {
                id: tag.id || { name_type: { name: tag.name, type: tag.type } },
              },
              create: {
                name: tag.name,
                type: tag.type,
                ...(tag.type === 'USER' && {
                  users: {
                    connect: { id: tag.id },
                  },
                }),
              },
            })),
          },
          attachments: {
            create: attachments,
          },
        },
        include: {
          author: true,
          tags: true,
          attachments: true,
        },
      });

      return res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error);
      handleApiError(res, error, 500);
    }
  }
}
