import { CONFIG } from 'src/config-global';

import { OrganizationDetailsView } from 'src/sections/organizations/organization-details-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Organization Details | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return <OrganizationDetailsView id={params.id} />;
}
