import "dotenv/config";

// Prisma 7 configuration
// Connection strings are read from environment variables:
// - DATABASE_URL: Used for Prisma Client (connection pooling, port 6543)
// - DIRECT_URL: Used for migrations and Prisma Studio (direct connection, port 5432)
export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
};
