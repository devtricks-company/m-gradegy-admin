import { CONFIG } from 'src/config-global';

import { OrganizationsView } from 'src/sections/organizations/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Organizations | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OrganizationsView />;
}
