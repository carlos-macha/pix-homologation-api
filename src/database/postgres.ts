import prisma from '../prisma/client';

export async function connectPostgres() {
  try {
    await prisma.$connect();
    console.log('PostgreSQL connected successfully');
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
    process.exit(1);
  }
}
