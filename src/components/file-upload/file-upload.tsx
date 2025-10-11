'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import type { Theme, SxProps } from '@mui/material/styles';

import { useAzurestorageControllerUploadImage } from 'src/lib/orval/generated/azurestorage/azurestorage';
import type { UploadResultDto } from 'src/lib/orval/generated/model';

import { Upload } from '../upload';

// ----------------------------------------------------------------------

export type FileUploadProps = {
  sx?: SxProps<Theme>;
  error?: boolean;
  disabled?: boolean;
  helperText?: React.ReactNode;
  accept?: Record<string, string[]>;
  maxSize?: number;
  defaultFile?: string | File;
  onSuccess?: (result: UploadResultDto) => void;
  onError?: (error: Error) => void;
};

export function FileUpload({
  sx,
  error,
  disabled,
  helperText,
  accept = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  },
  maxSize = 5242880, // 5MB
  defaultFile,
  onSuccess,
  onError,
}: FileUploadProps) {
  const [file, setFile] = useState<File | string | null>(defaultFile || null);

  const { mutate: uploadImage, isPending } = useAzurestorageControllerUploadImage({
    mutation: {
      onSuccess: (response) => {
        onSuccess?.(response);
      },
      onError: (err) => {
        onError?.(new Error(err.message || 'Upload failed'));
        setFile(null);
      },
    },
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFile = acceptedFiles[0];
      if (newFile) {
        setFile(newFile);
        // Auto-upload on file selection
        uploadImage({
          data: { file: newFile },
        });
      }
    },
    [uploadImage]
  );

  const handleDelete = useCallback(() => {
    setFile(null);
  }, []);

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <Upload
        value={file}
        onDrop={handleDrop}
        onDelete={handleDelete}
        accept={accept}
        maxSize={maxSize}
        error={error}
        disabled={disabled || isPending}
        helperText={helperText}
      />

      {isPending && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
