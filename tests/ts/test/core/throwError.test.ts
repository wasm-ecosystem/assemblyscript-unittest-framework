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

const { precompile } = await import("../../../../src/core/precompile.js");
const { compile } = await import("../../../../src/core/compile.js");

let exitSpy: any | null = null;

beforeEach(() => {
  exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
    throw new Error("process.exit");
  });
});

afterEach(() => {
  exitSpy!.mockRestore();
});

test("transform error", async () => {
  await expect(async () => {
    await precompile(["tests/ts/fixture/transformFunction.ts"], [], ["non-exist.ts"], undefined, [], true, "");
  }).rejects.toThrow("process.exit");
  expect(exitSpy).toHaveBeenCalled();
});

test("compile error", async () => {
  await expect(async () => {
    await compile(["non-exist.ts"], "mockFolder", "");
  }).rejects.toThrow("process.exit");
  expect(exitSpy).toHaveBeenCalled();
});
