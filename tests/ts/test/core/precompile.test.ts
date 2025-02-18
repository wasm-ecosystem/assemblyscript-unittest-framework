import { join } from "node:path";
import { precompile } from "../../../../src/core/precompile.js";
import { projectRoot } from "../../../../src/utils/projectRoot.js";

test("listFunction transform", async () => {
  const transformFunction = join(projectRoot, "transform", "listFunctions.mjs");
  const unittestPackages = await precompile(["tests/ts/fixture/transformFunction.ts"], [], [], transformFunction);
  expect(unittestPackages.testCodePaths).toEqual([]);
  expect(unittestPackages.sourceFunctions).toMatchSnapshot();
});
