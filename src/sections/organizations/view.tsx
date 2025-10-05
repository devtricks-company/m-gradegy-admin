'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------
// TODO: Import CustomBreadcrumbs from the full Minimal UI template
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function OrganizationsView() {
  return (
    <DashboardContent maxWidth="xl">
   
      <CustomBreadcrumbs
        heading="Organizations"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Organizations' },
        ]}
        sx={{ mb: 3 }}
      />
     

     
      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      />
    </DashboardContent>
  );
}
