/**
 * Jest configuration for @olicmat/admin-api.
 *
 * The backend is ESM ("type": "module") with NestJS, but Jest 30 + ts-jest 29
 * cannot run the ESM-generated Prisma client (it uses `import.meta.url`) or the
 * `@prisma/adapter-pg` driver under true ESM. We therefore compile the tests to
 * CommonJS and stub the two things that are genuinely un-loadable:
 *
 *   1. `prisma.service.js` is mapped to a bare stub (see src/test/__mocks__),
 *      so neither the generated client nor the adapter is ever imported.
 *   2. The ts-jest transform overrides `module`/`moduleResolution` to CommonJS.
 */
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        tsconfig: {
          module: "commonjs",
          moduleResolution: "node",
          resolvePackageJsonExports: false,
          verbatimModuleSyntax: false,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          target: "ES2022",
        },
      },
    ],
  },
  testEnvironment: "node",
  // Specific stub must precede the generic `.js` -> no-extension rewrite so that
  // `import { PrismaService } from "../../prisma.service.js"` resolves to the stub.
  moduleNameMapper: {
    "prisma\\.service\\.js$": "<rootDir>/test/__mocks__/prisma.service.ts",
    // `@olicmat/shared` ships ESM (`dist/index.js`); map it to the TS source
    // so ts-jest compiles it to CommonJS (the runtime barrel only re-exports
    // constants/enums/guards that all resolve fine here).
    "^@olicmat/shared$": "<rootDir>/../../../../packages/shared/src/index.ts",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
