import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormHelperText } from '@mui/material';

// ----------------------------------------------------------------------

type Props = DatePickerProps<Dayjs> & {
  name: string;
  helperText?: React.ReactNode;
};

export function RHFDatePicker({ name, helperText, ...other }: Props) {
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
            <DatePicker
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
