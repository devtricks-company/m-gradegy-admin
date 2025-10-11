'use client';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DashboardContent } from 'src/layouts/dashboard';

export function ExperienceView() {
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Experience"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Experience' }]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.experienceNew}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Experience
          </Button>
        }
        sx={{ mb: 3 }}
      />

      {/* Experience content will be added here */}
    </DashboardContent>
  );
}
