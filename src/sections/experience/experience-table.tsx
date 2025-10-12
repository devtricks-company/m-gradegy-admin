'use client';

import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import type { GridColDef, GridSortModel, GridPaginationModel } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';

import { useDebounce } from 'src/hooks/use-debounce';

import { Iconify } from 'src/components/iconify';

import { useExperiencesControllerFindAll } from 'src/lib/orval/generated/experiences/experiences';

import type { Experience } from 'src/lib/orval/generated/model';

import type { ExperienceFilters } from './experience-filter-popover';

// ----------------------------------------------------------------------

type ExperienceRow = Experience & { _id: string };

type ExperienceTableProps = {
  filters?: ExperienceFilters;
};

export function ExperienceTable({ filters = {} }: ExperienceTableProps) {
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

  // Build filters object
  const apiFilters = useMemo(() => {
    const filterObj: { [key: string]: unknown } = {};

    if (filters.organizationId) {
      filterObj.organization = filters.organizationId;
    }
    if (filters.projectId) {
      filterObj.project = filters.projectId;
    }
    if (filters.categoryId) {
      filterObj.category = filters.categoryId;
    }
    if (filters.subcategoryId) {
      filterObj.subcategory = filters.subcategoryId;
    }

    return Object.keys(filterObj).length > 0 ? filterObj : undefined;
  }, [filters]);

  // Fetch experiences with server-side pagination, sorting, search, and filters
  const { data, isLoading, error } = useExperiencesControllerFindAll({
    page: paginationModel.page + 1, // API uses 1-based pagination
    limit: paginationModel.pageSize,
    sort: sortString,
    search: debouncedSearch || undefined,
    filters: apiFilters,
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

  const columns: GridColDef<ExperienceRow>[] = useMemo(
    () => [
      {
        field: 'title',
        headerName: 'Title',
        flex: 1,
        minWidth: 200,
        valueGetter: (_value, row) => row.title || 'N/A',
      },
      {
        field: 'subtitle',
        headerName: 'Subtitle',
        flex: 1,
        minWidth: 150,
        valueGetter: (_value, row) => row.subtitle || 'N/A',
      },
      {
        field: 'timing_type',
        headerName: 'Timing Type',
        width: 150,
        sortable: false,
        valueGetter: (_value, row) => row.timing_type || 'N/A',
      },
      {
        field: 'completion_type',
        headerName: 'Completion Type',
        width: 150,
        sortable: false,
        valueGetter: (_value, row) => row.completion_type || 'N/A',
      },
      {
        field: 'xp_completion',
        headerName: 'XP',
        width: 100,
        valueGetter: (_value, row) => row.xp_completion || 0,
      },
      {
        field: 'gems',
        headerName: 'Gems',
        width: 100,
        valueGetter: (_value, row) => row.gems || 0,
      },
      {
        field: 'expPublish',
        headerName: 'Status',
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <Chip
            label={params.row.expPublish ? 'Published' : 'Draft'}
            color={params.row.expPublish ? 'success' : 'default'}
            size="small"
          />
        ),
      },
    ],
    []
  );

  // Extract rows from API response
  const rows = useMemo(() => {
    if (!data?.data) return [];
    return data.data as ExperienceRow[];
  }, [data]);

  // Extract pagination metadata
  const rowCount = data?.meta?.totalItems || 0;

  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search experiences by title, subtitle, or description..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {error ? (
        <Alert severity="error">Failed to load experiences</Alert>
      ) : (
        <Card>
          {isLoading && rows.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ height: 400 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Loading experiences...
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
