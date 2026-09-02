/**
 * Jest configuration for @olicmat/exam-api.
 *
 * Same constraints as @olicmat/admin-api (see that app's jest.config.cjs for the
 * rationale): the backend is ESM ("type": "module"), but Jest 30 + ts-jest 29
 * cannot load the ESM-generated Prisma client (it uses `import.meta.url`) or the
 * `@prisma/adapter-pg` driver under true ESM. We compile tests to CommonJS and
 * stub the only genuinely un-loadable module:
 *
 *   1. `prisma.service.js` is mapped to a bare stub (see src/test/__mocks__),
 *      so neither the generated client nor the adapter is ever imported.
 *   2. The ts-jest transform overrides `module`/`moduleResolution` to CommonJS.
 *   3. `@olicmat/shared` ships ESM (`dist/index.js`); map it to TS source.
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
  moduleNameMapper: {
    "prisma\\.service\\.js$": "<rootDir>/test/__mocks__/prisma.service.ts",
    "^@olicmat/shared$": "<rootDir>/../../../../packages/shared/src/index.ts",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
