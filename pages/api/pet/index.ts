// api/pets/index.ts
import { NextApiRequest, NextApiResponse } from 'next';

import { authenticate, prisma } from '@/lib';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await authenticate(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    try {
      const pets = await prisma.pet.findMany({
        include: {
          toys: true,
        },
      });
      res.status(200).json(pets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pets' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
