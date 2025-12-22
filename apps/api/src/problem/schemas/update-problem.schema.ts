import z from 'zod';

export const UpdateProblemSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug must not exceed 100 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens',
    )
    .optional(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .optional(),
  difficulty: z
    .enum(['EASY', 'MEDIUM', 'HARD'], {
      message: 'Difficulty must be EASY, MEDIUM, or HARD' 
    })
    .optional(),
  starterCode: z.string().optional(),
  testCases: z.any().optional(),
});
