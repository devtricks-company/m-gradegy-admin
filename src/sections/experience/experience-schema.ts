import { z as zod } from 'zod';

// ----------------------------------------------------------------------

export const experienceSchema = zod.object({
  // Preview card fields
  title: zod.string().min(1, 'Title is required'),
  subtitle: zod.string().optional(),
  description: zod.string().optional(),
  image: zod.any().optional(),

  // Experience Type
  experienceType: zod.string().min(1, 'Experience type is required'),

  // Category and Filters
  category: zod.string(),
  subcategory: zod.string(),
  tags: zod.string(),
  educationPhase: zod.string(),
  semester: zod.string(),

  // Timing
  timing: zod.string(),
  days: zod.number().min(0),
  completionRequired: zod.boolean(),

  // Motivational Design
  xpCompletion: zod.number().min(0),
  xpViewing: zod.number().min(0),
  gems: zod.number().min(0),
  submissionType: zod.string(),
  autoCompletion: zod.boolean(),
  addLinkInText: zod.boolean(),
  notification: zod.boolean(),

  // Tags section
  driver1: zod.string().optional(),
  driver2: zod.string().optional(),
  levelOfProgression: zod.string().optional(),
  persona: zod.string().optional(),
  milestone: zod.boolean(),
  weight: zod.number().min(0).max(3),
  difficulty: zod.boolean(),
  fire: zod.number().min(1).max(4),

  // Advanced
  pastDue: zod.boolean(),
});

export type ExperienceFormValues = zod.infer<typeof experienceSchema>;

export const defaultValues: ExperienceFormValues = {
  title: '',
  subtitle: '',
  description: '',
  image: undefined,
  experienceType: '',
  category: 'all',
  subcategory: 'all',
  tags: 'all',
  educationPhase: 'all',
  semester: 'all',
  timing: 'delay_after_previous',
  days: 0,
  completionRequired: true,
  xpCompletion: 0,
  xpViewing: 0,
  gems: 0,
  submissionType: 'student',
  autoCompletion: true,
  addLinkInText: false,
  notification: true,
  driver1: '',
  driver2: '',
  levelOfProgression: '',
  persona: '',
  milestone: false,
  weight: 3,
  difficulty: false,
  fire: 4,
  pastDue: false,
};
