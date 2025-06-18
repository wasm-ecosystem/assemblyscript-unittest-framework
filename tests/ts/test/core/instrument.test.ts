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
  const base = join(outputDir, "constructor");
  const wasmPath = join(outputDir, "constructor.wasm");
  const sourceCodePath = "tests/ts/fixture/constructor.ts";
  const results = await instrument([wasmPath], [sourceCodePath], true);
  expect(results.length).toEqual(1);
  const result = results[0]!;
  const instrumentedWasm = join(outputDir, "constructor.instrumented.wasm");
  const debugInfo = join(outputDir, "constructor.debugInfo.json");
  const expectInfo = join(outputDir, "constructor.expectInfo.json");
  expect(result.baseName).toEqual(base);
  expect(result.sourceWasm).toEqual(wasmPath);
  expect(result.instrumentedWasm).toEqual(instrumentedWasm);
  expect(result.debugInfo).toEqual(debugInfo);
  expect(result.expectInfo).toEqual(expectInfo);
  expect(fs.existsSync(instrumentedWasm)).toEqual(true);
  expect(fs.existsSync(debugInfo)).toEqual(true);
  expect(fs.existsSync(expectInfo)).toEqual(true);
  expect(fs.readFileSync(debugInfo, { encoding: "utf8" })).toMatchSnapshot();
});
