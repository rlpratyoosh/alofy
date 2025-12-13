import z from 'zod';

export const UpdateMemberRoleSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER'], {
    errorMap: () => ({ message: 'Role must be ADMIN or MEMBER' }),
  }),
});
