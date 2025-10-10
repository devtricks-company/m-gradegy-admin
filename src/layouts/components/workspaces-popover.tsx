'use client';

import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useWorkspace } from 'src/contexts/workspace-context';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  data?: {
    id: string;
    name: string;
    logo: string;
  }[];
};

export function WorkspacesPopover({ data = [], sx, ...other }: WorkspacesPopoverProps) {
  const popover = usePopover();
  const { selectedOrganization, setSelectedOrganization } = useWorkspace();

  const mediaQuery = 'sm';

  // Initialize selected organization when data is available
  useEffect(() => {
    if (data.length > 0 && !selectedOrganization) {
      setSelectedOrganization(data[0]);
    }
  }, [data, selectedOrganization, setSelectedOrganization]);

  const handleChangeWorkspace = useCallback(
    (newValue: (typeof data)[0]) => {
      console.log('WorkspacesPopover - changing organization to:', newValue);
      setSelectedOrganization(newValue);
      popover.onClose();
    },
    [popover, setSelectedOrganization]
  );

  return (
    <>
      <ButtonBase
        disableRipple
        onClick={popover.onOpen}
        sx={{
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          ...sx,
        }}
        {...other}
      >
        <Box
          component="img"
          alt={selectedOrganization?.name}
          src={selectedOrganization?.logo}
          sx={{ width: 24, height: 24, borderRadius: '50%' }}
        />

        <Box
          component="span"
          sx={{
            typography: 'subtitle2',
            display: { xs: 'none', [mediaQuery]: 'inline-flex' },
          }}
        >
          {selectedOrganization?.name}
        </Box>

        <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
      </ButtonBase>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-left' } }}
      >
        <MenuList sx={{ width: 240 }}>
          {data.map((option) => (
            <MenuItem
              key={option.id}
              selected={option.id === selectedOrganization?.id}
              onClick={() => handleChangeWorkspace(option)}
              sx={{ height: 48 }}
            >
              <Avatar alt={option.name} src={option.logo} sx={{ width: 24, height: 24 }} />

              <Box component="span" sx={{ flexGrow: 1 }}>
                {option.name}
              </Box>
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
