import { MediaType } from '@prisma/client';

export const uploadToCloudinary = async (
  file: File,
  folder: string
): Promise<{ url: string; type: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );
  formData.append('folder', folder);
  formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      type: getMediaType(data.resource_type, data.format),
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Upload failed. Please try again.');
  }
};

const getMediaType = (resourceType: string, format: string): MediaType => {
  if (resourceType === 'image') return 'IMAGE';
  if (resourceType === 'video') return 'VIDEO';
  if (format === 'pdf') return 'PDF';
  if (resourceType === 'raw') return 'AUDIO';
  return 'PDF';
};
