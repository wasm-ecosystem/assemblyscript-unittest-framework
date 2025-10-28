import { analyze } from "../../../../src/core/analyze.js";

test("listFunction transform", async () => {
  const unittestPackages = await analyze(["tests/ts/fixture/transformFunction.ts"], [], undefined, null, []);
  expect(unittestPackages.testCodePaths).toEqual([]);
  expect(unittestPackages.sourceCodePaths).toMatchSnapshot();
});
