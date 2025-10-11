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
import type { GridColDef, GridSortModel, GridPaginationModel } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';

import { useDebounce } from 'src/hooks/use-debounce';

import { Iconify } from 'src/components/iconify';

import { useAccessControlControllerListStudents } from 'src/lib/orval/generated/access-control/access-control';

import type { AccessControlControllerListStudents200DataItemUser } from 'src/lib/orval/generated/model';

import type { StudentsFilters } from './students-filter-popover';

// ----------------------------------------------------------------------

type StudentRow = AccessControlControllerListStudents200DataItemUser;

type StudentsTableProps = {
  filters?: StudentsFilters;
};

export function StudentsTable({ filters = {} }: StudentsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Build sort string from sortModel
  const sortString = useMemo(() => {
    if (!sortModel.length) return undefined;
    return sortModel
      .map((sort) => (sort.sort === 'desc' ? `-${sort.field}` : sort.field))
      .join(',');
  }, [sortModel]);

  // Fetch students with server-side pagination, sorting, search, and filters
  const { data, isLoading, error } = useAccessControlControllerListStudents({
    page: paginationModel.page + 1, // API uses 1-based pagination
    limit: paginationModel.pageSize,
    sort: sortString,
    search: debouncedSearch || undefined,
    organizationId: filters.organizationId,
    projectId: filters.projectId,
    categoryId: filters.categoryId,
    subcategoryId: filters.subcategoryId,
  });

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 })); // Reset to first page on search
  }, []);

  const handlePaginationModelChange = useCallback((newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
  }, []);

  const handleSortModelChange = useCallback((newModel: GridSortModel) => {
    setSortModel(newModel);
  }, []);

  const columns: GridColDef<StudentRow>[] = useMemo(
    () => [
      {
        field: 'avatar',
        headerName: '',
        width: 60,
        sortable: false,
        renderCell: (params) => (
          <Avatar src={params.row.avatarUrl || undefined} sx={{ width: 40, height: 40 }}>
            {params.row.firstName?.charAt(0) || params.row.email?.charAt(0) || 'S'}
          </Avatar>
        ),
      },
      {
        field: 'firstName',
        headerName: 'First Name',
        flex: 1,
        minWidth: 150,
        valueGetter: (_value, row) => row.firstName || 'N/A',
      },
      {
        field: 'lastName',
        headerName: 'Last Name',
        flex: 1,
        minWidth: 150,
        valueGetter: (_value, row) => row.lastName || 'N/A',
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 200,
        valueGetter: (_value, row) => row.email || 'N/A',
      },
      {
        field: 'phone',
        headerName: 'Phone Number',
        flex: 1,
        minWidth: 150,
        valueGetter: (_value, row) => row.phone || 'N/A',
      },
      {
        field: 'isActive',
        headerName: 'Status',
        width: 100,
        valueGetter: (_value, row) => (row.isActive ? 'Active' : 'Inactive'),
      },
    ],
    []
  );

  // Extract rows from API response
  const rows = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => item.user).filter((user): user is StudentRow => !!user);
  }, [data]);

  // Extract pagination metadata
  const rowCount = data?.meta?.totalItems || 0;

  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search students by name, email, or phone..."
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
          {isLoading && rows.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ height: 400 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Loading students...
              </Typography>
            </Stack>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              loading={isLoading}
              rowCount={rowCount}
              paginationMode="server"
              sortingMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              getRowId={(row) => row._id || ''}
              disableRowSelectionOnClick
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
