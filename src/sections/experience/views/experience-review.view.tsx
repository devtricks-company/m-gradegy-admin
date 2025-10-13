'use client';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  useExperiencesControllerFindOne,
  useExperiencesControllerListStudentsWithAccess,
} from 'src/lib/orval/generated/experiences/experiences';
import type { ExperiencesControllerListStudentsWithAccess200DataItem } from 'src/lib/orval/generated/model';

// ----------------------------------------------------------------------

type ExperienceReviewViewProps = {
  id: string;
};

type StudentRow = ExperiencesControllerListStudentsWithAccess200DataItem & {
  id: string;
};

export function ExperienceReviewView({ id }: ExperienceReviewViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch experience details
  const { data: experience, isLoading: isLoadingExperience } = useExperiencesControllerFindOne(id);

  // Fetch students with access
  const { data: studentsData, isLoading: isLoadingStudents } =
    useExperiencesControllerListStudentsWithAccess(id, {
      search: searchQuery || undefined,
    });

  const students = useMemo<StudentRow[]>(() => {
    if (!studentsData?.data) return [];
    return studentsData.data.map((student, index) => ({
      ...student,
      id: student.user?._id || `student-${index}`,
    }));
  }, [studentsData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const completed = students.filter((s) => s.completed).length;
    const notCompleted = totalStudents - completed;

    return {
      totalStudents,
      completed,
      notCompleted,
      viewed: 0, // Will be implemented when backend provides viewed data
    };
  }, [students]);

  const columns: GridColDef<StudentRow>[] = useMemo(
    () => [
      {
        field: 'student',
        headerName: 'Students',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              src={params.row.user?.avatarUrl || undefined}
              alt={`${params.row.user?.firstName} ${params.row.user?.lastName}`}
              sx={{ width: 32, height: 32 }}
            >
              {params.row.user?.firstName?.[0]}
              {params.row.user?.lastName?.[0]}
            </Avatar>
            <Typography variant="body2">
              {params.row.user?.firstName} {params.row.user?.lastName}
            </Typography>
          </Stack>
        ),
        valueGetter: (_value, row) =>
          `${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim() || 'N/A',
      },
      {
        field: 'completed',
        headerName: 'Date',
        width: 150,
        renderCell: (params) => (
          <Typography
            variant="body2"
            color={params.row.completedAt ? 'text.primary' : 'text.disabled'}
          >
            {params.row.completedAt ? new Date(params.row.completedAt).toLocaleDateString() : '--'}
          </Typography>
        ),
        valueGetter: (_value, row) => row.completedAt || '',
      },
      {
        field: 'status',
        headerName: 'Complete',
        width: 100,
        sortable: false,
        renderCell: (params) => (
          <Switch
            checked={params.row.completed || false}
            onChange={() => {
              // Functionality will be implemented later
            }}
            color="success"
          />
        ),
      },
    ],
    []
  );

  if (isLoadingExperience) {
    return (
      <Container maxWidth="xl">
        <Stack alignItems="center" justifyContent="center" sx={{ height: 400 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading experience...
          </Typography>
        </Stack>
      </Container>
    );
  }

  if (!experience) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error">Experience not found</Alert>
      </Container>
    );
  }

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

      <Grid container spacing={3}>
        {/* First Column - Experience Details & Students Table */}
        <Grid xs={12} md={6}>
          <Stack spacing={3}>
            {/* Experience Header Card */}
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                {/* Experience Header */}
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    src={experience.image}
                    alt={experience.title}
                    variant="rounded"
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.lighter',
                    }}
                  >
                    <Iconify icon="eva:image-outline" width={32} />
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>
                      {experience.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {experience.subtitle || 'this is test'}
                    </Typography>
                  </Box>

                  {/* XP Badge */}
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    sx={{
                      bgcolor: 'background.neutral',
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {experience.xp_completion}
                    </Typography>
                    <Typography variant="caption" color="error.main" sx={{ fontWeight: 'bold' }}>
                      XP
                    </Typography>
                  </Stack>
                </Stack>

                {/* Completion Stats */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h6">Completion</Typography>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: stats.completed > 0 ? 'success.main' : 'grey.400',
                      }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Students
                      </Typography>
                      <Typography variant="h6">{stats.totalStudents}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Complete
                      </Typography>
                      <Typography variant="h6">{stats.completed}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Not Complete
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        {stats.notCompleted}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Viewed
                      </Typography>
                      <Typography variant="h6">{stats.viewed}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Card>

            {/* Students Table Card */}
            <Card>
              <Stack spacing={2} sx={{ p: 2 }}>
                <Typography variant="h6">Students</Typography>

                <TextField
                  fullWidth
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={students}
                    columns={columns}
                    loading={isLoadingStudents}
                    disableRowSelectionOnClick
                    disableColumnMenu
                    hideFooter
                    sx={{
                      border: 0,
                      '& .MuiDataGrid-cell:focus': {
                        outline: 'none',
                      },
                      '& .MuiDataGrid-columnHeaders': {
                        bgcolor: 'background.neutral',
                        borderRadius: 1,
                      },
                      '& .MuiDataGrid-row:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  />
                </Box>

                {/* Pagination info */}
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Rows per page: 25 &nbsp;&nbsp; 1-NaN of undefined
                </Typography>
              </Stack>
            </Card>
          </Stack>
        </Grid>

        {/* Second Column - Statistics Charts */}
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Completion Statistics
            </Typography>

            <Stack spacing={4} sx={{ mt: 3 }}>
              {/* Donut Chart for Completion Percentage */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#f0f0f0"
                      strokeWidth="20"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#4CAF50"
                      strokeWidth="20"
                      strokeDasharray={`${
                        stats.totalStudents > 0
                          ? (stats.completed / stats.totalStudents) * 502.65
                          : 0
                      } 502.65`}
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {stats.totalStudents > 0
                        ? Math.round((stats.completed / stats.totalStudents) * 100)
                        : 0}
                      %
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Complete
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Bar Charts */}
              <Stack spacing={3}>
                {/* Total Students Bar */}
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Total Students
                    </Typography>
                    <Typography variant="h6">{stats.totalStudents}</Typography>
                  </Stack>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'grey.300',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: 'primary.main',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                </Box>

                {/* Complete Bar */}
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Complete
                    </Typography>
                    <Typography variant="h6">{stats.completed}</Typography>
                  </Stack>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'grey.300',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${
                          stats.totalStudents > 0
                            ? (stats.completed / stats.totalStudents) * 100
                            : 0
                        }%`,
                        height: '100%',
                        bgcolor: 'success.main',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                </Box>

                {/* Not Complete Bar */}
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Not Complete
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {stats.notCompleted}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'grey.300',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${
                          stats.totalStudents > 0
                            ? (stats.notCompleted / stats.totalStudents) * 100
                            : 0
                        }%`,
                        height: '100%',
                        bgcolor: 'error.main',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                </Box>

                {/* Viewed Bar */}
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Viewed
                    </Typography>
                    <Typography variant="h6">{stats.viewed}</Typography>
                  </Stack>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'grey.300',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${
                          stats.totalStudents > 0 ? (stats.viewed / stats.totalStudents) * 100 : 0
                        }%`,
                        height: '100%',
                        bgcolor: 'info.main',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
