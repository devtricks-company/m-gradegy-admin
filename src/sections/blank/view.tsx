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

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useWorkspace } from 'src/contexts/workspace-context';

import {
  useProjectsControllerFindByOrganization,
  useProjectsControllerFindAll,
} from 'src/lib/orval/generated/projects/projects';
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
  const router = useRouter();
  const { selectedOrganization, setSelectedProject } = useWorkspace();

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    router.push(paths.dashboard.students);
  };

  // Fetch all projects when no organization is selected
  const {
    data: allProjectsData,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useProjectsControllerFindAll({
    query: {
      enabled: selectedOrganization?.id === 'team-1',
    },
  });

  // Fetch projects by organization when one is selected
  const {
    data: orgProjectsData,
    isLoading: isLoadingOrg,
    error: errorOrg,
  } = useProjectsControllerFindByOrganization(
    selectedOrganization?.id && selectedOrganization?.id !== 'team-1'
      ? selectedOrganization?.id
      : '',
    {
      page: 1,
      limit: 100,
    },
    {
      query: {
        enabled: !!selectedOrganization?.id && selectedOrganization?.id !== 'team-1',
      },
    }
  );

  // Use the appropriate data based on whether an organization is selected
  const projects =
    selectedOrganization?.id && selectedOrganization?.id !== 'team-1'
      ? orgProjectsData?.data || []
      : allProjectsData?.data || [];

  console.log('projects', projects);

  const isLoading =
    selectedOrganization?.id && selectedOrganization?.id !== 'team-1' ? isLoadingOrg : isLoadingAll;
  const error = selectedOrganization?.id ? errorOrg : errorAll;

  return (
    <DashboardContent maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">{title}</Typography>
        {selectedOrganization && (
          <Chip
            label={`Organization: ${selectedOrganization.name}`}
            color="primary"
            variant="outlined"
          />
        )}
      </Stack>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {!!error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {'Failed to load projects. Please try again later.'}
        </Alert>
      )}

      {!isLoading && projects && projects.length === 0 && (
        <Alert severity="info">
          {selectedOrganization
            ? 'No projects available for this organization.'
            : 'No projects available.'}
        </Alert>
      )}

      {projects && projects.length > 0 && (
        <Grid container spacing={3}>
          {projects.map((project: Project, index: number) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                onClick={() => handleProjectClick(project)}
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
