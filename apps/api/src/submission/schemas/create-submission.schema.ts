import z from 'zod';

export const CreateSubmissionSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  language: z.string().default('cpp').optional(),
  battleId: z.string().min(1, 'Battle ID is required'),
  playerId: z.string().min(1, 'Player ID is required'),
  problemId: z.string().min(1, 'Problem ID is required'),
});
