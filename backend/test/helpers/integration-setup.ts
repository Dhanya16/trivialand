import { PrismaClient } from '@prisma/client';

const databaseUrl =
  process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? '';

if (!databaseUrl) {
  throw new Error(
    'TEST_DATABASE_URL or DATABASE_URL must be set for integration tests',
  );
}

export const integrationPrisma = new PrismaClient({
  datasources: {
    db: { url: databaseUrl },
  },
});

beforeAll(async () => {
  await integrationPrisma.$connect();
});

afterAll(async () => {
  await integrationPrisma.$disconnect();
});
