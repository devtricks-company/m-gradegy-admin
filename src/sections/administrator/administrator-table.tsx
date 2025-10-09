'use client';

import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
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

import { useUsersControllerFindAllAdministrative } from 'src/lib/orval/generated/users/users';

import type { User } from 'src/lib/orval/generated/model';

// ----------------------------------------------------------------------

type AdminUser = User & {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
};

export function AdministratorTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading, error } = useUsersControllerFindAllAdministrative({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: debouncedSearch || undefined,
  });

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const getRoleColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'ultra':
        return 'error';
      case 'super':
        return 'warning';
      case 'admin':
        return 'info';
      default:
        return 'default';
    }
  };

  const columns: GridColDef<AdminUser>[] = useMemo(
    () => [
      {
        field: 'avatar',
        headerName: '',
        width: 60,
        sortable: false,
        renderCell: (params) => (
          <Avatar sx={{ width: 40, height: 40 }}>
            {params.row.firstName?.charAt(0) || params.row.email?.charAt(0) || 'A'}
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
        field: 'role',
        headerName: 'Role',
        width: 120,
        renderCell: (params) => (
          <Chip
            label={params.value || 'N/A'}
            color={getRoleColor(params.value)}
            size="small"
            variant="soft"
          />
        ),
      },
    ],
    []
  );

  const rows = (data?.data || []) as AdminUser[];
  const rowCount = data?.meta?.totalItems || 0;

  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search administrators by name or email..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {error ? (
        <Alert severity="error">Failed to load administrators</Alert>
      ) : (
        <Card>
          {isLoading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ height: 400 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Loading administrators...
              </Typography>
            </Stack>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              rowCount={rowCount}
              loading={isLoading}
              pageSizeOptions={[5, 10, 25, 50]}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
              getRowId={(row) => row._id}
              disableRowSelectionOnClick
              sx={{
                border: 0,
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          )}
        </Card>
      )}
    </Stack>
  );
}
