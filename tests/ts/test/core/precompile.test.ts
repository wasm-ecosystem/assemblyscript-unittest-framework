import { precompile } from "../../../../src/core/precompile.js";

test("listFunction transform", async () => {
  const unittestPackages = await precompile(
    ["tests/ts/fixture/transformFunction.ts"],
    [],
    undefined,
    undefined,
    false,
    ""
  );
  expect(unittestPackages.testCodePaths).toEqual([]);
  expect(unittestPackages.sourceFunctions).toMatchSnapshot();
});
