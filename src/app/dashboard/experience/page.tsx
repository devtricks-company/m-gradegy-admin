import { CONFIG } from 'src/config-global';

import { ExperienceView } from 'src/sections/experience/views/experience.view';

// ----------------------------------------------------------------------

export const metadata = { title: `Experience - ${CONFIG.appName}` };

export default function Page() {
  return <ExperienceView />;
}
