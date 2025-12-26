import { LicenseType } from '@prisma/client';
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
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res
        .status(400)
        .json({ error: 'Scientific Article ID is required' });
    }

    if (req.method === 'GET') {
      validateMethod(req, res, ['GET']);
      const user = await authenticateUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const article = await prisma.scientificArticle.findUnique({
        where: { id },
        include: {
          authors: true,
          categories: true,
          tags: true,
          references: true,
        },
      });

      if (!article) {
        return res.status(404).json({ error: 'Scientific article not found' });
      }

      return res.status(200).json(article);
    } else if (req.method === 'PUT') {
      validateMethod(req, res, ['PUT']);
      const user = await authenticateUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const {
        title,
        abstract,
        keywords,
        doi,
        url,
        journal,
        volume,
        issue,
        pages,
        publishedAt,
        license,
        authors,
        references,
        categories,
        tags,
      } = req.body;

      // Validation
      if (
        !title ||
        !abstract ||
        !keywords ||
        !url ||
        !publishedAt ||
        !license ||
        !authors
      ) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!Object.values(LicenseType).includes(license)) {
        return res.status(400).json({ error: 'Invalid license value' });
      }

      // Update the Scientific Article
      const article = await prisma.scientificArticle.update({
        where: { id },
        data: {
          title,
          abstract,
          keywords,
          doi: doi || null,
          url,
          journal: journal || null,
          volume: volume || null,
          issue: issue || null,
          pages: pages || null,
          publishedAt: new Date(publishedAt),
          license: license as LicenseType,
          authors: {
            deleteMany: {}, // Remove existing authors
            create: authors.map((author: any) => ({
              name: author.name,
              affiliation: author.affiliation || null,
              email: author.email || null,
              userId: user.id,
            })),
          },
          references: {
            deleteMany: {}, // Remove existing references
            create: (references || []).map((citation: string) => ({
              citation,
            })),
          },
          categories: {
            set: (categories || []).map((id: string) => ({ id })),
          },
          tags: {
            set: (tags || []).map((id: string) => ({ id })),
          },
        },
        include: {
          authors: true,
          categories: true,
          tags: true,
          references: true,
        },
      });

      return res.status(200).json(article);
    } else if (req.method === 'DELETE') {
      validateMethod(req, res, ['DELETE']);
      const user = await authenticateUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      await prisma.scientificArticle.delete({
        where: { id },
      });

      return res.status(204).end();
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    handleApiError(res, error);
  }
}
