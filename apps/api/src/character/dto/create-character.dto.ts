import { CreateCharacterSchema } from '@repo/schema';
import { createZodDto } from 'node_modules/nestjs-zod/dist/index.mjs';

export class CreateCharacterDto extends createZodDto(CreateCharacterSchema) {}
