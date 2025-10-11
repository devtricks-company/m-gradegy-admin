'use client';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

export function ExperienceCreateView() {
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Add Experience"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Experience', href: paths.dashboard.experience },
          { name: 'Add Experience' },
        ]}
        sx={{ mb: 3 }}
      />

      {/* Add experience form will be added here */}
    </DashboardContent>
  );
}
