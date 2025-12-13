import z from 'zod';

export const CompleteBattleSchema = z.object({
  winnerId: z.string().min(1, 'Winner ID is required'),
  player1TimeMs: z.number().int().min(0, 'Player 1 time must be non-negative'),
  player2TimeMs: z.number().int().min(0, 'Player 2 time must be non-negative'),
});
