import type { AutocompleteProps } from '@mui/material/Autocomplete';

import { useState, useEffect, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useDebounce } from 'src/hooks/use-debounce';

import type { User } from 'src/lib/orval/generated/model';
import { useUsersControllerFindAllAdministrative } from 'src/lib/orval/generated/users/users';
import { Avatar, Box, Stack } from '@mui/material';

// ----------------------------------------------------------------------

type UserWithId = User & { _id?: string; name?: string; email?: string };

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
} & Partial<AutocompleteProps<User, false, false, false>>;

export function RHFAutocompleteLeadContact({
  name,
  label = 'Lead Contact',
  placeholder = 'Search lead contacts...',
  helperText,
  required,
  ...other
}: Props) {
  const { control } = useFormContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [allOptions, setAllOptions] = useState<UserWithId[]>([]);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading, isFetching } = useUsersControllerFindAllAdministrative({
    search: debouncedSearch || undefined,
    page,
    limit: 20,
  });

  // Update allOptions when data changes
  useEffect(() => {
    const currentData = data?.data || [];
    if (page === 1) {
      setAllOptions(currentData);
    } else if (page > 1 && currentData.length > 0) {
      setAllOptions((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));
        const uniqueNewItems = currentData.filter((item: UserWithId) => !existingIds.has(item._id));
        return uniqueNewItems.length > 0 ? [...prev, ...uniqueNewItems] : prev;
      });
    }
  }, [data, page]);

  const handleInputChange = useCallback((_event: React.SyntheticEvent, value: string) => {
    setSearchQuery(value);
    setPage(1);
    setAllOptions([]);
  }, []);

  const handleScroll = useCallback(
    (event: React.SyntheticEvent) => {
      const listboxNode = event.currentTarget;
      const threshold = 10; // pixels from bottom

      if (
        listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - threshold &&
        !isFetching &&
        data &&
        data.data?.length === 20 // Only load more if we got a full page
      ) {
        setPage((prev) => prev + 1);
      }
    },
    [isFetching, data]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          options={allOptions}
          loading={isLoading}
          getOptionLabel={(option: User) => option.firstName + ' ' + option.lastName}
          isOptionEqualToValue={(option, value) => option._id === value?._id}
          onInputChange={handleInputChange}
          onChange={(_event, value) => {
            console.log('leadContact', value);
            field.onChange(value);
          }}
          filterOptions={(x) => x} // Disable client-side filtering since we're doing server-side search
          ListboxProps={{
            onScroll: handleScroll,
            style: { maxHeight: '300px' },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error?.message ?? helperText}
              required={required}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading || isFetching ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option: UserWithId) => (
            <li {...props} key={option._id}>
              <Stack direction={'row'} alignItems={'center'} gap={1}>
                <Avatar alt={option.firstName + ' ' + option.lastName}>
                  {(option.firstName as string).charAt(0)}
                  {(option.lastName as string).charAt(0)}
                </Avatar>
                <Box mt={0}>
                  <div style={{ fontWeight: 500 }}>
                    {option.firstName + ' ' + option.lastName || 'Unknown'}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    {option.email || 'No email'}
                  </div>
                </Box>
              </Stack>
            </li>
          )}
          {...other}
        />
      )}
    />
  );
}
