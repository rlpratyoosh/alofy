import z from 'zod';

export const UpdateMemberRoleSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER'], {
    message: 'Role must be ADMIN or MEMBER',
  }),
});
