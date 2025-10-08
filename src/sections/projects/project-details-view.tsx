'use client';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';

import { useProjectsControllerFindOne } from 'src/lib/orval/generated/projects/projects';

import { ProjectForm } from '../organizations/form/project-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function ProjectDetailsView({ id }: Props) {
  const { data: project, isLoading, error } = useProjectsControllerFindOne(id);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Project Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Organizations', href: paths.dashboard.organizations },
          { name: project?.title || 'Project Details' },
        ]}
        action={
          project && (
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:pen-bold" />}
              onClick={() => setOpenEditDialog(true)}
            >
              Edit Project
            </Button>
          )
        }
        sx={{ mb: 3 }}
      />

      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 400 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading project details...
          </Typography>
        </Stack>
      ) : error ? (
        <Alert severity="error">Failed to load project details</Alert>
      ) : project ? (
        <Card>
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
              <Avatar src={project.image} alt={project.title} sx={{ width: 80, height: 80 }}>
                {project.title?.charAt(0)}
              </Avatar>
            </Stack>

            <Stack spacing={2}>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                  Project Type:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.project_type || 'N/A'}
                </Typography>
              </Stack>
              {project.school_district && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                    School District:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.school_district?.agancy_name || 'N/A'}
                  </Typography>
                </Stack>
              )}

              {project.school_district && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                    University:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.university?.instnm || 'N/A'}
                  </Typography>
                </Stack>
              )}

              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                  Condition:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.condition || 'N/A'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                  Status:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.status || 'N/A'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                  Reward System:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.reward_system ? 'Enabled' : 'Disabled'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                  Survey System:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.survey_system ? 'Enabled' : 'Disabled'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                  Active:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.is_active ? 'Yes' : 'No'}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Alert severity="warning">Project not found</Alert>
      )}

      {/* Edit Project Dialog */}
      {project && project.organizations && project.organizations.length > 0 && (
        <ProjectForm
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          organizationId={typeof project.organizations[0] === 'string' ? project.organizations[0] : project.organizations[0]?.id || ''}
          project={project}
          projectId={id}
          isEdit
        />
      )}
    </DashboardContent>
  );
}
