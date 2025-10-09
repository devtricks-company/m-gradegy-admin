import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';

import { AdministratorTable } from '../administrator-table';

export function AdministratorView() {
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Administrator"
        links={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Administrator' }]}
        sx={{ mb: 3 }}
      />

      <AdministratorTable />
    </DashboardContent>
  );
}
