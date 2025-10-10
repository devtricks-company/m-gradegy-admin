'use client';

import type { RegisterStudentWithAccessDto } from 'src/lib/orval/generated/model';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useAccessControlControllerRegisterStudentWithAccess } from 'src/lib/orval/generated/access-control/access-control';
import { useAccessControlControllerListOrganizations } from 'src/lib/orval/generated/access-control/access-control';
import { useAccessControlControllerListProjects } from 'src/lib/orval/generated/access-control/access-control';

// ----------------------------------------------------------------------

export type NewStudentDialogProps = {
  open: boolean;
  onClose: () => void;
};

// Zod schema for student registration
export const NewStudentSchema = zod.object({
  // Student profile fields
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().min(1, { message: 'Last name is required' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Email must be a valid email address' }),
  password: zod.string().min(8, { message: 'Password must be at least 8 characters' }),
  phone: zod.string().optional(),
  avatarUrl: zod.string().url().optional().or(zod.literal('')),
  isActive: zod.boolean().default(true),
  // Assignment fields
  organization: zod.string().min(1, { message: 'Organization is required' }),
  project: zod.string().optional(),
  category: zod.string().optional(),
  subcategory: zod.string().optional(),
});

export type NewStudentSchemaType = zod.infer<typeof NewStudentSchema>;

// ----------------------------------------------------------------------

export function NewStudentDialog({ open, onClose }: NewStudentDialogProps) {
  const methods = useForm<NewStudentSchemaType>({
    resolver: zodResolver(NewStudentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      avatarUrl: '',
      isActive: true,
      organization: '',
      project: '',
      category: '',
      subcategory: '',
    },
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  // Watch organization to conditionally fetch projects
  const selectedOrganization = watch('organization');

  // Fetch organizations
  const { data: organizations, isLoading: isLoadingOrgs } =
    useAccessControlControllerListOrganizations();

  // Fetch projects (only when organization is selected)
  const { data: projects, isLoading: isLoadingProjects } = useAccessControlControllerListProjects({
    query: {
      enabled: !!selectedOrganization,
    },
  });

  // Mutation hook for creating student
  const { mutateAsync: createStudent } = useAccessControlControllerRegisterStudentWithAccess();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload: RegisterStudentWithAccessDto = {
        student: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phone: data.phone || undefined,
          avatarUrl: data.avatarUrl || undefined,
          isActive: data.isActive,
        },
        assignments: [
          {
            organization: data.organization,
            project: data.project || undefined,
            category: data.category || undefined,
            subcategory: data.subcategory || undefined,
          },
        ],
      };

      await createStudent({ data: payload });

      toast.success('Student created successfully!');
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating student:', error);
      toast.error('Failed to create student');
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>New Student</DialogTitle>

      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3} sx={{ pt: 2 }}>
            {/* Student Profile Section */}
            <Box>
              <Field.Text name="firstName" label="First Name" />
            </Box>

            <Box>
              <Field.Text name="lastName" label="Last Name" />
            </Box>

            <Box>
              <Field.Text name="email" label="Email" type="email" />
            </Box>

            <Box>
              <Field.Text name="password" label="Password" type="password" />
            </Box>

            <Box>
              <Field.Text name="phone" label="Phone (optional)" />
            </Box>

            <Box>
              <Field.Upload name="avatarUrl" />
            </Box>

            {/* Access Control Section */}
            <Box>
              <Field.Select
                name="organization"
                label="Organization"
                options={
                  organizations?.map((org: any) => ({
                    label: org.title,
                    value: org._id,
                  })) || []
                }
                disabled={isLoadingOrgs}
              />
            </Box>

            <Box>
              <Field.Select
                name="project"
                label="Project (optional)"
                options={
                  projects?.map((proj: any) => ({
                    label: proj.title,
                    value: proj._id,
                  })) || []
                }
                disabled={!selectedOrganization || isLoadingProjects}
              />
            </Box>

            <Box>
              <Field.Text name="category" label="Category (optional)" />
            </Box>

            <Box>
              <Field.Text name="subcategory" label="Subcategory (optional)" />
            </Box>
          </Stack>
        </Form>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting} onClick={onSubmit}>
          Create Student
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
