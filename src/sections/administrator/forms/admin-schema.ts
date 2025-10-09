import { z as zod } from 'zod';

import { AdministrativeRole } from 'src/lib/orval/generated/model';

export const adminSchema = zod.object({
  avatarUrl: zod.string().optional(),
  firstName: zod.string().min(1, 'First name is required'),
  lastName: zod.string().min(1, 'Last name is required'),
  role: zod.nativeEnum(AdministrativeRole, {
    required_error: 'Role is required',
  }),
  email: zod.string().min(1, 'Email is required').email('Email must be a valid email address'),
  password: zod.string().min(8, 'Password must be at least 8 characters'),
  phone: zod.string().optional(),
  jobs: zod.string().optional(),
});

export type AdminSchemaType = zod.infer<typeof adminSchema>;
