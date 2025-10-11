'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useOrganizationsControllerFindAll } from 'src/lib/orval/generated/organizations/organizations';
import { useProjectsControllerFindByOrganization } from 'src/lib/orval/generated/projects/projects';
import {
  useAccessControlControllerCreateAssignment,
  useAccessControlControllerListCategories,
  useAccessControlControllerListSubcategories,
} from 'src/lib/orval/generated/access-control/access-control';

import { assignmentSchema } from './assignment-schema';

import type { AssignmentSchemaType } from './assignment-schema';

// ----------------------------------------------------------------------

type AssignmentDialogFormProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: () => void;
};

export function AssignmentDialogForm({
  open,
  onClose,
  userId,
  onSuccess,
}: AssignmentDialogFormProps) {
  const queryClient = useQueryClient();

  const methods = useForm<AssignmentSchemaType>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      organization: '',
      project: '',
      category: '',
      subcategory: '',
    },
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const selectedOrganization = watch('organization');
  const selectedProject = watch('project');
  const selectedCategory = watch('category');

  // Load organizations
  const { data: organizationsData } = useOrganizationsControllerFindAll();
  const organizations = organizationsData?.data || [];

  // Load projects filtered by organization
  const { data: projectsData } = useProjectsControllerFindByOrganization(
    selectedOrganization,
    undefined,
    {
      query: {
        enabled: !!selectedOrganization,
      },
    }
  );
  const projects = projectsData?.data || [];

  // Load categories filtered by project
  const { data: categories } = useAccessControlControllerListCategories(
    selectedProject ? { projectId: selectedProject } : undefined,
    {
      query: {
        enabled: !!selectedProject,
      },
    }
  );

  // Load subcategories filtered by category
  const { data: subcategories } = useAccessControlControllerListSubcategories(
    selectedCategory ? { categoryId: selectedCategory } : undefined,
    {
      query: {
        enabled: !!selectedCategory,
      },
    }
  );

  // Reset downstream selections when parent changes
  useEffect(() => {
    if (selectedOrganization) {
      setValue('project', '');
      setValue('category', '');
      setValue('subcategory', '');
    }
  }, [selectedOrganization, setValue]);

  useEffect(() => {
    if (selectedProject) {
      setValue('category', '');
      setValue('subcategory', '');
    }
  }, [selectedProject, setValue]);

  useEffect(() => {
    if (selectedCategory) {
      setValue('subcategory', '');
    }
  }, [selectedCategory, setValue]);

  const { mutate: createAssignment, isPending } = useAccessControlControllerCreateAssignment({
    mutation: {
      onSuccess: () => {
        toast.success('Access assignment created successfully!');
        queryClient.invalidateQueries();
        reset();
        onClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to create assignment');
      },
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    createAssignment({
      data: {
        user: userId,
        organization: data.organization,
        project: data.project || undefined,
        category: data.category || undefined,
        subcategory: data.subcategory || undefined,
      },
    });
  });

  const handleClose = () => {
    if (!isPending && !isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Access Assignment</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <Field.Select
              name="organization"
              label="Organization"
              required
              options={organizations.map((org) => ({
                value: org._id,
                label: org.title,
              }))}
            />

            <Field.Select
              name="project"
              label="Project (Optional)"
              disabled={!selectedOrganization || projects.length === 0}
              options={[
                { value: '', label: 'None' },
                ...projects.map((project) => ({
                  value: project._id,
                  label: project.title,
                })),
              ]}
            />

            <Field.Select
              name="category"
              label="Category (Optional)"
              disabled={!selectedProject || !categories || categories.length === 0}
              options={[
                { value: '', label: 'None' },
                ...(categories?.map((category) => ({
                  value: category._id,
                  label: category.title,
                })) || []),
              ]}
            />

            <Field.Select
              name="subcategory"
              label="Subcategory (Optional)"
              disabled={!selectedCategory || !subcategories || subcategories.length === 0}
              options={[
                { value: '', label: 'None' },
                ...(subcategories?.map((subcategory) => ({
                  value: subcategory._id,
                  label: subcategory.title,
                })) || []),
              ]}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={isPending || isSubmitting}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isPending || isSubmitting}>
            Create Assignment
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
