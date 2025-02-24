import { parseImportFunctionInfo } from "../../../../src/utils/wasmparser.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { Type } from "wasmparser";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

test("parseImportFunctionInfo", () => {
  const fp = join(__dirname, "..", "..", "fixture", "defaultImportTest.wasm");
  const buf = readFileSync(fp);
  const expectedInfo = [
    {
      module: "env",
      name: "abort",
      args: [new Type(-1), new Type(-1), new Type(-1), new Type(-1)],
      return: undefined,
    },
    {
      module: "env",
      name: "logInfo",
      args: [new Type(-1), new Type(-1)],
      return: undefined,
    },
    {
      module: "env",
      name: "getTimeSinceEpoch",
      args: [],
      return: new Type(-2),
    },
    {
      module: "ns",
      name: "ut.i32",
      args: [],
      return: new Type(-1),
    },
    {
      module: "ns",
      name: "ut.f32",
      args: [new Type(-2)],
      return: new Type(-3),
    },
    {
      module: "ns",
      name: "ut.f64",
      args: [],
      return: new Type(-4),
    },
  ];

  expect(parseImportFunctionInfo(buf)).toEqual(expectedInfo);
});
