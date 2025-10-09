'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
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
import {
  useCategoriesControllerFindByProject,
  useCategoriesControllerRemove,
  getCategoriesControllerFindByProjectQueryKey,
} from 'src/lib/orval/generated/categories/categories';

import { ProjectForm } from '../organizations/form/project-form';
import { CategoryForm } from '../categories/category-form';
import { CategoryDetailsDrawer } from '../categories/category-details-drawer';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function ProjectDetailsView({ id }: Props) {
  const queryClient = useQueryClient();
  const { data: project, isLoading, error } = useProjectsControllerFindOne(id);
  const { data: categoriesData, isLoading: loadingCategories } = useCategoriesControllerFindByProject(id);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const { mutate: removeCategory, isPending: isRemovingCategory } = useCategoriesControllerRemove();

  const handleDeleteCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    removeCategory(
      { id: categoryId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getCategoriesControllerFindByProjectQueryKey(id),
          });
          if (selectedCategoryId === categoryId) {
            setSelectedCategoryId(null);
          }
        },
      }
    );
  };

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

      {/* Categories Section */}
      {project && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6">Categories</Typography>
              <CategoryForm projectId={id} />
            </Stack>
            {loadingCategories ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 2 }}>
                <CircularProgress size={24} />
              </Stack>
            ) : categoriesData?.data && categoriesData.data.length > 0 ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {categoriesData.data.map((category: any) => (
                  <Chip
                    key={category._id || category.id}
                    label={category.title}
                    color="primary"
                    variant="outlined"
                    onClick={() => setSelectedCategoryId(category._id || category.id)}
                    onDelete={(e) => handleDeleteCategory(category._id || category.id, e)}
                    deleteIcon={
                      <Iconify
                        icon="mingcute:close-line"
                        width={18}
                        sx={{ opacity: isRemovingCategory ? 0.5 : 1 }}
                      />
                    }
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No categories found for this project
              </Typography>
            )}
          </CardContent>
        </Card>
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

      {/* Category Details Drawer */}
      <CategoryDetailsDrawer
        open={!!selectedCategoryId}
        onClose={() => setSelectedCategoryId(null)}
        categoryId={selectedCategoryId}
        projectId={id}
      />
    </DashboardContent>
  );
}
