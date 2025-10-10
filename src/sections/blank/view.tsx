'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import { DashboardContent } from 'src/layouts/dashboard';
import { useWorkspace } from 'src/contexts/workspace-context';

import { useProjectsControllerFindByOrganization } from 'src/lib/orval/generated/projects/projects';
import type { Project } from 'src/lib/orval/generated/model';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

// Helper function to format project type for display
const formatProjectType = (type: string): string => {
  switch (type) {
    case 'school_district':
      return 'School District';
    case 'university':
      return 'University';
    case 'special_project':
      return 'Special Project';
    case 'other-secondary':
      return 'Secondary';
    case 'other-post_secondary':
      return 'Post-Secondary';
    default:
      return type;
  }
};

// Helper function to get color based on project type
const getProjectTypeColor = (type: string) => {
  switch (type) {
    case 'school_district':
      return 'primary';
    case 'university':
      return 'secondary';
    case 'special_project':
      return 'info';
    default:
      return 'default';
  }
};

export function BlankView({ title = 'All Projects' }: Props) {
  const { selectedOrganization } = useWorkspace();

  const {
    data: projectsData,
    isLoading,
    error,
  } = useProjectsControllerFindByOrganization(
    selectedOrganization?.id || '',
    {
      page: 1,
      limit: 100,
    },
    {
      query: {
        enabled: !!selectedOrganization?.id,
      },
    }
  );

  const projects = projectsData?.data || [];

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        {title}
      </Typography>

      {!selectedOrganization && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please select an organization from the workspace dropdown to view projects.
        </Alert>
      )}

      {selectedOrganization && isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {selectedOrganization && !!error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {'Failed to load projects. Please try again later.'}
        </Alert>
      )}

      {selectedOrganization && !isLoading && projects && projects.length === 0 && (
        <Alert severity="info">No projects available for this organization.</Alert>
      )}

      {selectedOrganization && projects && projects.length > 0 && (
        <Grid container spacing={3}>
          {projects.map((project: Project, index: number) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[8],
                  },
                }}
              >
                {project.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={project.image}
                    alt={project.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                {!project.image && (
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: (theme) => theme.palette.primary.main,
                      backgroundImage: 'url(/assets/illustrations/astronaut-illustration.svg)',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack spacing={2}>
                    <Typography variant="h6" component="h2" noWrap>
                      {project.title}
                    </Typography>

                    <Chip
                      label={formatProjectType(project.project_type)}
                      color={getProjectTypeColor(project.project_type)}
                      size="small"
                      sx={{ alignSelf: 'flex-start' }}
                    />

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {project.organizations?.length || 0} Student
                        {project.organizations?.length !== 1 ? 's' : ''}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </DashboardContent>
  );
}
