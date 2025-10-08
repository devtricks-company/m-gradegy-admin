'use client';

import { useEffect } from 'react';
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
  useOrganizationsControllerUpdate,
  getOrganizationsControllerFindAllQueryKey,
  getOrganizationsControllerFindOneQueryKey,
} from 'src/lib/orval/generated/organizations/organizations';

import type {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationsControllerFindOne200,
} from 'src/lib/orval/generated/model';

import {
  CreateOrganizationWithRefinements,
  type CreateOrganizationWithRefinementsInput,
} from './organization.schema';

// ----------------------------------------------------------------------

type OrganizationFormProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentOrganization?: OrganizationsControllerFindOne200;
};

export function OrganizationForm({
  open,
  onClose,
  onSuccess,
  currentOrganization,
}: OrganizationFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!currentOrganization;

  const {
    mutate: createOrganization,
    isPending: isCreating,
    error: createError,
  } = useOrganizationsControllerCreate();
  const {
    mutate: updateOrganization,
    isPending: isUpdating,
    error: updateError,
  } = useOrganizationsControllerUpdate();

  const isPending = isCreating || isUpdating;
  const error = createError || updateError;

  const methods = useForm<CreateOrganizationWithRefinementsInput>({
    resolver: zodResolver(CreateOrganizationWithRefinements),
    defaultValues: currentOrganization
      ? {
          title: currentOrganization.title || '',
          short_title: currentOrganization.short_title || '',
          organization_type: currentOrganization.organization_type || 'secondary',
          image: currentOrganization.image || '',
          ufcs_member: currentOrganization.ufcs_member || false,
          lead_contact: currentOrganization.lead_contact,
          paid: currentOrganization.paid || false,
          reward_system: currentOrganization.reward_system || false,
          survey_system: currentOrganization.survey_system || false,
          school_district: currentOrganization.school_district || undefined,
          university: currentOrganization.university || undefined,
          is_active: currentOrganization.is_active ?? true,
        }
      : {
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

  const { watch, setValue, reset } = methods;
  const organizationType = watch('organization_type');

  // Reset form when dialog opens
  useEffect(() => {
    if (open && currentOrganization) {
      // Edit mode - populate with organization data
      reset({
        title: currentOrganization.title || '',
        short_title: currentOrganization.short_title || '',
        organization_type: currentOrganization.organization_type || 'secondary',
        image: currentOrganization.image || '',
        ufcs_member: currentOrganization.ufcs_member || false,
        lead_contact: currentOrganization.lead_contact,
        paid: currentOrganization.paid || false,
        reward_system: currentOrganization.reward_system || false,
        survey_system: currentOrganization.survey_system || false,
        school_district: currentOrganization.school_district || undefined,
        university: currentOrganization.university || undefined,
        is_active: currentOrganization.is_active ?? true,
      } as any);
    } else if (open && !currentOrganization) {
      // Create mode - reset to defaults
      reset({
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
      });
    }
  }, [open, currentOrganization, reset]);

  const onSubmit = methods.handleSubmit(async (data) => {
    // Transform the data to match DTO
    const payload = {
      title: data.title,
      short_title: data.short_title || undefined,
      organization_type: data.organization_type,
      image: data.image && data.image.trim() !== '' ? data.image : undefined,
      ufcs_member: data.ufcs_member,
      lead_contact:
        typeof data.lead_contact === 'object' ? data.lead_contact._id : data.lead_contact,
      paid: data.paid,
      reward_system: data.reward_system,
      survey_system: data.survey_system,
      school_district:
        data.school_district &&
        (typeof data.school_district === 'object'
          ? data.school_district._id
          : data.school_district),
      university:
        data.university &&
        (typeof data.university === 'object' ? data.university._id : data.university),
      is_active: data.is_active,
    };

    if (isEditMode && currentOrganization) {
      // Update existing organization
      updateOrganization(
        { id: currentOrganization._id, data: payload as UpdateOrganizationDto },
        {
          onSuccess: () => {
            // Invalidate both list and detail queries
            queryClient.invalidateQueries({
              queryKey: getOrganizationsControllerFindAllQueryKey(),
            });
            queryClient.invalidateQueries({
              queryKey: getOrganizationsControllerFindOneQueryKey(currentOrganization._id),
            });
            methods.reset();
            onSuccess?.();
            onClose();
          },
        }
      );
    } else {
      // Create new organization
      createOrganization(
        { data: payload as CreateOrganizationDto },
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
    }
  });

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit Organization' : 'Create New Organization'}</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            {!!error && (
              <Alert severity="error">
                Failed to {isEditMode ? 'update' : 'create'} organization. Please check your input
                and try again.
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
            {isEditMode ? 'Update Organization' : 'Create Organization'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
