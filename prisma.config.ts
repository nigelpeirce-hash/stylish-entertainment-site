import { defineConfig } from 'prisma/config';
import "dotenv/config";

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // Removed datasource - not compatible with Driver Adapters (PrismaPg)
  // Connection is handled by PrismaPg adapter in lib/prisma.ts via the pool
  // Move seed config here to remove deprecation warning
  seed: {
    script: 'tsx prisma/seed.ts',
  },
});
