import { Injectable, Module, Global } from "@nestjs/common";

/**
 * Test stub for the real PrismaService.
 *
 * The real `src/prisma.service.ts` extends the ESM-generated Prisma client
 * (`generated/prisma/index.ts`, which uses `import.meta.url`) and constructs a
 * `@prisma/adapter-pg` driver adapter from `DATABASE_URL`. Neither is loadable
 * under Jest's CommonJS transform, and neither should be exercised by unit
 * tests. Services under test only use `PrismaService` as an injection token,
 * so this bare class is sufficient.
 *
 * Decorated with `@Injectable()`/`@Module()` so Nest can resolve it during
 * e2e tests (AppModule imports the global PrismaModule and ProvaModule/AuthModule
 * inject PrismaService). Mapped in via `moduleNameMapper` in `jest.config.cjs`
 * and `test/jest-e2e.json` (key `prisma.service.js`).
 */
@Injectable()
export class PrismaService {}

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
