import { analyze } from "../../../../src/core/analyze.js";

describe("entry files", () => {
  test("specify", () => {
    const { entryFiles } = analyze(
      {
        includes: ["tests/ts/fixture/src"],
        excludes: [],
        testFiles: null,
        testNamePattern: null,
        entryFiles: ["tests/ts/fixture/src/main.ts"],
      },
      []
    );
    expect(entryFiles).toEqual(["tests/ts/fixture/src/main.ts"]);
  });
  test("specify empty", () => {
    const { entryFiles } = analyze(
      {
        includes: ["tests/ts/fixture/src"],
        excludes: [],
        testFiles: null,
        testNamePattern: null,
        entryFiles: [],
      },
      []
    );
    expect(entryFiles).toEqual([]);
  });
  test("infer", () => {
    const { entryFiles } = analyze(
      {
        includes: ["tests/ts/fixture/src"],
        excludes: [],
        testFiles: null,
        testNamePattern: null,
        entryFiles: null,
      },
      []
    );
    expect(entryFiles).toEqual(["tests/ts/fixture/src/index.ts"]);
  });
});
