import { PrismaClient } from '@prisma/client';

const FALLBACK_DATABASE_URL =
  process.env.DATABASE_URL ||
  'mongodb+srv://zunnorainrajpoot7_db_user:Rajpoot786@cluster0.dk2albp.mongodb.net/ai_database?appName=Cluster0';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = FALLBACK_DATABASE_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: FALLBACK_DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

