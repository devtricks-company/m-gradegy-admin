import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export type RHFSelectOption = {
  label: string;
  value: string | number | boolean;
};

type Props = TextFieldProps & {
  name: string;
  options: RHFSelectOption[];
  native?: boolean;
};

export function RHFSelect({ name, helperText, options, native = false, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{ native }}
          error={!!error}
          helperText={error?.message ?? helperText}
          {...other}
        >
          {native ? (
            <>
              <option value="" />
              {options.map((option) => (
                <option key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </option>
              ))}
            </>
          ) : (
            options.map((option) => (
              <MenuItem key={String(option.value)} value={String(option.value)}>
                {option.label}
              </MenuItem>
            ))
          )}
        </TextField>
      )}
    />
  );
}
