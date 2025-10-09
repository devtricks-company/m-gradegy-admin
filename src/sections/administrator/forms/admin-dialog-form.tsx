'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { AdministrativeRole } from 'src/lib/orval/generated/model';
import { getUsersControllerFindAllAdministrativeQueryKey } from 'src/lib/orval/generated/users/users';
import { useAuthControllerRegisterAdmin } from 'src/lib/orval/generated/auth/auth';

import { adminSchema } from './admin-schema';

import type { AdminSchemaType } from './admin-schema';

// ----------------------------------------------------------------------

type AdminDialogFormProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function AdminDialogForm({ open, onClose, onSuccess }: AdminDialogFormProps) {
  const queryClient = useQueryClient();

  const methods = useForm<AdminSchemaType>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      avatarUrl: '',
      firstName: '',
      lastName: '',
      role: undefined,
      email: '',
      password: '',
      phone: '',
      jobs: '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate: createAdmin, isPending } = useAuthControllerRegisterAdmin({
    mutation: {
      onSuccess: () => {
        toast.success('Administrator created successfully!');
        queryClient.invalidateQueries({
          queryKey: getUsersControllerFindAllAdministrativeQueryKey(),
        });
        reset();
        onClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to create administrator');
      },
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    createAdmin({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone || undefined,
        jobs: data.jobs || undefined,
        avatarUrl: data.avatarUrl,
      },
    });
  });

  const handleClose = () => {
    if (!isPending && !isSubmitting) {
      reset();
      onClose();
    }
  };

  const roleOptions = [
    { value: AdministrativeRole.ultra, label: 'Ultra' },
    { value: AdministrativeRole.super, label: 'Super' },
    { value: AdministrativeRole.admin, label: 'Admin' },
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Administrator</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <Field.Upload name="avatarUrl" />

            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
              <Field.Text name="firstName" label="First Name" required />
              <Field.Text name="lastName" label="Last Name" required />
            </Box>

            <Field.Select name="role" label="Role" options={roleOptions} required />

            <Field.Text name="email" label="Email" type="email" required />

            <Field.Text name="password" label="Password" type="password" required />

            <Field.Text name="phone" label="Phone" placeholder="+1 (555) 123-4567" />

            <Field.Text name="jobs" label="Jobs" placeholder="e.g., Manager, Coordinator" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={isPending || isSubmitting}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isPending || isSubmitting}>
            Create Admin
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
