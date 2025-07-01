// pages/api/pet/[id]/toys.ts
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib';
import { authenticate } from '@/lib/auth-middleware';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await authenticate(req, res);
  if (!user) return;

  const { id: petId } = req.query;

  if (typeof petId !== 'string') {
    return res.status(400).json({ error: 'Invalid pet ID' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const toys = await prisma.toy.findMany({
          where: { petId },
          orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(toys);
      }

      case 'POST': {
        const { name } = req.body;
        if (!name) {
          return res.status(400).json({ error: 'Toy name is required' });
        }

        const newToy = await prisma.toy.create({
          data: { petId, name },
        });
        return res.status(201).json(newToy);
      }

      case 'PUT': {
        const { toyId, name } = req.body;
        if (!toyId || !name) {
          return res.status(400).json({ error: 'toyId and name are required' });
        }

        const existingToy = await prisma.toy.findUnique({
          where: { id: toyId },
        });
        if (!existingToy || existingToy.petId !== petId) {
          return res.status(404).json({ error: 'Toy not found for this pet' });
        }

        const updatedToy = await prisma.toy.update({
          where: { id: toyId },
          data: { name },
        });
        return res.status(200).json(updatedToy);
      }

      case 'DELETE': {
        const { toyId } = req.body;
        if (!toyId) {
          return res.status(400).json({ error: 'toyId is required' });
        }

        const existingToy = await prisma.toy.findUnique({
          where: { id: toyId },
        });
        if (!existingToy || existingToy.petId !== petId) {
          return res.status(404).json({ error: 'Toy not found for this pet' });
        }

        await prisma.toy.delete({ where: { id: toyId } });
        return res.status(204).end();
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res
          .status(405)
          .json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Toy API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
