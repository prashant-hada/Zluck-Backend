const { PrismaClient } = require("@prisma/client");
const globalForPrisma = globalThis; // Prevent multiple instances in development

const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;