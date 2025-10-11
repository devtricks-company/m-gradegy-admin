import type { Metadata } from 'next';

import { AdministratorDetailsView } from 'src/sections/administrator/views/administrator-details.view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: 'Administrator Details' };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return <AdministratorDetailsView id={params.id} />;
}
