import { CONFIG } from 'src/config-global';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BlankView } from 'src/sections/blank/view';
import { AdministratorView } from 'src/sections/administrator/views/administrator.view';

// ----------------------------------------------------------------------

export const metadata = { title: `Administrator - ${CONFIG.appName}` };

export default function Page() {
  return <AdministratorView />;
}
