/**
 * Test stub for the real PrismaService.
 *
 * The real `src/prisma.service.ts` extends the ESM-generated Prisma client
 * (`generated/prisma/client.ts`, which uses `import.meta.url`) and constructs a
 * `@prisma/adapter-pg` driver adapter from `DATABASE_URL`. Neither is loadable
 * under Jest's CommonJS transform, and neither should be exercised by unit
 * tests. Services under test only use `PrismaService` as an injection token
 * (and via `design:paramtypes` metadata), so this bare class is sufficient.
 *
 * Mapped in via `moduleNameMapper` in `jest.config.cjs` (key `prisma.service.js`).
 */
export class PrismaService {}

export class PrismaModule {}
