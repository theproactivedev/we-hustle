import { PrismaClient } from '@prisma/client';
// import type { PrismaClient as PrismaClientType } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

const prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

const connectDB = async () => {
    try {
        await prisma.$connect();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process with an error code
    }
};

const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
    } catch (error) {
        console.error('Error disconnecting from the database:', error);
    }
}

export {
    prisma,
    connectDB,
    disconnectDB,
}