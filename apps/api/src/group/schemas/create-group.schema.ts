import z from 'zod';

export const CreateGroupSchema = z.object({
  name: z
    .string()
    .min(3, 'Group name must be at least 3 characters')
    .max(100, 'Group name must not exceed 100 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must not exceed 50 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens',
    ),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
});
