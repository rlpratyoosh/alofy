import z from 'zod';

export const CreateBattleSchema = z.object({
  problemId: z.string().min(1, 'Problem ID is required'),
  player1Id: z.string().min(1, 'Player 1 ID is required'),
  player2Id: z.string().min(1, 'Player 2 ID is required'),
  status: z.enum(['PENDING', 'ONGOING', 'COMPLETED', 'ABORTED']).optional(),
});
