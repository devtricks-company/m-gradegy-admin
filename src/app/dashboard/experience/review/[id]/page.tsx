import { CONFIG } from 'src/config-global';

import { ExperienceReviewView } from 'src/sections/experience/views/experience-review.view';

// ----------------------------------------------------------------------

export const metadata = { title: `Review Experience - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <ExperienceReviewView id={id} />;
}
