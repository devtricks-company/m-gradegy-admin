'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import { useUsersControllerFindOne } from 'src/lib/orval/generated/users/users';
import { useAccessControlControllerListAssignments } from 'src/lib/orval/generated/access-control/access-control';

import { AssignmentsTable } from '../assignments-table';
import { AssignmentDialogForm } from '../forms/assignment-dialog-form';

import type { User, UserAssignment } from 'src/lib/orval/generated/model';

// ----------------------------------------------------------------------

type AdminUser = User & {
  _id: string;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phone?: string;
  jobs?: string;
  createdAt?: string;
  updatedAt?: string;
};

type Props = {
  id: string;
};

export function AdministratorDetailsView({ id }: Props) {
  const router = useRouter();
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);

  const { data, isLoading, error } = useUsersControllerFindOne(id);
  const { data: assignments = [], isLoading: AssignmentLoading } =
    useAccessControlControllerListAssignments(id);

  const admin = data as AdminUser | undefined;

  const handleBack = () => {
    router.push(paths.dashboard.administrator);
  };

  const handleOpenAssignmentDialog = () => {
    setAssignmentDialogOpen(true);
  };

  const handleCloseAssignmentDialog = () => {
    setAssignmentDialogOpen(false);
  };

  const handleDeleteAssignment = (assignment: UserAssignment) => {
    // TODO: Implement delete assignment API call
    console.log('Delete assignment:', assignment);
  };

  const getRoleColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'ultra':
        return 'error';
      case 'super':
        return 'warning';
      case 'admin':
        return 'info';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 400 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading administrator details...
        </Typography>
      </Stack>
    );
  }

  if (error || !admin) {
    return (
      <Stack spacing={3}>
        <Button
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
          onClick={handleBack}
          sx={{ alignSelf: 'flex-start' }}
        >
          Back to Administrators
        </Button>
        <Alert severity="error">Failed to load administrator details</Alert>
      </Stack>
    );
  }

  const fullName = `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || 'N/A';

  return (
    <Stack spacing={3}>
      <Box>
        <Button
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back to Administrators
        </Button>
      </Box>

      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Header with Avatar and Name */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={admin.avatarUrl} sx={{ width: 80, height: 80 }}>
              {admin.firstName?.charAt(0) || admin.email?.charAt(0) || 'A'}
            </Avatar>
            <Stack spacing={0.5} flex={1}>
              <Typography variant="h4">{fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {admin.email || 'No email'}
              </Typography>
            </Stack>
            <IconButton>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>

          <Divider />

          {/* Details Section */}
          <Stack spacing={2}>
            <Typography variant="h6">Details</Typography>

            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                  Role:
                </Typography>
                <Chip
                  label={admin.role || 'N/A'}
                  color={getRoleColor(admin.role)}
                  size="small"
                  variant="soft"
                />
              </Stack>

              {admin.phone && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                    Phone:
                  </Typography>
                  <Typography variant="body2">{admin.phone}</Typography>
                </Stack>
              )}

              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                  Jobs:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  {admin.jobs}
                </Typography>
              </Stack>

              {admin.createdAt && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                    Created:
                  </Typography>
                  <Typography variant="body2">
                    {new Date(admin.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Stack>
              )}

              {admin.updatedAt && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                    Last Updated:
                  </Typography>
                  <Typography variant="body2">
                    {new Date(admin.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Card>

      {/* Access Control Assignments Section */}
      <AssignmentsTable
        assignments={assignments}
        onAdd={handleOpenAssignmentDialog}
        onDelete={handleDeleteAssignment}
        isLoading={AssignmentLoading}
      />

      {/* Assignment Dialog */}
      <AssignmentDialogForm
        open={assignmentDialogOpen}
        onClose={handleCloseAssignmentDialog}
        userId={id}
        onSuccess={handleCloseAssignmentDialog}
      />
    </Stack>
  );
}
