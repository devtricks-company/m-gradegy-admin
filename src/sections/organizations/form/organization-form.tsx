'use client';

import { z as zod } from 'zod';
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
  useOrganizationsControllerCreate,
  getOrganizationsControllerFindAllQueryKey,
} from 'src/lib/orval/generated/organizations/organizations';

import type { CreateOrganizationDto } from 'src/lib/orval/generated/model';

import {
  CreateOrganizationWithRefinements,
  type CreateOrganizationWithRefinementsInput,
} from './organization.schema';

// ----------------------------------------------------------------------

type OrganizationFormProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function OrganizationForm({ open, onClose, onSuccess }: OrganizationFormProps) {
  const queryClient = useQueryClient();
  const { mutate: createOrganization, isPending, error } = useOrganizationsControllerCreate();

  const methods = useForm<CreateOrganizationWithRefinementsInput>({
    resolver: zodResolver(CreateOrganizationWithRefinements),
    defaultValues: {
      title: '',
      short_title: '',
      organization_type: 'secondary',
      image: '',
      ufcs_member: false,
      lead_contact: '',
      paid: false,
      reward_system: false,
      survey_system: false,
      school_district: undefined,
      university: undefined,
      is_active: true,
    },
  });

  const { watch, setValue } = methods;
  const organizationType = watch('organization_type');

  const onSubmit = methods.handleSubmit(async (data) => {
    // Transform the data to match CreateOrganizationDto
    const payload: CreateOrganizationDto = {
      title: data.title,
      short_title: data.short_title || undefined,
      organization_type: data.organization_type,
      image: data.image || undefined,
      ufcs_member: data.ufcs_member,
      lead_contact: data.lead_contact._id,
      paid: data.paid,
      reward_system: data.reward_system,
      survey_system: data.survey_system,
      school_district: data.school_district && data.school_district._id,
      university: data.university && data.university._id,
      is_active: data.is_active,
    };

    console.log(payload);
    createOrganization(
      { data: payload },
      {
        onSuccess: () => {
          // Invalidate organizations query to refetch the list
          queryClient.invalidateQueries({
            queryKey: getOrganizationsControllerFindAllQueryKey(),
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
      <DialogTitle>Create New Organization</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            {!!error && (
              <Alert severity="error">
                Failed to create organization. Please check your input and try again.
              </Alert>
            )}

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Organization Logo
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
              label="Organization Title"
              placeholder="Enter full organization title"
              required
            />

            <Field.Text
              name="short_title"
              label="Short Title"
              placeholder="Enter abbreviated title (optional)"
            />

            {/* Organization Type */}
            <Field.Select
              name="organization_type"
              label="Organization Type"
              required
              options={[
                { label: 'Secondary (High School)', value: 'secondary' },
                { label: 'Post-Secondary (University)', value: 'post_secondary' },
                { label: 'Community-Based Organization', value: 'cbo' },
                { label: 'Other', value: 'other' },
              ]}
            />

            {/* Conditional Fields Based on Organization Type */}
            {organizationType === 'secondary' && (
              <Field.AutocompleteSchoolDistrict
                name="school_district"
                label="School District"
                placeholder="Search school districts..."
                required
              />
            )}

            {organizationType === 'post_secondary' && (
              <Field.AutocompleteUniversity
                name="university"
                label="University"
                placeholder="Search universities..."
                required
              />
            )}

            {/* Lead Contact */}
            <Field.AutocompleteLeadContact
              name="lead_contact"
              label="Lead Contact"
              placeholder="Search for lead contact..."
              required
            />

            {/* Boolean Toggles */}
            <Box sx={{ pt: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Organization Settings
              </Typography>

              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('ufcs_member')}
                      onChange={(e) => setValue('ufcs_member', e.target.checked)}
                    />
                  }
                  label="UFCS Member"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('paid')}
                      onChange={(e) => setValue('paid', e.target.checked)}
                    />
                  }
                  label="Paid Subscription"
                />

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
            Create Organization
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
