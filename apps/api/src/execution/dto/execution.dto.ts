import { SubmitCodeSchema, SubmitDemoCodeSchema } from '@repo/schema';
import { createZodDto } from 'node_modules/nestjs-zod/dist/index.mjs';

export class SubmitCodeDto extends createZodDto(SubmitCodeSchema) {}
export class SubmitDemoCodeDto extends createZodDto(SubmitDemoCodeSchema) {}
