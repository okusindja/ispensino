import { z } from 'zod';

export const QuestionTypeSchema = z.enum([
  'SINGLE_CHOICE',
  'MULTIPLE_CHOICE',
  'TRUE_FALSE',
  'SHORT_ANSWER',
  'ESSAY',
]);

export const QuestionOptionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean().default(false),
});

export const QuestionSchema = z
  .object({
    id: z.string().optional(),
    text: z.string().min(3, 'Question must be at least 3 characters'),
    type: QuestionTypeSchema,
    explanation: z.string().optional(),
    options: z
      .array(QuestionOptionSchema)
      .refine((options) => options.length >= 2, {
        message: 'At least two options are required',
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validate based on question type
    if (
      data.type === 'SINGLE_CHOICE' ||
      data.type === 'MULTIPLE_CHOICE' ||
      data.type === 'TRUE_FALSE'
    ) {
      if (!data.options || data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least two options are required',
          path: ['options'],
        });
      }

      const correctCount =
        data.options?.filter((opt) => opt.isCorrect).length || 0;

      if (data.type === 'SINGLE_CHOICE' && correctCount !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Exactly one correct option is required for single choice',
          path: ['options'],
        });
      }

      if (data.type === 'MULTIPLE_CHOICE' && correctCount < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'At least one correct option is required for multiple choice',
          path: ['options'],
        });
      }

      if (data.type === 'TRUE_FALSE' && correctCount !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Exactly one correct option is required for true/false',
          path: ['options'],
        });
      }
    }
  });

export const AssessmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  lessonId: z.string(),
  passScore: z
    .number()
    .min(0, 'Pass score must be at least 0')
    .max(100, 'Pass score cannot exceed 100')
    .default(75),
  questions: z
    .array(QuestionSchema)
    .min(1, 'At least one question is required'),
});

export type AssessmentType = z.infer<typeof AssessmentSchema>;
