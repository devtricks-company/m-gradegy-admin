import { CONFIG } from 'src/config-global';

import { ProjectDetailsView } from 'src/sections/projects/project-details-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Project Details | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return <ProjectDetailsView id={params.id} />;
}
