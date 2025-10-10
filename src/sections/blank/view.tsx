'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { useAccessControlControllerListOrganizations } from 'src/lib/orval/generated/access-control/access-control';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function BlankView({ title = 'Blank' }: Props) {
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');

  // Fetch organizations list accessible to the current user
  const { data: organizations = [], isLoading, error } = useAccessControlControllerListOrganizations();

  const handleOrganizationChange = (event: SelectChangeEvent) => {
    setSelectedOrganization(event.target.value);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        {title}
      </Typography>

      <Card sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="organization-select-label">Select Organization</InputLabel>
          <Select
            labelId="organization-select-label"
            id="organization-select"
            value={selectedOrganization}
            label="Select Organization"
            onChange={handleOrganizationChange}
            disabled={isLoading}
          >
            {isLoading && (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading organizations...
              </MenuItem>
            )}
            {!isLoading && organizations.length === 0 && (
              <MenuItem disabled>No organizations available</MenuItem>
            )}
            {organizations.map((org) => (
              <MenuItem key={org.title} value={org.title}>
                {org.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to load organizations. Please try again.
          </Alert>
        )}

        {selectedOrganization && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Selected: <strong>{selectedOrganization}</strong>
            </Typography>
          </Box>
        )}
      </Card>

      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      />
    </DashboardContent>
  );
}
