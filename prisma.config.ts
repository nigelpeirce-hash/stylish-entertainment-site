import { defineConfig, env } from 'prisma/config';
import "dotenv/config"; // 👈 This is the missing link that loads your .env file

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
