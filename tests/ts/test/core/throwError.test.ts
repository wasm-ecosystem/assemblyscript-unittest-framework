// eslint-disable-next-line n/no-extraneous-import
import { jest } from "@jest/globals";

jest.unstable_mockModule("assemblyscript/asc", () => ({
  main: jest.fn(() => {
    return {
      error: new Error("mock asc.main() error"),
      stderr: "mock asc.main() error",
    };
  }),
}));

const { main } = await import("assemblyscript/asc");
const { precompile } = await import("../../../../src/core/precompile.js");
const { compile } = await import("../../../../src/core/compile.js");

test("transform error", async () => {
  expect(jest.isMockFunction(main)).toBeTruthy();
  await expect(async () => {
    await precompile(["tests/ts/fixture/transformFunction.ts"], [], undefined, undefined, [], true, "");
  }).rejects.toThrow("mock asc.main() error");
});

test("compile error", async () => {
  await expect(async () => {
    await compile(["non-exist.ts"], "mockFolder", "");
  }).rejects.toThrow("mock asc.main() error");
});
