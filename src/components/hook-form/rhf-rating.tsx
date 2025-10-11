import type { RatingProps } from '@mui/material/Rating';

import { Controller, useFormContext } from 'react-hook-form';

import Rating from '@mui/material/Rating';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

// ----------------------------------------------------------------------

type Props = Omit<RatingProps, 'name'> & {
  name: string;
  helperText?: string;
};

export function RHFRating({ name, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error}>
          <Rating
            {...field}
            onChange={(event, newValue) => {
              field.onChange(newValue);
            }}
            {...other}
          />
          {(error || helperText) && (
            <FormHelperText>{error?.message ?? helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
