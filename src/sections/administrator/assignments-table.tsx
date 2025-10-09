'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { Iconify } from 'src/components/iconify';

import type {
  Category,
  Organization,
  Project,
  Subcategory,
  UserAssignment,
} from 'src/lib/orval/generated/model';

// ----------------------------------------------------------------------

type AssignmentsTableProps = {
  assignments: UserAssignment[];
  onDelete?: (assignment: UserAssignment) => void;
  onAdd?: () => void;
};

export function AssignmentsTable({ assignments, onDelete, onAdd }: AssignmentsTableProps) {
  return (
    <Card>
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Access Control Assignments</Typography>
          {onAdd && (
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={onAdd}
            >
              Add Assignment
            </Button>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage scoped access permissions for this administrator
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Organization</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Subcategory</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No assignments yet. Click "Add Assignment" to create one.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Typography variant="body2">
                      {(assignment.organization as unknown as Organization)?.title || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={assignment.project ? 'text.primary' : 'text.disabled'}
                    >
                      {(assignment.project as unknown as Project)?.title || 'All Projects'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={assignment.category ? 'text.primary' : 'text.disabled'}
                    >
                      {(assignment.category as unknown as Category)?.title || 'All Categories'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={assignment.subcategory ? 'text.primary' : 'text.disabled'}
                    >
                      {(assignment.subcategory as unknown as Subcategory)?.title ||
                        'All Subcategories'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {onDelete && (
                      <IconButton color="error" onClick={() => onDelete(assignment)} size="small">
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
