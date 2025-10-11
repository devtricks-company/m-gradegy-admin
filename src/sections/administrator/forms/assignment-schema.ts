import { z as zod } from 'zod';

export const assignmentSchema = zod
  .object({
    organization: zod.string().min(1, 'Organization is required'),
    project: zod.string().optional(),
    category: zod.string().optional(),
    subcategory: zod.string().optional(),
  })
  .refine(
    (data) => {
      // If category is selected, project must be selected
      if (data.category && !data.project) {
        return false;
      }
      return true;
    },
    {
      message: 'Project is required when category is selected',
      path: ['project'],
    }
  )
  .refine(
    (data) => {
      // If subcategory is selected, category must be selected
      if (data.subcategory && !data.category) {
        return false;
      }
      return true;
    },
    {
      message: 'Category is required when subcategory is selected',
      path: ['category'],
    }
  );

export type AssignmentSchemaType = zod.infer<typeof assignmentSchema>;
