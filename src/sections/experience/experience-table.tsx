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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import type { GridColDef, GridSortModel, GridPaginationModel } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useDebounce } from 'src/hooks/use-debounce';

import { Iconify } from 'src/components/iconify';

import { useExperiencesControllerFindAll } from 'src/lib/orval/generated/experiences/experiences';

import type { Experience } from 'src/lib/orval/generated/model';

import type { ExperienceFilters } from './experience-filter-popover';

// ----------------------------------------------------------------------

type ExperienceRow = Experience & {
  _id: string;
  isChild?: boolean;
  parentId?: string;
};

type ExperienceTableProps = {
  filters?: ExperienceFilters;
};

export function ExperienceTable({ filters = {} }: ExperienceTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
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

  const handleAddChildExperience = useCallback(
    (parentId: string) => {
      router.push(`${paths.dashboard.experienceNew}?prerequisite=${parentId}`);
    },
    [router]
  );

  const handleToggleExpand = useCallback((rowId: string) => {
    console.log('rowID', rowId);
    setExpandedRows((prev) => {
      console.log('prev', prev);
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  }, []);

  // Get all experiences for checking children
  const allExperiences = useMemo(() => {
    if (!data?.data) return [];
    return data.data as ExperienceRow[];
  }, [data]);

  const columns: GridColDef<ExperienceRow>[] = useMemo(
    () => [
      {
        field: 'expand',
        headerName: 'Child',
        width: 60,
        sortable: false,
        renderCell: (params) => {
          // Only show expand icon for parent rows that have children
          const hasChildren = allExperiences.some((exp) => {
            return (exp.prerequisite as any)?._id === params.row._id;
          });

          const isExpanded = expandedRows.has(params.row._id);

          if (!hasChildren || params.row.isChild) return null;

          return (
            <Tooltip title={isExpanded ? 'Collapse' : 'Expand'}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleExpand(params.row._id);
                }}
                sx={{
                  transition: 'transform 0.2s',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              >
                <Iconify icon="eva:arrow-ios-forward-fill" width={20} />
              </IconButton>
            </Tooltip>
          );
        },
      },
      {
        field: 'actions',
        headerName: '',
        width: 60,
        sortable: false,
        renderCell: (params) => (
          <Tooltip title="Add child experience">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleAddChildExperience(params.row._id);
              }}
              sx={{
                '&:hover': {
                  bgcolor: 'primary.lighter',
                },
              }}
            >
              <Iconify icon="mingcute:add-circle-line" width={24} />
            </IconButton>
          </Tooltip>
        ),
      },
      {
        field: 'image',
        headerName: 'Image',
        width: 80,
        sortable: false,
        renderCell: (params) => (
          <Avatar
            src={params.row.image}
            alt={params.row.title}
            variant="rounded"
            sx={{ width: 48, height: 48 }}
          >
            <Iconify icon="eva:image-outline" width={24} />
          </Avatar>
        ),
      },
      {
        field: 'title',
        headerName: 'Title',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              pl: params.row.isChild ? 4 : 0,
            }}
          >
            {params.row.title || 'N/A'}
          </Box>
        ),
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
    [handleAddChildExperience, handleToggleExpand, expandedRows, allExperiences]
  );

  // Extract rows from API response and build hierarchical structure
  const rows = useMemo(() => {
    if (!allExperiences.length) return [];

    console.log('Building rows, allExperiences:', allExperiences);
    console.log('expandedRows:', Array.from(expandedRows));

    // Separate parents and children
    const parents: ExperienceRow[] = [];
    const childrenMap = new Map<string, ExperienceRow[]>();

    allExperiences.forEach((exp) => {
      // Handle prerequisite which might be an object with _id or a string
      const prerequisiteId =
        typeof exp.prerequisite === 'object' && exp.prerequisite !== null
          ? (exp.prerequisite as any)._id
          : exp.prerequisite;

      if (prerequisiteId) {
        // This is a child experience
        if (!childrenMap.has(prerequisiteId)) {
          childrenMap.set(prerequisiteId, []);
        }
        childrenMap.get(prerequisiteId)!.push({
          ...exp,
          isChild: true,
          parentId: prerequisiteId,
        });
      } else {
        // This is a parent experience
        parents.push(exp);
      }
    });

    console.log('Parents:', parents.length);
    console.log('Children map:', childrenMap);

    // Build flat list with expanded children
    const flatRows: ExperienceRow[] = [];
    parents.forEach((parent) => {
      flatRows.push(parent);

      // If this parent is expanded, add its children
      if (expandedRows.has(parent._id)) {
        const children = childrenMap.get(parent._id) || [];
        console.log(`Parent ${parent._id} is expanded, children:`, children);
        flatRows.push(...children);
      }
    });

    console.log('Final flatRows:', flatRows.length);
    return flatRows;
  }, [allExperiences, expandedRows]);

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
              getRowClassName={(params) => (params.row.isChild ? 'child-row' : 'parent-row')}
              sx={{
                border: 0,
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-row': {
                  cursor: 'pointer',
                },
                '& .child-row': {
                  bgcolor: 'action.hover',
                  '&:hover': {
                    bgcolor: 'action.selected',
                  },
                },
              }}
            />
          )}
        </Card>
      )}
    </Stack>
  );
}
