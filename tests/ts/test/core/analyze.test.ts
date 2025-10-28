import { analyze } from "../../../../src/core/analyze.js";

describe("entry files", () => {
  test("specify", async () => {
    const { entryFiles } = await analyze(
      {
        includes: ["tests/ts/fixture/src"],
        excludes: [],
        testFiles: undefined,
        testNamePattern: null,
        entryFiles: ["tests/ts/fixture/src/main.ts"],
      },
      []
    );
    expect(entryFiles).toEqual(["tests/ts/fixture/src/main.ts"]);
  });
  test("specify empty", async () => {
    const { entryFiles } = await analyze(
      {
        includes: ["tests/ts/fixture/src"],
        excludes: [],
        testFiles: undefined,
        testNamePattern: null,
        entryFiles: [],
      },
      []
    );
    expect(entryFiles).toEqual([]);
  });
  test("infer", async () => {
    const { entryFiles } = await analyze(
      {
        includes: ["tests/ts/fixture/src"],
        excludes: [],
        testFiles: undefined,
        testNamePattern: null,
        entryFiles: null,
      },
      []
    );
    expect(entryFiles).toEqual(["tests/ts/fixture/src/index.ts"]);
  });
});
