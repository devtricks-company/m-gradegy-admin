import { CONFIG } from 'src/config-global';

import { ExperienceCreateView } from 'src/sections/experience/views/experience-create.view';

// ----------------------------------------------------------------------

export const metadata = { title: `Add Experience - ${CONFIG.appName}` };

export default function Page() {
  return <ExperienceCreateView />;
}
