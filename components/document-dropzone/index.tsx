import { MediaType } from '@prisma/client';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { uploadToCloudinary } from '@/lib/cloudinary';
import { Div } from '@stylin.js/elements';
import { Typography } from '@/elements/typography';

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
    <Div mb="L">
      <Div {...getRootProps()}>
        <input {...getInputProps()} />
        <Div border="1px dashed gray" p="L" borderRadius="M">
          <Div display="grid" gap="M">
            <Typography variant="body" size="medium" color="text">
              {label}
            </Typography>
            <Typography variant="body" size="medium" color="text">
              {accept.join(', ').replace(/\*/g, '')} com limite máximo de{' '}
              {maxSize / 1024 / 1024}MB
            </Typography>
          </Div>
        </Div>
      </Div>
      {error && (
        <Typography variant="body" size="medium" color="error">
          {error}
        </Typography>
      )}
    </Div>
  );
};

export default FileUploader;
