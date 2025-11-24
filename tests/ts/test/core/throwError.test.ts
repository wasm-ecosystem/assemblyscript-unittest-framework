// eslint-disable-next-line n/no-extraneous-import
import { jest } from "@jest/globals";
import { compile } from "../../../../src/core/compile.js";
import { asc } from "../../../../src/core/compiler.js";

beforeEach(() => {
  jest.spyOn(asc, "compile").mockImplementation(() => {
    throw new Error("mock asc.main() error");
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test("compile error", async () => {
  await expect(async () => {
    await compile(["non-exist.ts"], [], { outputFolder: "mockFolder", flags: "", isolated: false, warpo: false });
  }).rejects.toThrow("mock asc.main() error");
});
