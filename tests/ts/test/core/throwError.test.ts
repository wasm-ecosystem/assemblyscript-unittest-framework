import { join } from "node:path";
// eslint-disable-next-line node/no-extraneous-import
import { jest } from "@jest/globals";
import { fileURLToPath, URL } from "node:url";

jest.unstable_mockModule("assemblyscript/asc", () => ({
  main: jest.fn(() => {
    return {
      error: new Error("mock asc.main() error"),
      stderr: "mock asc.main() error",
    };
  }),
}));

// eslint-disable-next-line node/no-unsupported-features/es-syntax
const { main } = await import("assemblyscript/asc");
// eslint-disable-next-line node/no-unsupported-features/es-syntax
const { precompile } = await import("../../../../src/core/precompile.js");
// eslint-disable-next-line node/no-unsupported-features/es-syntax
const { compile } = await import("../../../../src/core/compile.js");

test("transform error", async () => {
  const transformFunction = join(
    fileURLToPath(new URL(".", import.meta.url)),
    "..",
    "..",
    "..",
    "transform",
    "listFunctions.mjs"
  );
  expect(jest.isMockFunction(main)).toBeTruthy();
  await expect(async () => {
    await precompile(["tests/ts/fixture/transformFunction.ts"], [], [], transformFunction);
  }).rejects.toThrow("mock asc.main() error");
});

test("compile error", async () => {
  await expect(async () => {
    await compile(["non-exist.ts"], "mockFolder", "");
  }).rejects.toThrow("mock asc.main() error");
});
