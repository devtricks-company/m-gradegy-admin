'use client';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { useAccessControlControllerListOrganizations } from 'src/lib/orval/generated/access-control/access-control';
import { useProjectsControllerFindByOrganization } from 'src/lib/orval/generated/projects/projects';
import { useCategoriesControllerFindByProject } from 'src/lib/orval/generated/categories/categories';
import { useSubcategoriesControllerFindAllByCategory } from 'src/lib/orval/generated/subcategories/subcategories';

// ----------------------------------------------------------------------

export type StudentsFilters = {
  organizationId?: string;
  projectId?: string;
  categoryId?: string;
  subcategoryId?: string;
};

type StudentsFilterPopoverProps = {
  open: HTMLElement | null;
  onClose: () => void;
  filters: StudentsFilters;
  onFiltersChange: (filters: StudentsFilters) => void;
};

// ----------------------------------------------------------------------

export function StudentsFilterPopover({
  open,
  onClose,
  filters,
  onFiltersChange,
}: StudentsFilterPopoverProps) {
  // Fetch organizations
  const { data: organizations, isLoading: loadingOrgs } =
    useAccessControlControllerListOrganizations();

  // Fetch projects for the selected organization
  const { data: projectsData, isLoading: loadingProjects } =
    useProjectsControllerFindByOrganization(filters.organizationId || '', undefined, {
      query: {
        enabled: !!filters.organizationId, // Only fetch when organization is selected
      },
    });

  const projects = projectsData?.data || [];

  // Fetch categories for the selected project
  const { data: categoriesData, isLoading: loadingCategories } =
    useCategoriesControllerFindByProject(filters.projectId || '', undefined, {
      query: {
        enabled: !!filters.projectId, // Only fetch when project is selected
      },
    });

  const categories = categoriesData?.data || [];

  // Fetch subcategories for the selected category
  const { data: subcategoriesData, isLoading: loadingSubcategories } =
    useSubcategoriesControllerFindAllByCategory(filters.categoryId || '', undefined, {
      query: {
        enabled: !!filters.categoryId, // Only fetch when category is selected
      },
    });

  const subcategories = subcategoriesData?.data || [];

  const handleOrganizationChange = useCallback(
    (_event: any, value: any) => {
      onFiltersChange({
        ...filters,
        organizationId: value?._id,
        // Reset dependent filters
        projectId: undefined,
        categoryId: undefined,
        subcategoryId: undefined,
      });
    },
    [filters, onFiltersChange]
  );

  const handleProjectChange = useCallback(
    (_event: any, value: any) => {
      onFiltersChange({
        ...filters,
        projectId: value?._id,
        // Reset dependent filters
        categoryId: undefined,
        subcategoryId: undefined,
      });
    },
    [filters, onFiltersChange]
  );

  const handleCategoryChange = useCallback(
    (_event: any, value: any) => {
      onFiltersChange({
        ...filters,
        categoryId: value?._id,
        // Reset dependent filters
        subcategoryId: undefined,
      });
    },
    [filters, onFiltersChange]
  );

  const handleSubcategoryChange = useCallback(
    (_event: any, value: any) => {
      onFiltersChange({
        ...filters,
        subcategoryId: value?._id,
      });
    },
    [filters, onFiltersChange]
  );

  const handleClearAll = useCallback(() => {
    onFiltersChange({
      organizationId: undefined,
      projectId: undefined,
      categoryId: undefined,
      subcategoryId: undefined,
    });
  }, [onFiltersChange]);

  const selectedOrganization =
    organizations?.find((org: any) => org._id === filters.organizationId) || null;
  const selectedProject = projects?.find((proj: any) => proj._id === filters.projectId) || null;
  const selectedCategory = categories?.find((cat: any) => cat._id === filters.categoryId) || null;
  const selectedSubcategory =
    subcategories?.find((sub: any) => sub._id === filters.subcategoryId) || null;

  const hasActiveFilters =
    !!filters.organizationId ||
    !!filters.projectId ||
    !!filters.categoryId ||
    !!filters.subcategoryId;

  return (
    <CustomPopover
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: 320 },
        },
      }}
    >
      <Stack spacing={2} sx={{ p: 2.5 }}>
        <Typography variant="h6">Filters</Typography>

        <Autocomplete
          fullWidth
          size="small"
          options={organizations || []}
          loading={loadingOrgs}
          value={selectedOrganization}
          onChange={handleOrganizationChange}
          getOptionLabel={(option) => option.title || ''}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Organization"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingOrgs ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <Autocomplete
          fullWidth
          size="small"
          options={projects || []}
          loading={loadingProjects}
          value={selectedProject}
          onChange={handleProjectChange}
          getOptionLabel={(option) => option.title || ''}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Project"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingProjects ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <Autocomplete
          fullWidth
          size="small"
          options={categories || []}
          loading={loadingCategories}
          value={selectedCategory}
          onChange={handleCategoryChange}
          disabled={!filters.projectId}
          getOptionLabel={(option) => option.title || ''}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Category"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingCategories ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <Autocomplete
          fullWidth
          size="small"
          options={subcategories || []}
          loading={loadingSubcategories}
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
          disabled={!filters.categoryId}
          getOptionLabel={(option) => option.title || ''}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Subcategory"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingSubcategories ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" spacing={1}>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={handleClearAll}
            disabled={!hasActiveFilters}
          >
            Clear
          </Button>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Iconify icon="eva:checkmark-fill" />}
            onClick={onClose}
          >
            Apply
          </Button>
        </Stack>
      </Stack>
    </CustomPopover>
  );
}
