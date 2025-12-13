import z from 'zod';

export const UpdateBattleSchema = z.object({
  problemId: z.string().optional(),
  player1Id: z.string().optional(),
  player2Id: z.string().optional(),
  status: z.enum(['PENDING', 'ONGOING', 'COMPLETED', 'ABORTED']).optional(),
  winnerId: z.string().optional(),
  player1TimeMs: z.number().int().min(0).optional(),
  player2TimeMs: z.number().int().min(0).optional(),
  snapshotUrl: z.string().url('Invalid snapshot URL').optional(),
  finishedAt: z.coerce.date().optional(),
});
