'use client';

import type { RegisterStudentWithAccessDto } from 'src/lib/orval/generated/model';

import { z as zod } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Iconify } from 'src/components/iconify';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useAccessControlControllerRegisterStudentWithAccess } from 'src/lib/orval/generated/access-control/access-control';
import { useAccessControlControllerListOrganizations } from 'src/lib/orval/generated/access-control/access-control';
import { useProjectsControllerFindByOrganization } from 'src/lib/orval/generated/projects/projects';

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
  // Assignment fields (array of assignments)
  assignments: zod.array(
    zod.object({
      organization: zod.string().min(1, { message: 'Organization is required' }),
      project: zod.string().optional(),
      category: zod.string().optional(),
      subcategory: zod.string().optional(),
    })
  ).min(1, { message: 'At least one assignment is required' }),
});

export type NewStudentSchemaType = zod.infer<typeof NewStudentSchema>;

// ----------------------------------------------------------------------

type AssignmentFieldsProps = {
  index: number;
  organizationId: string;
  organizations: any[];
  isLoadingOrgs: boolean;
};

function AssignmentFields({
  index,
  organizationId,
  organizations,
  isLoadingOrgs,
}: AssignmentFieldsProps) {
  // Fetch projects for the selected organization
  const { data: projectsData, isLoading: isLoadingProjects } =
    useProjectsControllerFindByOrganization(organizationId || '', undefined, {
      query: {
        enabled: !!organizationId, // Only fetch when organization is selected
      },
    });

  const projects = projectsData?.data || [];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Field.Select
          name={`assignments.${index}.organization`}
          label="Organization"
          options={
            organizations?.map((org: any) => ({
              label: org.title,
              value: org._id,
            })) || []
          }
          disabled={isLoadingOrgs}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Field.Select
          name={`assignments.${index}.project`}
          label="Project (optional)"
          options={
            projects?.map((proj: any) => ({
              label: proj.title,
              value: proj._id,
            })) || []
          }
          disabled={isLoadingProjects || !organizationId}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Field.Text name={`assignments.${index}.category`} label="Category (optional)" />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Field.Text name={`assignments.${index}.subcategory`} label="Subcategory (optional)" />
      </Grid>
    </Grid>
  );
}

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
      assignments: [
        {
          organization: '',
          project: '',
          category: '',
          subcategory: '',
        },
      ],
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  // useFieldArray for dynamic assignment rows
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assignments',
  });

  // Watch all assignment organization values
  const assignments = watch('assignments');

  // Fetch organizations
  const { data: organizations, isLoading: isLoadingOrgs } =
    useAccessControlControllerListOrganizations();

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
        assignments: data.assignments.map((assignment) => ({
          organization: assignment.organization,
          project: assignment.project || undefined,
          category: assignment.category || undefined,
          subcategory: assignment.subcategory || undefined,
        })),
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
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* Left Side - File Upload */}
              <Grid item xs={12} md={3}>
                <Field.Upload name="avatarUrl" />
              </Grid>

              {/* Right Side - Form Fields in 2 Columns */}
              <Grid item xs={12} md={9}>
                <Grid container spacing={3}>
                  {/* Student Profile Section */}
                  <Grid item xs={12} sm={6}>
                    <Field.Text name="firstName" label="First Name" />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field.Text name="lastName" label="Last Name" />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field.Text name="email" label="Email" type="email" />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field.Text name="password" label="Password" type="password" />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field.Text name="phone" label="Phone (optional)" />
                  </Grid>

                  {/* Access Control Section - Dynamic Assignments */}
                  <Grid item xs={12}>
                    <Stack spacing={2}>
                      {fields.map((field, index) => (
                        <Box key={field.id}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">
                              Assignment {index + 1}
                            </Typography>
                            {fields.length > 1 && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => remove(index)}
                              >
                                <Iconify icon="mingcute:delete-2-line" />
                              </IconButton>
                            )}
                          </Stack>

                          <AssignmentFields
                            index={index}
                            organizationId={assignments[index]?.organization}
                            organizations={organizations || []}
                            isLoadingOrgs={isLoadingOrgs}
                          />
                        </Box>
                      ))}

                      <Box>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Iconify icon="mingcute:add-line" />}
                          onClick={() =>
                            append({
                              organization: '',
                              project: '',
                              category: '',
                              subcategory: '',
                            })
                          }
                        >
                          Add Assignment
                        </Button>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
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
