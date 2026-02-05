import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  api: process.env.AI_API || 'api',
}));
