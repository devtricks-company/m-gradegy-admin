import type { FileUploadProps } from 'src/components/file-upload';

import { useFormContext, Controller } from 'react-hook-form';

import { FileUpload } from 'src/components/file-upload';

// ----------------------------------------------------------------------

export type RHFFileUploadProps = FileUploadProps & {
  name: string;
};

export function RHFFileUpload({ name, onSuccess, onError, ...other }: RHFFileUploadProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FileUpload
          {...other}
          onSuccess={(result) => {
            setValue(name, result.url);
            onSuccess?.(result);
          }}
          onError={(uploadError) => {
            onError?.(uploadError);
          }}
          helperText={error?.message}
        />
      )}
    />
  );
}
