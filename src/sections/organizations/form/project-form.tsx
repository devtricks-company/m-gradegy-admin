'use client';

import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { Field, Form } from 'src/components/hook-form';
import {
  useProjectsControllerCreate,
  getProjectsControllerFindByOrganizationQueryKey,
} from 'src/lib/orval/generated/projects/projects';

import type { CreateProjectDto } from 'src/lib/orval/generated/model';

import { CreateProjectSchema, type CreateProject } from './project.schema';

// ----------------------------------------------------------------------

type ProjectFormProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  organizationId: string;
};

export function ProjectForm({ open, onClose, onSuccess, organizationId }: ProjectFormProps) {
  const queryClient = useQueryClient();

  const { mutate: createProject, isPending, error } = useProjectsControllerCreate();

  const methods = useForm<CreateProject>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      title: '',
      image: '',
      project_type: undefined,
      condition: undefined,
      status: undefined,
      reward_system: false,
      survey_system: false,
      organizations: [organizationId],
      is_active: true,
      school_district: undefined,
      university: undefined,
    },
  });

  const { watch, setValue } = methods;
  const projectType = watch('project_type');

  const onSubmit = methods.handleSubmit(async (data) => {
    // Transform the data to match DTO
    const payload: CreateProjectDto = {
      title: data.title,
      image: data.image || undefined,
      project_type: data.project_type,
      condition: data.condition,
      status: data.status,
      reward_system: data.reward_system,
      survey_system: data.survey_system,
      organizations: data.organizations,
      is_active: data.is_active,
      school_district: data.school_district,
      university: data.university,
    };

    createProject(
      { data: payload },
      {
        onSuccess: () => {
          // Invalidate projects query to refetch the list
          queryClient.invalidateQueries({
            queryKey: getProjectsControllerFindByOrganizationQueryKey(organizationId),
          });
          methods.reset();
          onSuccess?.();
          onClose();
        },
      }
    );
  });

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Project</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            {!!error && (
              <Alert severity="error">
                Failed to create project. Please check your input and try again.
              </Alert>
            )}

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Project Image
              </Typography>
              <Field.Upload
                name="image"
                onSuccess={(result) => setValue('image', result.url)}
                defaultFile={watch('image')}
              />
            </Box>

            {/* Basic Information */}
            <Field.Text
              name="title"
              label="Project Title"
              placeholder="Enter project title"
              required
            />

            {/* Project Type */}
            <Field.Select
              name="project_type"
              label="Project Type"
              options={[
                { label: 'School District', value: 'school_district' },
                { label: 'University', value: 'university' },
                { label: 'Special Project', value: 'special_project' },
                { label: 'Other Secondary', value: 'other-secondary' },
                { label: 'Other Post-Secondary', value: 'other-post_secondary' },
              ]}
            />

            {/* Conditional Fields Based on Project Type */}
            {(projectType === 'school_district' || projectType === 'other-secondary') && (
              <Field.AutocompleteSchoolDistrict
                name="school_district"
                label="School District"
                placeholder="Search school districts..."
                required
              />
            )}

            {(projectType === 'university' || projectType === 'other-post_secondary') && (
              <Field.AutocompleteUniversity
                name="university"
                label="University"
                placeholder="Search universities..."
                required
              />
            )}

            {/* Condition */}
            <Field.Select
              name="condition"
              label="Condition"
              options={[
                { label: 'Editable', value: 'editable' },
                { label: 'Locked', value: 'locked' },
              ]}
            />

            {/* Status */}
            <Field.Select
              name="status"
              label="Status"
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Stasis', value: 'stasis' },
                { label: 'Completed', value: 'completed' },
              ]}
            />

            {/* Boolean Toggles */}
            <Box sx={{ pt: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Project Settings
              </Typography>

              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('reward_system')}
                      onChange={(e) => setValue('reward_system', e.target.checked)}
                    />
                  }
                  label="Enable Reward System"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('survey_system')}
                      onChange={(e) => setValue('survey_system', e.target.checked)}
                    />
                  }
                  label="Enable Survey System"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('is_active')}
                      onChange={(e) => setValue('is_active', e.target.checked)}
                    />
                  }
                  label="Active Status"
                />
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isPending}>
            Create Project
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
