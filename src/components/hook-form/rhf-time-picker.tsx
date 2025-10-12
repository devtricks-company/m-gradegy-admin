import type { TimePickerProps } from '@mui/x-date-pickers/TimePicker';

import { useFormContext, Controller } from 'react-hook-form';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { FormHelperText } from '@mui/material';

// ----------------------------------------------------------------------

type Props = TimePickerProps<Date> & {
  name: string;
  helperText?: React.ReactNode;
};

export function RHFTimePicker({ name, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <TimePicker
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
