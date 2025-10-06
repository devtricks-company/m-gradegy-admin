'use client';

import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';

import { useDebounce } from 'src/hooks/use-debounce';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useOrganizationsControllerFindAll } from 'src/lib/orval/generated/organizations/organizations';

import type { Organization } from 'src/lib/orval/generated/model';

// ----------------------------------------------------------------------

type OrganizationRow = Organization & { _id: string };

export function OrganizationsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading, error } = useOrganizationsControllerFindAll({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: debouncedSearch || undefined,
  });

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handleOpenDialog = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const columns: GridColDef<OrganizationRow>[] = useMemo(
    () => [
      {
        field: 'title',
        headerName: 'Title',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'short_title',
        headerName: 'Short Title',
        width: 150,
      },
      {
        field: 'organization_type',
        headerName: 'Type',
        width: 150,
      },
      {
        field: 'ufcs_member',
        headerName: 'UFCS Member',
        width: 130,
        type: 'boolean',
      },
      {
        field: 'paid',
        headerName: 'Paid',
        width: 100,
        type: 'boolean',
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

  const rows = (data?.data || []) as OrganizationRow[];
  const rowCount = data?.meta?.totalItems || 0;

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Organizations"
        links={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Organizations' }]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenDialog}
          >
            New Organization
          </Button>
        }
        sx={{ mb: 3 }}
      />

      <Stack spacing={3}>
        <TextField
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search organizations..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        {error ? (
          <Alert severity="error">Failed to load organizations</Alert>
        ) : (
          <Card>
          {isLoading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ height: 400 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Loading organizations...
              </Typography>
            </Stack>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              rowCount={rowCount}
              loading={isLoading}
              pageSizeOptions={[5, 10, 25, 50]}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
              getRowId={(row) => row._id}
              disableRowSelectionOnClick
              sx={{
                border: 0,
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-row:hover': {
                  cursor: 'pointer',
                },
              }}
            />
          )}
        </Card>
        )}
      </Stack>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>New Organization</DialogTitle>
        <DialogContent>
          <Typography>Add organization form content here</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
