// eslint-disable-next-line n/no-extraneous-import
import { jest } from "@jest/globals";
import { analyze } from "../../../../src/core/analyze.js";
import { compile } from "../../../../src/core/compile.js";
import { compiler } from "../../../../src/utils/ascWrapper.js";

beforeEach(() => {
  jest.spyOn(compiler, "compile").mockImplementation(() => {
    throw new Error("mock asc.main() error");
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test("compile error", async () => {
  await expect(async () => {
    await compile(["non-exist.ts"], { outputFolder: "mockFolder", flags: "", isolated: false });
  }).rejects.toThrow("mock asc.main() error");
});
