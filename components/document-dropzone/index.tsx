import { MediaType } from '@prisma/client';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { uploadToCloudinary } from '@/lib/cloudinary';

interface FileUploaderProps {
  onUploadStart: () => void;
  onUploadComplete: (file: { url: string; type: MediaType }) => void;
  folder: string;
  accept?: string[];
  maxSize?: number;
  label?: string;
  single?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadStart,
  onUploadComplete,
  folder,
  accept = ['image/*', 'video/*', 'application/pdf', 'audio/*'],
  maxSize = 100 * 1024 * 1024, // 100MB
  label = "Drag 'n' drop files here, or click to select files",
  single = false,
}) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      onUploadStart();
      setError(null);

      try {
        // For single upload, take the first file only
        const filesToUpload = single ? [acceptedFiles[0]] : acceptedFiles;

        for (const file of filesToUpload) {
          const result = await uploadToCloudinary(file, folder);
          onUploadComplete({
            url: result.url,
            type: result.type as MediaType,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      }
    },
    [onUploadStart, onUploadComplete, folder, single]
  );

  // Convert string array to Accept object format
  const acceptObject = React.useMemo(() => {
    const result: Record<string, string[]> = {};
    accept.forEach((type) => {
      result[type] = [];
    });
    return result;
  }, [accept]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptObject,
    maxSize,
    multiple: !single,
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg
            className={`mx-auto h-12 w-12 ${
              isDragActive ? 'text-blue-500' : 'text-gray-400'
            }`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex flex-col items-center justify-center text-sm">
            <p className="font-medium text-gray-700">{label}</p>
            <p className="text-xs text-gray-500 mt-1">
              {accept.join(', ').replace(/\*/g, '')} files up to{' '}
              {maxSize / 1024 / 1024}MB
            </p>
          </div>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUploader;
