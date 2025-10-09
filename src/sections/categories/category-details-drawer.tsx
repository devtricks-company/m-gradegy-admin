'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Drawer from '@mui/material/Drawer';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import {
  useCategoriesControllerFindOne,
  useCategoriesControllerUpdate,
  getCategoriesControllerFindByProjectQueryKey,
} from 'src/lib/orval/generated/categories/categories';
import {
  useSubcategoriesControllerCreate,
  useSubcategoriesControllerUpdate,
  useSubcategoriesControllerFindAllByCategory,
  getSubcategoriesControllerFindAllByCategoryQueryKey,
} from 'src/lib/orval/generated/subcategories/subcategories';

import type {
  UpdateCategoryDto,
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
  SubcategoriesControllerFindAllByCategory200,
  Subcategory,
} from 'src/lib/orval/generated/model';

// ----------------------------------------------------------------------

type CategoryDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
  categoryId: string | null;
  projectId: string;
};

export function CategoryDetailsDrawer({
  open,
  onClose,
  categoryId,
  projectId,
}: CategoryDetailsDrawerProps) {
  const queryClient = useQueryClient();
  const [isCreatingSubcategory, setIsCreatingSubcategory] = React.useState(false);
  const [newSubcategoryTitle, setNewSubcategoryTitle] = React.useState('');
  const [editingSubcategoryId, setEditingSubcategoryId] = React.useState<string | null>(null);
  const [editSubcategoryData, setEditSubcategoryData] = React.useState<UpdateSubcategoryDto>({});

  const {
    data: category,
    isLoading,
    error: fetchError,
    refetch,
  } = useCategoriesControllerFindOne(categoryId || '', {
    query: {
      enabled: !!categoryId,
      refetchOnMount: 'always',
      staleTime: 0,
    },
  });

  const {
    data: subcategories,
    isLoading: isLoadingSubcategories,
    refetch: refetchSubcategories,
  } = useSubcategoriesControllerFindAllByCategory(categoryId || '', undefined, {
    query: {
      enabled: !!categoryId,
      refetchOnMount: 'always',
      staleTime: 0,
    },
  });

  // Refetch data when drawer opens
  React.useEffect(() => {
    if (open && categoryId) {
      refetch();
      refetchSubcategories();
    }
  }, [open, categoryId, refetch, refetchSubcategories]);

  const {
    mutate: updateCategory,
    isPending: isUpdating,
    error: updateError,
  } = useCategoriesControllerUpdate();

  const {
    mutate: createSubcategory,
    isPending: isCreatingSubcategoryPending,
    error: createSubcategoryError,
  } = useSubcategoriesControllerCreate();

  const {
    mutate: updateSubcategory,
    isPending: isUpdatingSubcategory,
    error: updateSubcategoryError,
  } = useSubcategoriesControllerUpdate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateCategoryDto>({
    defaultValues: {
      title: '',
      school_level: '',
      localize_award: false,
      coins: false,
      store: false,
      display_project: false,
      is_active: true,
    },
  });

  // Update form when category data is loaded
  React.useEffect(() => {
    if (category) {
      const categoryData = (category as any)?.data || category;
      reset({
        title: categoryData.title || '',
        school_level: categoryData.school_level || '',
        localize_award: categoryData.localize_award || false,
        coins: categoryData.coins || false,
        store: categoryData.store || false,
        display_project: categoryData.display_project || false,
        is_active: categoryData.is_active ?? true,
      });
    }
  }, [category, reset]);

  const onSubmit = (data: UpdateCategoryDto) => {
    if (!categoryId) return;

    updateCategory(
      {
        id: categoryId,
        data,
      },
      {
        onSuccess: () => {
          // Invalidate categories list to refresh the chips
          queryClient.invalidateQueries({
            queryKey: getCategoriesControllerFindByProjectQueryKey(projectId),
          });
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    setIsCreatingSubcategory(false);
    setNewSubcategoryTitle('');
    setEditingSubcategoryId(null);
    setEditSubcategoryData({});
    onClose();
  };

  const handleCreateSubcategory = () => {
    if (!categoryId || !newSubcategoryTitle.trim()) return;

    const subcategoryData: CreateSubcategoryDto = {
      title: newSubcategoryTitle.trim(),
      category: categoryId,
      localize_reward: false,
      coins: false,
      store: false,
      is_active: true,
    };

    createSubcategory(
      { data: subcategoryData },
      {
        onSuccess: () => {
          // Invalidate subcategories list to refresh
          queryClient.invalidateQueries({
            queryKey: getSubcategoriesControllerFindAllByCategoryQueryKey(categoryId),
          });
          setNewSubcategoryTitle('');
          setIsCreatingSubcategory(false);
        },
      }
    );
  };

  const handleSubcategoryClick = (subcategory: any) => {
    console.log(subcategory._id);
    setEditingSubcategoryId(subcategory._id);
    setEditSubcategoryData({
      title: subcategory.title,
      category: subcategory.category?._id || subcategory.category,
      localize_reward: subcategory.localize_reward || false,
      coins: subcategory.coins || false,
      store: subcategory.store || false,
      is_active: subcategory.is_active ?? true,
    });
    setIsCreatingSubcategory(false);
  };

  const handleUpdateSubcategory = () => {
    if (!editingSubcategoryId || !categoryId) return;

    updateSubcategory(
      {
        id: editingSubcategoryId,
        data: editSubcategoryData,
      },
      {
        onSuccess: () => {
          // Invalidate subcategories list to refresh
          queryClient.invalidateQueries({
            queryKey: getSubcategoriesControllerFindAllByCategoryQueryKey(categoryId),
          });
          setEditingSubcategoryId(null);
          setEditSubcategoryData({});
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingSubcategoryId(null);
    setEditSubcategoryData({});
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box sx={{ width: { xs: '100vw', sm: 480 }, p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h6">Category Details</Typography>
          <IconButton onClick={handleClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {isLoading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
              Loading category details...
            </Typography>
          </Stack>
        ) : fetchError ? (
          <Alert severity="error">Failed to load category details</Alert>
        ) : category ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                {...register('title', { required: 'Title is required' })}
                label="Title"
                placeholder="Enter category title"
                error={!!errors.title}
                helperText={errors.title?.message}
                fullWidth
              />

              <Stack spacing={1.5}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('localize_award') || false}
                      onChange={(e) => {
                        setValue('localize_award', e.target.checked);
                      }}
                    />
                  }
                  label="Localize Award"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('coins') || false}
                      onChange={(e) => {
                        setValue('coins', e.target.checked);
                      }}
                    />
                  }
                  label="Coins"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('store') || false}
                      onChange={(e) => {
                        setValue('store', e.target.checked);
                      }}
                    />
                  }
                  label="Store"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('display_project') || false}
                      onChange={(e) => {
                        setValue('display_project', e.target.checked);
                      }}
                    />
                  }
                  label="Display Project"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('is_active') ?? true}
                      onChange={(e) => {
                        setValue('is_active', e.target.checked);
                      }}
                    />
                  }
                  label="Active"
                />
              </Stack>

              {updateError ? <Alert severity="error">{'Failed to update category'}</Alert> : null}

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <LoadingButton
                  variant="outlined"
                  onClick={handleClose}
                  disabled={isUpdating}
                  sx={{ minWidth: 100 }}
                >
                  Cancel
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isUpdating}
                  sx={{ minWidth: 100 }}
                >
                  Save
                </LoadingButton>
              </Stack>
            </Stack>
          </form>
        ) : null}

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Subcategories</Typography>
            <IconButton
              size="small"
              color="primary"
              onClick={() => setIsCreatingSubcategory(true)}
              disabled={!categoryId || isCreatingSubcategory}
            >
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          </Stack>

          {isCreatingSubcategory && (
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Enter subcategory title"
                value={newSubcategoryTitle}
                onChange={(e) => setNewSubcategoryTitle(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateSubcategory();
                  }
                }}
                fullWidth
                autoFocus
                error={!!createSubcategoryError}
              />
              <IconButton
                size="small"
                color="primary"
                onClick={handleCreateSubcategory}
                disabled={!newSubcategoryTitle.trim() || isCreatingSubcategoryPending}
              >
                <Iconify icon="mingcute:check-line" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setIsCreatingSubcategory(false);
                  setNewSubcategoryTitle('');
                }}
                disabled={isCreatingSubcategoryPending}
              >
                <Iconify icon="mingcute:close-line" />
              </IconButton>
            </Stack>
          )}

          {createSubcategoryError && <Alert severity="error">Failed to create subcategory</Alert>}

          {isLoadingSubcategories ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Loading subcategories...
              </Typography>
            </Stack>
          ) : subcategories && subcategories?.data?.length! > 0 ? (
            <Stack spacing={1}>
              {subcategories.data!.map((subcategory: any) => {
                return (
                  <Chip
                    key={subcategory.id || subcategory.title}
                    label={subcategory.title}
                    variant="outlined"
                    color={subcategory.is_active ? 'primary' : 'default'}
                    sx={{ justifyContent: 'flex-start', cursor: 'pointer' }}
                    onClick={() => handleSubcategoryClick(subcategory)}
                  />
                );
              })}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No subcategories found for this category.
            </Typography>
          )}

          {editingSubcategoryId && (
            <Box sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Edit Subcategory
              </Typography>

              <Stack spacing={2}>
                <TextField
                  size="small"
                  label="Title"
                  placeholder="Enter subcategory title"
                  value={editSubcategoryData.title || ''}
                  onChange={(e) =>
                    setEditSubcategoryData({ ...editSubcategoryData, title: e.target.value })
                  }
                  fullWidth
                />

                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editSubcategoryData.localize_reward || false}
                        onChange={(e) =>
                          setEditSubcategoryData({
                            ...editSubcategoryData,
                            localize_reward: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Localize Reward"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={editSubcategoryData.coins || false}
                        onChange={(e) =>
                          setEditSubcategoryData({
                            ...editSubcategoryData,
                            coins: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Coins"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={editSubcategoryData.store || false}
                        onChange={(e) =>
                          setEditSubcategoryData({
                            ...editSubcategoryData,
                            store: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Store"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={editSubcategoryData.is_active ?? true}
                        onChange={(e) =>
                          setEditSubcategoryData({
                            ...editSubcategoryData,
                            is_active: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Active"
                  />
                </Stack>

                {updateSubcategoryError ? (
                  <Alert severity="error">Failed to update subcategory</Alert>
                ) : null}

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <LoadingButton
                    variant="outlined"
                    onClick={handleCancelEdit}
                    disabled={isUpdatingSubcategory}
                    size="small"
                  >
                    Cancel
                  </LoadingButton>
                  <LoadingButton
                    variant="contained"
                    onClick={handleUpdateSubcategory}
                    loading={isUpdatingSubcategory}
                    size="small"
                  >
                    Update
                  </LoadingButton>
                </Stack>
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}
