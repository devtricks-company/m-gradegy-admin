'use client';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import {
  useAccessControlControllerListOrganizations,
  useAccessControlControllerListProjects,
  useAccessControlControllerListCategories,
  useAccessControlControllerListSubcategories,
} from 'src/lib/orval/generated/access-control/access-control';

import type { Organization, Project, Category, Subcategory } from 'src/lib/orval/generated/model';

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
  // Fetch filter options
  const { data: organizations, isLoading: loadingOrgs } =
    useAccessControlControllerListOrganizations();
  const { data: projects, isLoading: loadingProjects } = useAccessControlControllerListProjects();
  const { data: categories, isLoading: loadingCategories } =
    useAccessControlControllerListCategories(
      filters.projectId ? { projectId: filters.projectId } : undefined
    );
  const { data: subcategories, isLoading: loadingSubcategories } =
    useAccessControlControllerListSubcategories(
      filters.categoryId ? { categoryId: filters.categoryId } : undefined
    );

  const handleOrganizationChange = useCallback(
    (_event: any, value: Organization | null) => {
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
    (_event: any, value: Project | null) => {
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
    (_event: any, value: Category | null) => {
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
    (_event: any, value: Subcategory | null) => {
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
    organizations?.find((org) => org._id === filters.organizationId) || null;
  const selectedProject = projects?.find((proj) => proj._id === filters.projectId) || null;
  const selectedCategory = categories?.find((cat) => cat._id === filters.categoryId) || null;
  const selectedSubcategory =
    subcategories?.find((sub) => sub._id === filters.subcategoryId) || null;

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
