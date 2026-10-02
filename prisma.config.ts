import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';
config({ path: '.env.local', quiet: true });
if (!process.env.DATABASE_URL) process.env.DATABASE_URL = 'file:./leads.db';
export default defineConfig({ schema: 'prisma/schema.prisma' });
