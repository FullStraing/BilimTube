import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function hasLocalDatabaseInProduction() {
  if (process.env.NODE_ENV !== 'production') {
    return false;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return false;
  }

  return /@(?:localhost|127\.0\.0\.1)(?::\d+)?\//i.test(databaseUrl);
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn']
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
