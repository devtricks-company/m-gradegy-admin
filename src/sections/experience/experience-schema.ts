import { z as zod } from 'zod';

import type { ExperienceType, ExperienceImage } from 'src/lib/orval/generated/model';
import { ExperienceDriverType, ExperienceTimingType } from 'src/lib/orval/generated/model';

// ----------------------------------------------------------------------

export const experienceSchema = zod
  .object({
    // Preview card fields
    title: zod.string().min(1, 'Title is required'),
    subtitle: zod.string().optional(),
    description: zod.string().optional(),
    image: zod.any().optional(),
    selectedImage: zod.custom<ExperienceImage>().optional(),

    // Experience Type
    experienceType: zod
      .object({
        title: zod.string(),
        color: zod.string(),
        icon: zod.string(),
        _id: zod.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: 'Experience type is required',
      }) as zod.ZodType<ExperienceType>,

    // Access Control and Filters
    organization: zod.string().optional(),
    project: zod.string().optional(),
    category: zod.string().optional(),
    subcategory: zod.string().optional(),
    tags: zod.string(),
    educationPhase: zod.string(),
    semester: zod.string(),

    // Timing
    timing: zod.nativeEnum(ExperienceTimingType),
    days: zod.number().min(0).optional(),
    startDate: zod.date().optional(),
    length: zod.number().min(0).optional(),
    startTime: zod.date().optional(),
    endDate: zod.date().optional(),
    endTime: zod.date().optional(),
    completionRequired: zod.boolean(),
    endWithParent: zod.boolean(),

    // Motivational Design
    xpCompletion: zod.number().min(0),
    xpViewing: zod.number().min(0),
    gems: zod.number().min(0),
    submissionType: zod.string(),
    submissionLink: zod.string().url().optional(),
    autoCompletion: zod.boolean(),
    addLinkInText: zod.boolean(),
    linkTitle: zod.string().optional(),
    linkUrl: zod.string().url().optional(),
    notification: zod.boolean(),

    // Tags section
    driver1: zod.nativeEnum(ExperienceDriverType).optional(),
    driver2: zod.nativeEnum(ExperienceDriverType).optional(),
    levelOfProgression: zod.string().optional(),
    persona: zod.string().optional(),
    milestone: zod.boolean(),
    weight: zod.number().min(0).max(3),
    difficulty: zod.boolean(),
    fire: zod.number().min(1).max(4),

    // Advanced
    pastDue: zod.boolean(),
    expPublish: zod.boolean(),
  })
  .superRefine((data, ctx) => {
    // Conditional validation based on timing type
    if (data.timing === ExperienceTimingType.delay_after_previous) {
      // When "Delay after Previous" is selected, days is required
      if (data.days === undefined || data.days === null) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Days is required when timing is "Delay after Previous"',
          path: ['days'],
        });
      }
    }

    if (data.timing === ExperienceTimingType.start_date_and_length) {
      // When "Start Date and Length" is selected, startDate and length are required
      if (!data.startDate) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Start date is required when timing is "Start Date and Length"',
          path: ['startDate'],
        });
      }
      if (data.length === undefined || data.length === null) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Length is required when timing is "Start Date and Length"',
          path: ['length'],
        });
      }
    }

    if (data.timing === ExperienceTimingType.date_range) {
      // When "Date Range" is selected, startDate, startTime, endDate, and endTime are required
      if (!data.startDate) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Start date is required when timing is "Date Range"',
          path: ['startDate'],
        });
      }
      if (!data.startTime) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Start time is required when timing is "Date Range"',
          path: ['startTime'],
        });
      }
      if (!data.endDate) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'End date is required when timing is "Date Range"',
          path: ['endDate'],
        });
      }
      if (!data.endTime) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'End time is required when timing is "Date Range"',
          path: ['endTime'],
        });
      }
    }
  });

export type ExperienceFormValues = zod.infer<typeof experienceSchema>;

export const defaultValues: ExperienceFormValues = {
  title: '',
  subtitle: '',
  description: '',
  image: undefined,
  selectedImage: undefined,
  experienceType: null as any,
  organization: undefined,
  project: undefined,
  category: undefined,
  subcategory: undefined,
  tags: 'all',
  educationPhase: 'all',
  semester: 'all',
  timing: ExperienceTimingType.delay_after_previous,
  days: undefined,
  startDate: undefined,
  length: undefined,
  startTime: undefined,
  endDate: undefined,
  endTime: undefined,
  completionRequired: true,
  endWithParent: false,
  xpCompletion: 0,
  xpViewing: 0,
  gems: 0,
  submissionType: 'student',
  submissionLink: undefined,
  autoCompletion: true,
  addLinkInText: false,
  linkTitle: '',
  linkUrl: '',
  notification: true,
  driver1: undefined,
  driver2: undefined,
  levelOfProgression: '',
  persona: '',
  milestone: false,
  weight: 3,
  difficulty: false,
  fire: 4,
  pastDue: false,
  expPublish: true,
};
