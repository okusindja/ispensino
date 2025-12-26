import { LicenseType, ResourceType } from '@prisma/client';
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
      await handleGet(req, res);
    } else if (req.method === 'POST') {
      await handlePost(req, res);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    handleApiError(res, error);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  validateMethod(req, res, ['GET']);
  const user = await authenticateUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { id, journal, search, category, year } = req.query;

  // Get single article
  if (id && typeof id === 'string') {
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
  }

  // Get all articles with optional filtering
  const whereClause: any = {};

  if (journal && typeof journal === 'string') {
    whereClause.journal = { contains: journal, mode: 'insensitive' };
  }

  if (category && typeof category === 'string') {
    whereClause.categories = {
      some: {
        id: category,
      },
    };
  }

  if (search && typeof search === 'string') {
    const searchTerm = search.toLowerCase();
    whereClause.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { abstract: { contains: searchTerm, mode: 'insensitive' } },
      { journal: { contains: searchTerm, mode: 'insensitive' } },
      { keywords: { hasSome: [searchTerm] } },
      {
        authors: {
          some: { name: { contains: searchTerm, mode: 'insensitive' } },
        },
      },
    ];
  }

  if (year && typeof year === 'string') {
    const parsedYear = Number(year);

    if (!isNaN(parsedYear)) {
      whereClause.publishedAt = {
        gte: new Date(`${parsedYear}-01-01`),
        lte: new Date(`${parsedYear}-12-31`),
      };
    }
  }

  const articles = await prisma.scientificArticle.findMany({
    where: whereClause,
    include: {
      authors: true,
      categories: true,
    },
    orderBy: { publishedAt: 'desc' },
  });

  return res.status(200).json(articles);
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  validateMethod(req, res, ['POST']);
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

  try {
    // Handle categories - create them if they don't exist
    const categoryConnections = await Promise.all(
      (categories || []).map(async (categoryName: string) => {
        // Check if category exists
        let category = await prisma.category.findUnique({
          where: { name: categoryName },
        });

        // Create category if it doesn't exist
        if (!category) {
          category = await prisma.category.create({
            data: {
              name: categoryName,
              description: `Categoria criada automaticamente para o artigo: ${title}`,
            },
          });
        }

        return { id: category.id };
      })
    );

    // Handle tags - create them if they don't exist
    const tagConnections = await Promise.all(
      (tags || []).map(async (tagName: string) => {
        // Check if tag exists
        let tag = await prisma.tag.findFirst({
          where: {
            name: tagName,
            type: 'TOPIC', // Assuming scientific article tags are of type TOPIC
          },
        });

        // Create tag if it doesn't exist
        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagName,
              type: 'TOPIC',
            },
          });
        }

        return { id: tag.id };
      })
    );

    // Create the Scientific Article
    const article = await prisma.scientificArticle.create({
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
        resourceType: ResourceType.SCIENTIFIC_ARTICLE,
        authors: {
          create: authors.map((author: any) => ({
            name: author.name,
            affiliation: author.affiliation || null,
            email: author.email || null,
            userId: user.id,
          })),
        },
        references: {
          create: (references || []).map((citation: string) => ({
            citation,
          })),
        },
        categories: {
          connect: categoryConnections,
        },
        tags: {
          connect: tagConnections,
        },
      },
      include: {
        authors: true,
        categories: true,
        tags: true,
        references: true,
      },
    });

    return res.status(201).json(article);
  } catch (error) {
    console.error('Error creating scientific article:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
