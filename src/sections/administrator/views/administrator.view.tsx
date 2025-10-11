'use client';

import { useState } from 'react';

import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DashboardContent } from 'src/layouts/dashboard';

import { AdministratorTable } from '../administrator-table';
import { AdminDialogForm } from '../forms/admin-dialog-form';

export function AdministratorView() {
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
        heading="Administrator"
        links={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Administrator' }]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenDialog}
          >
            New Admin
          </Button>
        }
        sx={{ mb: 3 }}
      />

      <AdministratorTable />

      <AdminDialogForm open={openDialog} onClose={handleCloseDialog} />
    </DashboardContent>
  );
}
