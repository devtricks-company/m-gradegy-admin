'use client';

import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { useDebounce } from 'src/hooks/use-debounce';

import { Iconify } from 'src/components/iconify';

import { useUsersControllerFindAll } from 'src/lib/orval/generated/users/users';

import type { User } from 'src/lib/orval/generated/model';

// ----------------------------------------------------------------------

type StudentUser = User & {
  _id: string;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
};

export function StudentsTable() {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading, error } = useUsersControllerFindAll();

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const columns: GridColDef<StudentUser>[] = useMemo(
    () => [
      {
        field: 'avatar',
        headerName: '',
        width: 60,
        sortable: false,
        renderCell: (params) => (
          <Avatar src={params.row.avatarUrl} sx={{ width: 40, height: 40 }}>
            {params.row.firstName?.charAt(0) || params.row.email?.charAt(0) || 'S'}
          </Avatar>
        ),
      },
      {
        field: 'fullName',
        headerName: 'Full Name',
        flex: 1,
        minWidth: 200,
        valueGetter: (_value, row) => {
          const firstName = row.firstName || '';
          const lastName = row.lastName || '';
          return `${firstName} ${lastName}`.trim() || 'N/A';
        },
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'phoneNumber',
        headerName: 'Phone Number',
        flex: 1,
        minWidth: 150,
        valueGetter: (_value, row) => row.phoneNumber || 'N/A',
      },
    ],
    []
  );

  // Filter rows based on search query
  const filteredRows = useMemo(() => {
    const students = (data || []) as StudentUser[];
    if (!debouncedSearch) return students;

    const searchLower = debouncedSearch.toLowerCase();
    return students.filter((student) => {
      const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
      const email = (student.email || '').toLowerCase();
      return fullName.includes(searchLower) || email.includes(searchLower);
    });
  }, [data, debouncedSearch]);

  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search students by name or email..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {error ? (
        <Alert severity="error">Failed to load students</Alert>
      ) : (
        <Card>
          {isLoading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ height: 400 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Loading students...
              </Typography>
            </Stack>
          ) : (
            <DataGrid
              rows={filteredRows}
              columns={columns}
              loading={isLoading}
              pageSizeOptions={[5, 10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              getRowId={(row) => row._id}
              sx={{
                border: 0,
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-row': {
                  cursor: 'pointer',
                },
              }}
            />
          )}
        </Card>
      )}
    </Stack>
  );
}
