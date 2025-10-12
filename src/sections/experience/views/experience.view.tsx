'use client';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DashboardContent } from 'src/layouts/dashboard';

import { ExperienceTable } from '../experience-table';
import { ExperienceFilterPopover } from '../experience-filter-popover';

import type { ExperienceFilters } from '../experience-filter-popover';

export function ExperienceView() {
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<ExperienceFilters>({});

  const handleOpenFilter = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setFilterAnchor(null);
  }, []);

  const handleFiltersChange = useCallback((newFilters: ExperienceFilters) => {
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
        heading="Experience"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Experience' }]}
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
              component={RouterLink}
              href={paths.dashboard.experienceNew}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Experience
            </Button>
          </Stack>
        }
        sx={{ mb: 3 }}
      />

      <ExperienceTable filters={filters} />

      <ExperienceFilterPopover
        open={filterAnchor}
        onClose={handleCloseFilter}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </DashboardContent>
  );
}
