import z from 'zod';

export const UpdateProfileSchema = z.object({
  fullName: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  linkedInLink: z.string().optional(),
  githubLink: z.string().optional(),
  leetcodeLink: z.string().optional(),
});
