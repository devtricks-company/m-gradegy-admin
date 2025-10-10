import { CONFIG } from 'src/config-global';

import { StudentsView } from 'src/sections/students/views/students.view';

// ----------------------------------------------------------------------

export const metadata = { title: `Students - ${CONFIG.appName}` };

export default function Page() {
  return <StudentsView />;
}
