import { z } from 'zod';

// Enums
export const ProjectTypeSchema = z.enum([
  'school_district',
  'university',
  'special_project',
  'other-secondary',
  'other-post_secondary',
]);

export const ProjectConditionSchema = z.enum(['editable', 'locked']);

export const ProjectStatusSchema = z.enum(['active', 'stasis', 'completed']);

// Constants
export const SECONDARY_PROJECT_TYPES = ['school_district', 'other-secondary'] as const;

export const POST_SECONDARY_PROJECT_TYPES = ['university', 'other-post_secondary'] as const;

// Main Project Schema with conditional validation
export const ProjectSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),

    image: z.string().trim().default(''),

    project_type: ProjectTypeSchema.default('special_project'),

    condition: ProjectConditionSchema.default('editable'),

    status: ProjectStatusSchema.default('active'),

    reward_system: z.boolean().default(false),

    survey_system: z.boolean().default(false),

    organizations: z.array(z.string()).min(1, 'A project must belong to at least one organization'),

    is_active: z.boolean().default(true),

    school_district: z.any().optional(),

    university: z.any().optional(),
  })
  .refine(
    (data) => {
      // If project_type is secondary, school_district is required
      if (SECONDARY_PROJECT_TYPES.includes(data.project_type as any)) {
        return !!data.school_district;
      }
      return true;
    },
    {
      message: 'school_district is required for secondary project types',
      path: ['school_district'],
    }
  )
  .refine(
    (data) => {
      // If project_type is post-secondary, university is required
      if (POST_SECONDARY_PROJECT_TYPES.includes(data.project_type as any)) {
        return !!data.university;
      }
      return true;
    },
    {
      message: 'university is required for post-secondary project types',
      path: ['university'],
    }
  );

// Type inference
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectType = z.infer<typeof ProjectTypeSchema>;
export type ProjectCondition = z.infer<typeof ProjectConditionSchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

// For creating a new project
export const CreateProjectSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),
    image: z.string().trim().optional(),
    project_type: ProjectTypeSchema.optional(),
    condition: ProjectConditionSchema.optional(),
    status: ProjectStatusSchema.optional(),
    reward_system: z.boolean().optional(),
    survey_system: z.boolean().optional(),
    organizations: z.array(z.string()).min(1, 'A project must belong to at least one organization'),
    is_active: z.boolean().optional(),
    school_district: z.any().optional(),
    university: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.project_type && SECONDARY_PROJECT_TYPES.includes(data.project_type as any)) {
        return !!data.school_district;
      }
      return true;
    },
    {
      message: 'school_district is required for secondary project types',
      path: ['school_district'],
    }
  );

// For updating a project (all fields optional, but still validate conditionally)
export const UpdateProjectSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').optional(),
    image: z.string().trim().optional(),
    project_type: ProjectTypeSchema.optional(),
    condition: ProjectConditionSchema.optional(),
    status: ProjectStatusSchema.optional(),
    reward_system: z.boolean().optional(),
    survey_system: z.boolean().optional(),
    organizations: z
      .array(z.string())
      .min(1, 'A project must belong to at least one organization')
      .optional(),
    is_active: z.boolean().optional(),
    school_district: z.any().optional(),
    university: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.project_type && SECONDARY_PROJECT_TYPES.includes(data.project_type as any)) {
        return !!data.school_district;
      }
      return true;
    },
    {
      message: 'school_district is required for secondary project types',
      path: ['school_district'],
    }
  );

export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
