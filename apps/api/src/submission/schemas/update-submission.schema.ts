import z from 'zod';

export const UpdateSubmissionSchema = z.object({
  code: z.string().optional(),
  language: z.string().optional(),
  status: z.string().optional(),
  passedTests: z.number().int().min(0).optional(),
  totalTests: z.number().int().min(0).optional(),
  executionTime: z.number().int().min(0).optional(),
  memoryUsed: z.number().int().min(0).optional(),
  aiFeedback: z.string().optional(),
});
