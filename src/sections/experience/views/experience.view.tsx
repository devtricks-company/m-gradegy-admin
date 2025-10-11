'use client';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DashboardContent } from 'src/layouts/dashboard';

export function ExperienceView() {
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Experience"
        links={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Experience' }]}
        sx={{ mb: 3 }}
      />

      {/* Experience content will be added here */}
    </DashboardContent>
  );
}
