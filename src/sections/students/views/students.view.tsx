'use client';

import { useState } from 'react';

import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DashboardContent } from 'src/layouts/dashboard';

import { StudentsTable } from '../students-table';
import { NewStudentDialog } from '../new-student-dialog';

export function StudentsView() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Students"
        links={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Students' }]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenDialog}
          >
            New Student
          </Button>
        }
        sx={{ mb: 3 }}
      />

      <StudentsTable />

      <NewStudentDialog open={openDialog} onClose={handleCloseDialog} />
    </DashboardContent>
  );
}
