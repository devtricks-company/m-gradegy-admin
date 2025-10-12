import type { TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useFormContext, Controller } from 'react-hook-form';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { FormHelperText } from '@mui/material';

// ----------------------------------------------------------------------

type Props = TimePickerProps<Dayjs> & {
  name: string;
  helperText?: React.ReactNode;
};

export function RHFTimePicker({ name, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Convert Date to Dayjs for display, or null if no value
        const displayValue = field.value ? dayjs(field.value) : null;

        return (
          <div>
            <TimePicker
              value={displayValue}
              onChange={(newValue: Dayjs | null) => {
                // Convert Dayjs to native Date object for form storage, or undefined if null
                const dateValue = newValue?.isValid() ? newValue.toDate() : undefined;
                field.onChange(dateValue);
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
        );
      }}
    />
  );
}
