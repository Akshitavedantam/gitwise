import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 * * This file ensures that only one instance of PrismaClient is created and reused 
 * across your application. In Next.js development, the server frequently restarts, 
 * which could lead to exhausting your Neon database connections if a new 
 * instance was created on every reload.
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Standard logging configuration: 
    // In development, we log queries to help with debugging.
    // In production, we only log errors to keep logs clean and performant.
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Store the instance in the global object during development to prevent 
// connection leaks during Hot Module Replacement (HMR).
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;