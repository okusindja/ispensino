// pages/api/monographs/index.ts
import { AcademicalCourses, ResourceType } from '@prisma/client';
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

  const { id, course, search } = req.query;

  // Get single monograph
  if (id && typeof id === 'string') {
    const monograph = await prisma.monograph.findUnique({
      where: { id },
    });

    if (!monograph) {
      return res.status(404).json({ error: 'Monograph not found' });
    }

    return res.status(200).json(monograph);
  }

  // Get all monographs with optional filtering
  const whereClause: any = {};

  if (course && typeof course === 'string') {
    whereClause.course = course as AcademicalCourses;
  }

  if (search && typeof search === 'string') {
    const searchTerm = search.toLowerCase();
    whereClause.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { author: { contains: searchTerm, mode: 'insensitive' } },
      { advisor: { contains: searchTerm, mode: 'insensitive' } },
      { tags: { hasSome: [searchTerm] } }, // Search within tags array
    ];
  }

  const monographs = await prisma.monograph.findMany({
    where: whereClause,
    orderBy: { publishedAt: 'desc' },
  });

  return res.status(200).json(monographs);
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  validateMethod(req, res, ['POST']);
  const user = await authenticateUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { title, author, advisor, course, publishedAt, url, tags } = req.body;

  // Validation
  if (!title || !author || !advisor || !course || !publishedAt || !url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!Object.values(AcademicalCourses).includes(course)) {
    return res.status(400).json({ error: 'Invalid course value' });
  }

  // Create the Monograph with string array tags
  const monograph = await prisma.monograph.create({
    data: {
      title,
      author,
      advisor,
      course: course as AcademicalCourses,
      publishedAt: new Date(publishedAt),
      url,
      resourceType: ResourceType.MONOGRAPH,
      tags: tags || [], // Directly store as string array
    },
  });

  return res.status(201).json(monograph);
}
