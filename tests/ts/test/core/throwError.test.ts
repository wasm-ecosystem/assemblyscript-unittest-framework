// eslint-disable-next-line n/no-extraneous-import
import { jest } from "@jest/globals";
import { precompile } from "../../../../src/core/precompile.js";
import { compile } from "../../../../src/core/compile.js";
import { compiler } from "../../../../src/utils/ascWrapper.js";

beforeEach(() => {
  jest.spyOn(compiler, "compile").mockImplementation(async () => {
    throw new Error("mock asc.main() error");
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test("transform error", async () => {
  await expect(async () => {
    await precompile(["tests/ts/fixture/transformFunction.ts"], [], undefined, undefined, [], true, "");
  }).rejects.toThrow("mock asc.main() error");
});

test("compile error", async () => {
  await expect(async () => {
    await compile(["non-exist.ts"], "mockFolder", "");
  }).rejects.toThrow("mock asc.main() error");
});
