import z from 'zod';

export const UpdateResultSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  passedTests: z.number().int().min(0, 'Passed tests must be non-negative'),
  totalTests: z.number().int().min(0, 'Total tests must be non-negative'),
  executionTime: z.number().int().min(0, 'Execution time must be non-negative'),
  memoryUsed: z.number().int().min(0, 'Memory used must be non-negative'),
  aiFeedback: z.string().optional(),
});
