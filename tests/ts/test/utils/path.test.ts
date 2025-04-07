import path from "node:path";
import { findRoot, getIncludeFiles, splitCommand } from "../../../../src/utils/pathResolver.js";

describe("splitCommand", () => {
  test("normal", () => {
    const res = splitCommand(`node a b c`);
    expect(res.cmd).toEqual("node");
    expect(res.argv).toEqual(["a", "b", "c"]);
  });
  test("pathspace", () => {
    const res = splitCommand(`"a b"/test a b`);
    expect(res.cmd).toEqual(`"a b"/test`);
    expect(res.argv).toEqual(["a", "b"]);
  });
  test("slash", () => {
    const res = splitCommand(`a\\ b/test a b`);
    expect(res.cmd).toEqual("a b/test");
    expect(res.argv).toEqual(["a", "b"]);
  });
});

test("findRoot", () => {
  expect(findRoot(["tests/as/comparison.test.ts"])).toEqual("tests/as");
  expect(findRoot(["tests/A/a.test.ts", "tests/B/b.test.ts"])).toEqual("tests");
  expect(() => findRoot([])).toThrow("include length is zeros");
  expect(findRoot(["a.test.ts", "b.test.ts"])).toEqual(".");
  expect(() => findRoot(["../a.test.ts", "b.test.ts"])).toThrow("file path out of project range");
});

test("getIncludeFiles", () => {
  expect(getIncludeFiles(["src/core"], (s) => s.endsWith(".ts"))).toEqual([
    path.normalize("src/core/compile.ts"),
    path.normalize("src/core/execute.ts"),
    path.normalize("src/core/instrument.ts"),
    path.normalize("src/core/precompile.ts"),
  ]);
  expect(getIncludeFiles(["tests/ts/fixture/transformFunction.ts"], (s) => s.endsWith(".ts"))).toEqual([
    path.normalize("tests/ts/fixture/transformFunction.ts"),
  ]);
});
