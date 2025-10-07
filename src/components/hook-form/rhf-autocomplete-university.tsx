import type { AutocompleteProps } from '@mui/material/Autocomplete';

import { useState, useEffect, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useDebounce } from 'src/hooks/use-debounce';

import type { University } from 'src/lib/orval/generated/model';
import { useUniversitiesControllerFindAll } from 'src/lib/orval/generated/universities/universities';

// ----------------------------------------------------------------------

type UniversityWithId = University & { _id?: string };

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
} & Partial<AutocompleteProps<University, false, false, false>>;

export function RHFAutocompleteUniversity({
  name,
  label = 'University',
  placeholder = 'Search universities...',
  helperText,
  required,
  ...other
}: Props) {
  const { control } = useFormContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [allOptions, setAllOptions] = useState<UniversityWithId[]>([]);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading, isFetching } = useUniversitiesControllerFindAll({
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
        const existingIds = new Set(prev.map((item) => item.united_id));
        const uniqueNewItems = currentData.filter((item) => !existingIds.has(item.united_id));
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
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.instnm || '')}
          isOptionEqualToValue={(option, value) => option.united_id === value?.united_id}
          onInputChange={handleInputChange}
          onChange={(_event, value) => {
            console.log('university value', value);
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
          renderOption={(props, option: UniversityWithId) => (
            <li {...props} key={option._id || option.united_id}>
              <div>
                <div style={{ fontWeight: 500 }}>{option.instnm}</div>
                <div style={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                  {option.city}, {option.stabbr} • {option.united_id}
                </div>
              </div>
            </li>
          )}
          {...other}
        />
      )}
    />
  );
}
