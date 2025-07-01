import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib';
import { authenticate } from '@/lib/auth-middleware';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const user = await authenticate(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    try {
      const event = await prisma.pet.findUnique({
        where: { id: id as string },
        include: {
          toys: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!event) return res.status(404).json({ error: 'Event not found' });

      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
