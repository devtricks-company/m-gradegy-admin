import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';

import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormHelperText } from '@mui/material';

// ----------------------------------------------------------------------

type Props = DatePickerProps<Date> & {
  name: string;
  helperText?: React.ReactNode;
};

export function RHFDatePicker({ name, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <DatePicker
            {...field}
            value={field.value || null}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error ? error?.message : helperText,
              },
            }}
            {...other}
          />
        </div>
      )}
    />
  );
}
