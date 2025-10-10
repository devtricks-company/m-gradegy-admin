'use client';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DashboardContent } from 'src/layouts/dashboard';

import { StudentsTable } from '../students-table';
import { NewStudentDialog } from '../new-student-dialog';
import { StudentsFilterPopover } from '../students-filter-popover';

import type { StudentsFilters } from '../students-filter-popover';

export function StudentsView() {
  const [openDialog, setOpenDialog] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<StudentsFilters>({});

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenFilter = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setFilterAnchor(null);
  }, []);

  const handleFiltersChange = useCallback((newFilters: StudentsFilters) => {
    setFilters(newFilters);
  }, []);

  // Count active filters
  const activeFiltersCount = [
    filters.organizationId,
    filters.projectId,
    filters.categoryId,
    filters.subcategoryId,
  ].filter(Boolean).length;

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Students"
        links={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Students' }]}
        action={
          <Stack direction="row" spacing={1}>
            <Badge badgeContent={activeFiltersCount} color="error">
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Iconify icon="ic:round-filter-list" />}
                onClick={handleOpenFilter}
              >
                Filters
              </Button>
            </Badge>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenDialog}
            >
              New Student
            </Button>
          </Stack>
        }
        sx={{ mb: 3 }}
      />

      <StudentsTable filters={filters} />

      <NewStudentDialog open={openDialog} onClose={handleCloseDialog} />

      <StudentsFilterPopover
        open={filterAnchor}
        onClose={handleCloseFilter}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </DashboardContent>
  );
}
