import { z } from 'zod';

// Enum for Organization Type
export const OrganizationTypeEnum = z.enum(['secondary', 'post_secondary', 'cbo', 'other']);

export type OrganizationType = z.infer<typeof OrganizationTypeEnum>;

// ObjectId validation (MongoDB ObjectIds are 24 character hex strings)
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

// Base Organization Schema (common fields)
export const OrganizationBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),

  short_title: z
    .string()
    .trim()
    .max(100, 'Short title must be less than 100 characters')
    .nullable()
    .optional(),

  organization_type: OrganizationTypeEnum,

  image: z.string().trim().url('Must be a valid URL').or(z.literal('')).optional(),

  ufcs_member: z.boolean().default(false),

  lead_contact: z.any(),

  paid: z.boolean().default(false),

  reward_system: z.boolean().default(false),

  survey_system: z.boolean().default(false),

  school_district: z.any().optional(),

  university: z.any().optional(),

  is_active: z.boolean().default(true),
});

// Schema for creating a new organization (without _id and timestamps)
export const CreateOrganizationSchema = OrganizationBaseSchema;

export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>;

// Schema for updating an organization (all fields optional)
export const UpdateOrganizationSchema = OrganizationBaseSchema.partial();

export type UpdateOrganizationInput = z.infer<typeof UpdateOrganizationSchema>;

// Schema for organization response (includes _id and timestamps)
export const OrganizationResponseSchema = OrganizationBaseSchema.extend({
  _id: objectIdSchema,
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
});

export type OrganizationResponse = z.infer<typeof OrganizationResponseSchema>;

// Schema with populated references (for when lead_contact, school_district, or university are populated)
export const OrganizationWithPopulatedRefsSchema = OrganizationBaseSchema.extend({
  _id: objectIdSchema,
  lead_contact: z.union([
    objectIdSchema,
    z.object({
      _id: objectIdSchema,
      // Add other user fields as needed
      email: z.string().email(),
      name: z.string(),
    }),
  ]),
  school_district: z
    .union([
      objectIdSchema,
      z.object({
        _id: objectIdSchema,
        // Add school district fields as needed
        name: z.string(),
      }),
    ])
    .optional(),
  university: z
    .union([
      objectIdSchema,
      z.object({
        _id: objectIdSchema,
        // Add university fields as needed
        name: z.string(),
      }),
    ])
    .optional(),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
});

export type OrganizationWithPopulatedRefs = z.infer<typeof OrganizationWithPopulatedRefsSchema>;

// Validation helpers
export const validateCreateOrganization = (data: unknown) => {
  return CreateOrganizationSchema.safeParse(data);
};

export const validateUpdateOrganization = (data: unknown) => {
  return UpdateOrganizationSchema.safeParse(data);
};

export const validateOrganizationResponse = (data: unknown) => {
  return OrganizationResponseSchema.safeParse(data);
};

// Custom refinements for business logic
export const CreateOrganizationWithRefinements = CreateOrganizationSchema.refine(
  (data) => {
    // If organization type is secondary, school_district should be provided
    if (data.organization_type === 'secondary' && !data.school_district) {
      return false;
    }
    // If organization type is post_secondary, university should be provided
    if (data.organization_type === 'post_secondary' && !data.university) {
      return false;
    }
    return true;
  },
  {
    message:
      'Secondary organizations must have a school_district, and post-secondary organizations must have a university',
    path: ['organization_type'],
  }
);

export type CreateOrganizationWithRefinementsInput = z.infer<
  typeof CreateOrganizationWithRefinements
>;
