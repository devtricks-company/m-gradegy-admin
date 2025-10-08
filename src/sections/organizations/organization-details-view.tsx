'use client';

import { useMemo, useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';

import { useOrganizationsControllerFindOne } from 'src/lib/orval/generated/organizations/organizations';
import { useProjectsControllerFindByOrganization } from 'src/lib/orval/generated/projects/projects';
import type { Project } from 'src/lib/orval/generated/model';

import { OrganizationForm } from './form/organization-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

type ProjectRow = Project & { _id: string };

export function OrganizationDetailsView({ id }: Props) {
  const { data: organization, isLoading, error } = useOrganizationsControllerFindOne(id);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjectsControllerFindByOrganization(id, {
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });

  const projectColumns: GridColDef<ProjectRow>[] = useMemo(
    () => [
      {
        field: 'image',
        headerName: 'Image',
        width: 80,
        sortable: false,
        renderCell: (params) => (
          <Avatar src={params.value} alt={params.row.title} sx={{ width: 40, height: 40 }}>
            {params.row.title?.charAt(0)}
          </Avatar>
        ),
      },
      {
        field: 'title',
        headerName: 'Title',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'project_type',
        headerName: 'Type',
        width: 150,
      },
      {
        field: 'condition',
        headerName: 'Condition',
        width: 130,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
      },
      {
        field: 'reward_system',
        headerName: 'Rewards',
        width: 120,
        type: 'boolean',
      },
      {
        field: 'survey_system',
        headerName: 'Surveys',
        width: 120,
        type: 'boolean',
      },
      {
        field: 'is_active',
        headerName: 'Active',
        width: 100,
        type: 'boolean',
      },
    ],
    []
  );

  const projectRows = (projectsData?.data || []) as ProjectRow[];
  const projectRowCount = projectsData?.meta?.totalItems || 0;

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Organization Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Organizations', href: paths.dashboard.organizations },
          { name: organization?.title || 'Details' },
        ]}
        action={
          organization && (
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:pen-bold" />}
              onClick={() => setOpenEditDialog(true)}
            >
              Edit
            </Button>
          )
        }
        sx={{ mb: 3 }}
      />

      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 400 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading organization details...
          </Typography>
        </Stack>
      ) : error ? (
        <Alert severity="error">Failed to load organization details</Alert>
      ) : organization ? (
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                <Avatar
                  src={organization.image}
                  alt={organization.title}
                  sx={{ width: 80, height: 80 }}
                >
                  {organization.title?.charAt(0)}
                </Avatar>
                <Stack>
                  <Typography variant="h4">{organization.title}</Typography>
                  {organization.short_title && (
                    <Typography variant="body2" color="text.secondary">
                      {organization.short_title as unknown as string}
                    </Typography>
                  )}
                </Stack>
              </Stack>

              <Stack spacing={2}>
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                    Organization Type:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {organization.organization_type || 'N/A'}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                    School District :
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {organization.school_district?.agancy_name || 'N/A'}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                    Lead Contact :
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {organization.lead_contact.firstName +
                      ' ' +
                      organization.lead_contact.lastName || 'N/A'}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                    UFCS Member:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {organization.ufcs_member ? 'Yes' : 'No'}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                    Paid:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {organization.paid ? 'Yes' : 'No'}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                    Reward System:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {organization.reward_system ? 'Enabled' : 'Disabled'}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                    Survey System:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {organization.survey_system ? 'Enabled' : 'Disabled'}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                    Status:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {organization.is_active ? 'Active' : 'Inactive'}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Projects
              </Typography>

              {projectsError ? (
                <Alert severity="error">Failed to load projects</Alert>
              ) : projectsLoading ? (
                <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 300 }}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading projects...
                  </Typography>
                </Stack>
              ) : (
                <DataGrid
                  rows={projectRows}
                  columns={projectColumns}
                  rowCount={projectRowCount}
                  loading={projectsLoading}
                  pageSizeOptions={[5, 10, 25, 50]}
                  paginationModel={paginationModel}
                  paginationMode="server"
                  onPaginationModelChange={setPaginationModel}
                  getRowId={(row) => row._id}
                  disableRowSelectionOnClick
                  sx={{
                    border: 0,
                    minHeight: 400,
                    '& .MuiDataGrid-cell:focus': {
                      outline: 'none',
                    },
                    '& .MuiDataGrid-row:hover': {
                      cursor: 'pointer',
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>
        </Stack>
      ) : (
        <Alert severity="warning">Organization not found</Alert>
      )}

      {organization && (
        <OrganizationForm
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          currentOrganization={organization}
        />
      )}
    </DashboardContent>
  );
}
