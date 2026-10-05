import { prisma } from "../lib/prisma.js";

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB Connected via Prisma");
  } catch (error) {
    if (error instanceof Error) {
        console.log(error.message); // TypeScript knows 'error' is an Error here
    } else {
        console.log('An unknown error occurred:', error);
    }
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { connectDB, disconnectDB }; 