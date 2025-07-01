// api/animals/create.ts
import { BreedType, SpeciesType } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { Fields, File, IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib';
import { authenticate } from '@/lib/auth-middleware';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!cloudinary.config().api_key || !cloudinary.config().api_secret) {
    console.error('Cloudinary credentials missing');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const user = await authenticate(req, res);
  if (!user) return;

  const form = new IncomingForm();

  try {
    const [fields, files] = await new Promise<
      [Fields, { [key: string]: File | File[] }]
    >((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields as Fields, files as { [key: string]: File | File[] }]);
      });
    });

    let photoUrl: string | undefined = undefined;

    if (files.photo && !Array.isArray(files.photo)) {
      try {
        const uploadResult = await cloudinary.uploader.upload(
          files.photo.filepath,
          {
            folder: 'animal-photos',
            use_filename: true,
            unique_filename: true,
          }
        );
        photoUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('Photo upload failed:', error);
        throw new Error('Failed to upload animal photo');
      }
    }

    const authenticatedUser = await prisma.user.findUnique({
      where: { firebaseId: user.uid },
      select: { id: true },
    });

    if (!authenticatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newPet = await prisma.pet.create({
      data: {
        userId: authenticatedUser.id,
        name: Array.isArray(fields.name) ? fields.name[0] : fields.name || '',
        species: (Array.isArray(fields.species)
          ? fields.species[0]
          : fields.species) as SpeciesType,
        breed:
          ((Array.isArray(fields.breed)
            ? fields.breed[0]
            : fields.breed) as BreedType) || 'UNKNOWN',
        birthdate: fields.birthdate
          ? new Date(
              Array.isArray(fields.birthdate)
                ? fields.birthdate[0]
                : fields.birthdate
            )
          : new Date(),
        allergies: Array.isArray(fields.allergies)
          ? fields.allergies[0]
          : fields.allergies || undefined,
        photoUrl,
      },
    });

    res.status(201).json(newPet);
  } catch (error) {
    console.error('Pet creation failed:', error);
    res.status(500).json({
      error: 'Failed to create pet',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
