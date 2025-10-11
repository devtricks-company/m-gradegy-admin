import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';

import type { ExperienceType } from 'src/lib/orval/generated/model';
import { useExperienceTypesControllerFindAll } from 'src/lib/orval/generated/experience-types/experience-types';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  native?: boolean;
};

export function RHFSelectExperienceType({
  name,
  helperText,
  native = false,
  ...other
}: Props) {
  const { control } = useFormContext();

  // Fetch experience types using Orval-generated hook
  const { data: experienceTypes, isLoading } = useExperienceTypesControllerFindAll();

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
          disabled={isLoading}
          InputProps={{
            endAdornment: isLoading ? (
              <CircularProgress color="inherit" size={20} sx={{ mr: 2 }} />
            ) : null,
          }}
          {...other}
        >
          {native ? (
            <>
              <option value="">Select experience type</option>
              {experienceTypes?.map((type: ExperienceType) => (
                <option key={type.title} value={type.title}>
                  {type.title}
                </option>
              ))}
            </>
          ) : (
            <>
              <MenuItem value="">
                <em>Select experience type</em>
              </MenuItem>
              {experienceTypes?.map((type: ExperienceType) => (
                <MenuItem key={type.title} value={type.title}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {type.icon && (
                      <Iconify icon={type.icon} width={24} sx={{ color: type.color }} />
                    )}
                    <span>{type.title}</span>
                    <Chip
                      size="small"
                      sx={{
                        ml: 'auto',
                        bgcolor: type.color,
                        color: 'white',
                        height: 20,
                        '& .MuiChip-label': { px: 1 },
                      }}
                      label={type.color}
                    />
                  </Box>
                </MenuItem>
              ))}
            </>
          )}
        </TextField>
      )}
    />
  );
}
