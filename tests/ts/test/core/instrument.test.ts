import fs from "fs-extra";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, URL } from "node:url";
import { compile } from "../../../../src/core/compile.js";
import { instrument } from "../../../../src/core/instrument.js";

const fixturePath = join(fileURLToPath(new URL(".", import.meta.url)), "..", "..", "fixture", "constructor.ts");
const outputDir = join(tmpdir(), "assemblyscript-unittest-framework");

test("Instrument", async () => {
  await compile([fixturePath], outputDir, "--memoryBase 16 --exportTable");
  const wasmPath = join(outputDir, "constructor.wasm");
  const sourceCodePath = "tests/ts/fixture/constructor.ts";
  const result = await instrument([wasmPath], [sourceCodePath]);
  expect(result.length).toEqual(1);
  const instrumentedWasm = join(outputDir, "constructor.instrumented.wasm");
  const debugInfo = join(outputDir, "constructor.debugInfo.json");
  const expectInfo = join(outputDir, "constructor.expectInfo.json");
  expect(result[0]).toEqual({
    sourceWasm: wasmPath,
    instrumentedWasm,
    debugInfo,
    expectInfo,
  });
  expect(fs.existsSync(instrumentedWasm)).toEqual(true);
  expect(fs.existsSync(debugInfo)).toEqual(true);
  expect(fs.existsSync(expectInfo)).toEqual(true);
  expect(fs.readFileSync(debugInfo, { encoding: "utf8" })).toMatchSnapshot();
});
