'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';

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
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type {
  GridColDef,
  GridSortModel,
  GridPaginationModel,
  GridRowProps,
} from '@mui/x-data-grid';
import { DataGrid, GridRow } from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useDebounce } from 'src/hooks/use-debounce';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import {
  useExperiencesControllerFindAll,
  useExperiencesControllerUpdate,
} from 'src/lib/orval/generated/experiences/experiences';

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

type SortableRowMeta = {
  isChild: boolean;
  parentId: string | null;
};

const SortableDataGridRow = (props: GridRowProps) => {
  const { rowId, row, style, className, ...other } = props;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: rowId,
    data: {
      isChild: Boolean((row as ExperienceRow).isChild),
      parentId: ((row as ExperienceRow).parentId as string | undefined) ?? null,
    } satisfies SortableRowMeta,
  });

  const transformStyle = transform
    ? CSS.Transform.toString({
        ...transform,
        scaleX: 1,
        scaleY: 1,
      })
    : '';

  const mergedTransform =
    style?.transform && transformStyle
      ? `${style.transform} ${transformStyle}`
      : style?.transform || transformStyle || undefined;

  const mergedTransition = transition ?? style?.transition;

  const { role: _role, ...restAttributes } = attributes;

  return (
    <GridRow
      ref={setNodeRef}
      rowId={rowId}
      row={row}
      style={{
        ...style,
        transform: mergedTransform,
        transition: mergedTransition,
        cursor: 'grab',
        opacity: isDragging ? 0.85 : style?.opacity,
        zIndex: isDragging ? 2 : style?.zIndex,
      }}
      className={`${className ?? ''}${isDragging ? ' MuiDataGrid-row--dragging' : ''}`}
      {...other}
      {...restAttributes}
      {...listeners}
      role="row"
    />
  );
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
  const queryClient = useQueryClient();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );
  const [parentOrder, setParentOrder] = useState<ExperienceRow[]>([]);
  const [childrenOrder, setChildrenOrder] = useState<Record<string, ExperienceRow[]>>({});
  const [displayRows, setDisplayRows] = useState<ExperienceRow[]>([]);
  const sortableRowIds = useMemo(
    () => displayRows.map((row) => row._id).filter(Boolean),
    [displayRows]
  );

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
  const experiencesQuery = useExperiencesControllerFindAll({
    page: paginationModel.page + 1, // API uses 1-based pagination
    limit: paginationModel.pageSize,
    sort: sortString,
    search: debouncedSearch || undefined,
    filters: apiFilters,
  });
  const { data, isLoading, error } = experiencesQuery;
  const updateExperienceMutation = useExperiencesControllerUpdate({
    mutation: {
      onError: () => {
        toast.error('Unable to update experience order');
      },
    },
  });
  const isSavingOrder = updateExperienceMutation.isPending;

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

  const handleEditExperience = useCallback(
    (experienceId: string) => {
      router.push(`${paths.dashboard.experienceNew}?edit=${experienceId}`);
    },
    [router]
  );

  const handleAddChildExperience = useCallback(
    (parentId: string) => {
      router.push(`${paths.dashboard.experienceNew}?prerequisite=${parentId}`);
    },
    [router]
  );

  const handleToggleExpand = useCallback((rowId: string) => {
    setExpandedRows((prev) => {
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
        headerName: 'Actions',
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit experience">
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditExperience(params.row._id);
                }}
                sx={{
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                  },
                }}
              >
                <Iconify icon="solar:pen-bold" width={20} />
              </IconButton>
            </Tooltip>
            {/* Only show add button for parent rows, not child rows */}
            {!params.row.isChild && (
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
            )}
          </Stack>
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
    [handleEditExperience, handleAddChildExperience, handleToggleExpand, expandedRows, allExperiences]
  );

  // Extract rows from API response and build hierarchical structure
  const { flatRows, parentList, childrenByParent } = useMemo(() => {
    if (!allExperiences.length) {
      return {
        flatRows: [] as ExperienceRow[],
        parentList: [] as ExperienceRow[],
        childrenByParent: new Map<string, ExperienceRow[]>(),
      };
    }

    const parents: ExperienceRow[] = [];
    const childrenMap = new Map<string, ExperienceRow[]>();

    allExperiences.forEach((exp) => {
      const prerequisiteId =
        typeof exp.prerequisite === 'object' && exp.prerequisite !== null
          ? (exp.prerequisite as { _id?: string })._id
          : exp.prerequisite;

      if (prerequisiteId) {
        if (!childrenMap.has(prerequisiteId)) {
          childrenMap.set(prerequisiteId, []);
        }
        childrenMap.get(prerequisiteId)!.push({
          ...exp,
          isChild: true,
          parentId: prerequisiteId,
        });
      } else {
        parents.push(exp);
      }
    });

    const sortedParents = [...parents].sort((a, b) => {
      const seqA = a.sequence ?? Number.MAX_SAFE_INTEGER;
      const seqB = b.sequence ?? Number.MAX_SAFE_INTEGER;
      return seqA - seqB;
    });

    const sortedChildrenMap = new Map<string, ExperienceRow[]>();
    childrenMap.forEach((children, parentId) => {
      const sortedChildren = [...children].sort((a, b) => {
        const seqA = a.sequence ?? Number.MAX_SAFE_INTEGER;
        const seqB = b.sequence ?? Number.MAX_SAFE_INTEGER;
        return seqA - seqB;
      });
      sortedChildrenMap.set(parentId, sortedChildren);
    });

    const flatRows: ExperienceRow[] = [];
    sortedParents.forEach((parent) => {
      flatRows.push(parent);

      if (expandedRows.has(parent._id)) {
        flatRows.push(...(sortedChildrenMap.get(parent._id) || []));
      }
    });

    return {
      flatRows,
      parentList: sortedParents,
      childrenByParent: sortedChildrenMap,
    };
  }, [allExperiences, expandedRows]);

  useEffect(() => {
    setParentOrder(parentList);
    const normalizedChildren: Record<string, ExperienceRow[]> = {};
    childrenByParent.forEach((value, key) => {
      normalizedChildren[key] = value;
    });
    setChildrenOrder(normalizedChildren);
  }, [parentList, childrenByParent]);

  useEffect(() => {
    const nextRows: ExperienceRow[] = [];
    parentOrder.forEach((parent) => {
      nextRows.push(parent);
      if (expandedRows.has(parent._id)) {
        nextRows.push(...(childrenOrder[parent._id] || []));
      }
    });
    setDisplayRows(nextRows);
  }, [parentOrder, childrenOrder, expandedRows]);

  const persistSequenceChanges = useCallback(
    async (updates: { id: string; sequence: number }[]) => {
      if (!updates.length) return;

      try {
        await updates.reduce<Promise<void>>(
          (chain, { id, sequence }) =>
            chain.then(() =>
              updateExperienceMutation.mutateAsync({ id, data: { sequence } }).then(() => undefined)
            ),
          Promise.resolve()
        );
        await queryClient.invalidateQueries({ queryKey: experiencesQuery.queryKey });
        toast.success('Experience order updated');
      } catch (error) {
        await experiencesQuery.refetch();
      }
    },
    [experiencesQuery, queryClient, updateExperienceMutation]
  );

  const handleDragEnd = useCallback(
    async ({ active, over }: DragEndEvent) => {
      if (isSavingOrder) {
        toast.info('Please wait for the current reorder to finish.');
        return;
      }

      if (!over || active.id === over.id) {
        return;
      }

      const activeRow = displayRows.find((row) => row._id === active.id);
      const overRow = displayRows.find((row) => row._id === over.id);

      if (!activeRow || !overRow) {
        return;
      }

      if (activeRow.isChild) {
        if (!overRow.isChild || activeRow.parentId !== overRow.parentId) {
          toast.warning('Child experiences can only reorder within the same parent.');
          return;
        }

        const parentId = activeRow.parentId!;
        const siblings = childrenOrder[parentId] ?? [];
        const sourceIndex = siblings.findIndex((row) => row._id === active.id);
        const targetIndex = siblings.findIndex((row) => row._id === over.id);

        if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
          return;
        }

        const reorderedSiblings = arrayMove(siblings, sourceIndex, targetIndex);
        const numericSequences = siblings
          .map((row) => row.sequence)
          .filter((value): value is number => typeof value === 'number')
          .sort((a, b) => a - b);
        const baseSequence = numericSequences.length ? numericSequences[0]! : 1;

        const updates: { id: string; sequence: number }[] = [];
        const updatedSiblings = reorderedSiblings.map((child, index) => {
          const sequence = baseSequence + index;
          if (child.sequence !== sequence) {
            updates.push({ id: child._id, sequence });
          }
          return { ...child, sequence };
        });

        setChildrenOrder((prev) => ({
          ...prev,
          [parentId]: updatedSiblings,
        }));

        await persistSequenceChanges(updates);
        return;
      }

      if (overRow.isChild) {
        toast.warning('Place parent experiences among other parents.');
        return;
      }

      const sourceIndex = parentOrder.findIndex((row) => row._id === active.id);
      const targetIndex = parentOrder.findIndex((row) => row._id === over.id);

      if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
        return;
      }

      const reorderedParents = arrayMove(parentOrder, sourceIndex, targetIndex);
      const flattenedOldOrder = parentOrder.flatMap((parent) => [
        parent,
        ...(childrenOrder[parent._id] || []),
      ]);

      const existingSequences = flattenedOldOrder
        .map((row) => row.sequence)
        .filter((seq): seq is number => typeof seq === 'number')
        .sort((a, b) => a - b);

      const baseSequence = existingSequences.length ? existingSequences[0]! : 1;

      const updates: { id: string; sequence: number }[] = [];
      let sequenceCounter = baseSequence;
      const nextChildrenOrder: Record<string, ExperienceRow[]> = {};
      const nextParents = reorderedParents.map((parent) => {
        const parentSequence = sequenceCounter;
        const updatedParent = { ...parent, sequence: parentSequence };
        if (parent.sequence !== parentSequence) {
          updates.push({ id: parent._id, sequence: parentSequence });
        }
        sequenceCounter += 1;

        const childList = childrenOrder[parent._id] || [];
        const updatedChildren = childList.map((child) => {
          const childSequence = sequenceCounter;
          const updatedChild = { ...child, sequence: childSequence };
          if (child.sequence !== childSequence) {
            updates.push({ id: child._id, sequence: childSequence });
          }
          sequenceCounter += 1;
          return updatedChild;
        });

        nextChildrenOrder[parent._id] = updatedChildren;

        return updatedParent;
      });

      setParentOrder(nextParents);
      setChildrenOrder(nextChildrenOrder);

      await persistSequenceChanges(updates);
    },
    [childrenOrder, displayRows, isSavingOrder, parentOrder, persistSequenceChanges]
  );

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
          {isLoading && displayRows.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ height: 400 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Loading experiences...
              </Typography>
            </Stack>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={sortableRowIds}>
                <DataGrid
                  rows={displayRows}
                  columns={columns}
                  loading={isLoading || isSavingOrder}
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
                  slots={{ row: SortableDataGridRow }}
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
              </SortableContext>
            </DndContext>
          )}
        </Card>
      )}
    </Stack>
  );
}
