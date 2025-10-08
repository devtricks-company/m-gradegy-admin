'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { Iconify } from 'src/components/iconify';
import {
  useCategoriesControllerCreate,
  getCategoriesControllerFindByProjectQueryKey,
} from 'src/lib/orval/generated/categories/categories';

import type { CreateCategoryDto } from 'src/lib/orval/generated/model';

// ----------------------------------------------------------------------

type CategoryFormProps = {
  projectId: string;
};

export function CategoryForm({ projectId }: CategoryFormProps) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const {
    mutate: createCategory,
    isPending,
    error,
    reset: resetMutation,
  } = useCategoriesControllerCreate();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<{ title: string }>({
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = (data: { title: string }) => {
    const categoryData: CreateCategoryDto = {
      title: data.title,
      project: projectId,
      is_active: true,
    };

    createCategory(
      { data: categoryData },
      {
        onSuccess: () => {
          // Invalidate and refetch categories
          queryClient.invalidateQueries({
            queryKey: getCategoriesControllerFindByProjectQueryKey(projectId),
          });
          resetForm();
          setShowForm(false);
          resetMutation();
        },
      }
    );
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
    resetMutation();
  };

  if (!showForm) {
    return (
      <IconButton
        color="primary"
        onClick={() => setShowForm(true)}
        sx={{ alignSelf: 'flex-start' }}
      >
        <Iconify icon="mingcute:add-line" />
      </IconButton>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TextField
              {...register('title', { required: 'Title is required' })}
              label="Category Title"
              placeholder="Enter category title"
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
              size="small"
              autoFocus
            />
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isPending}
              sx={{ minWidth: 80 }}
            >
              Add
            </LoadingButton>
            <IconButton onClick={handleCancel} disabled={isPending}>
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          </Stack>
          {error && (
            <Alert severity="error">
              {error instanceof Error ? error.message : 'Failed to create category'}
            </Alert>
          )}
        </Stack>
      </form>
    </Box>
  );
}
