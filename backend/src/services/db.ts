import { PrismaClient } from '@prisma/client';

let prismaClient: any = null;

try {
  prismaClient = new PrismaClient({
    log: ['error']
  });
} catch (err) {
  console.warn('Prisma initialization fallback active in serverless environment:', err);
}

// Proxy wrapper preventing module load crashes in serverless functions
export const prisma: any = new Proxy(prismaClient || {}, {
  get(target, prop) {
    if (target && typeof target[prop] !== 'undefined') {
      const val = target[prop];
      if (typeof val === 'function') {
        return val.bind(target);
      }
      return val;
    }
    // Return dummy async method for missing database methods in serverless mode
    return () => Promise.reject(new Error('Database unavailable in serverless environment'));
  }
});
