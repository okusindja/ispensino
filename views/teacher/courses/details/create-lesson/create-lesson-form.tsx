/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { zodResolver } from '@hookform/resolvers/zod';
import { MediaType } from '@prisma/client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FileUploader } from '@/components';
import { fetcherWithCredentials } from '@/constants/swr';

// Zod validation schema
const lessonSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, "Title can't exceed 100 characters"),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, "Description can't exceed 1000 characters"),
  isPreview: z.boolean().default(false),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  courseId: string;
  onSuccess: () => void;
}

const LessonForm: React.FC<LessonFormProps> = ({ courseId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [materials, setMaterials] = useState<
    { name: string; url: string; type: MediaType }[]
  >([]);
  const [videoUploading, setVideoUploading] = useState(false);
  const [materialsUploading, setMaterialsUploading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema) as unknown as any,
    defaultValues: {
      isPreview: false,
    },
  });

  const handleSubmitLesson = async (data: LessonFormData) => {
    if (!videoUrl) {
      setServerError('Video is required');
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetcherWithCredentials(
        `/api/courses/${courseId}/lessons`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            videoUrl,
            materials,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create lesson');
      }

      onSuccess();
    } catch (error) {
      console.error('Submission error:', error);
      setServerError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitLesson)} className="space-y-6">
      {serverError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {serverError}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Lesson Title *
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Introduction to Algebra"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description *
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Describe what students will learn in this lesson..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="isPreview"
          type="checkbox"
          {...register('isPreview')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isPreview" className="ml-2 block text-sm text-gray-900">
          Make this lesson available as a preview
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lesson Video *
        </label>
        {videoUrl ? (
          <div className="mb-4 p-3 bg-blue-50 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-blue-600 font-medium">Video uploaded</span>
            </div>
            <button
              type="button"
              onClick={() => setVideoUrl('')}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ) : (
          <FileUploader
            onUploadStart={() => setVideoUploading(true)}
            onUploadComplete={(file) => {
              setVideoUrl(file.url);
              setVideoUploading(false);
            }}
            folder={`courses/${courseId}/videos`}
            accept={['video/*']}
            single={true}
            label="Upload Video File (MP4, MOV, etc.)"
          />
        )}
        {videoUploading && (
          <p className="mt-2 text-sm text-blue-600">Uploading video...</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lesson Materials
        </label>
        <FileUploader
          onUploadStart={() => setMaterialsUploading(true)}
          onUploadComplete={(file) => {
            setMaterials((prev) => [
              ...prev,
              {
                name: file.url.split('/').pop() || 'Material',
                url: file.url,
                type: file.type,
              },
            ]);
            setMaterialsUploading(false);
          }}
          folder={`courses/${courseId}/materials`}
          label="Upload Materials (PDF, Images, etc.)"
        />
        {materialsUploading && (
          <p className="mt-2 text-sm text-blue-600">Uploading materials...</p>
        )}

        {materials.length > 0 && (
          <div className="mt-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              Uploaded Materials
            </h3>
            {materials.map((material, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
              >
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={material.name}
                    onChange={(e) => {
                      const updated = [...materials];
                      updated[index].name = e.target.value;
                      setMaterials(updated);
                    }}
                    className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                    placeholder="Material name"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setMaterials((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="ml-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isSubmitting || videoUploading || materialsUploading}
        >
          {isSubmitting ? 'Creating Lesson...' : 'Create Lesson'}
        </button>
      </div>
    </form>
  );
};

export default LessonForm;
