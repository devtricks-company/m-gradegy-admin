'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

type ExperienceReviewViewProps = {
  id: string;
};

export function ExperienceReviewView({ id }: ExperienceReviewViewProps) {
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Review Experience"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Experience', href: paths.dashboard.experience },
          { name: 'Review' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* Experience Review Content - To be implemented */}
      <div>Experience ID: {id}</div>
    </Container>
  );
}
