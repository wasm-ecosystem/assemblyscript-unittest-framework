import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { precompile } from "../../../../src/core/precompile.js";

test("listFunction transform", async () => {
  const transformFunction = join(
    fileURLToPath(new URL(".", import.meta.url)),
    "..",
    "..",
    "..",
    "transform",
    "listFunctions.mjs"
  );
  const unittestPackages = await precompile(["tests/ts/fixture/transformFunction.ts"], [], [], transformFunction);
  expect(unittestPackages.testCodePaths).toEqual([]);
  expect(unittestPackages.sourceFunctions).toMatchSnapshot();
});
