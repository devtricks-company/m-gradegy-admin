import type { SwitchProps } from '@mui/material/Switch';

import { Controller, useFormContext } from 'react-hook-form';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// ----------------------------------------------------------------------

type Props = Omit<SwitchProps, 'name'> & {
  name: string;
  label?: string;
  helperText?: string;
};

export function RHFSwitch({ name, label, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={<Switch {...field} checked={field.value} {...other} />}
          label={label || ''}
        />
      )}
    />
  );
}
