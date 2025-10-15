import { existsSync, mkdirSync, readFileSync, rmdirSync } from "node:fs";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, URL } from "node:url";
import { compile } from "../../../../src/core/compile.js";
import { instrument } from "../../../../src/core/instrument.js";

const fixturePath = join(fileURLToPath(new URL(".", import.meta.url)), "..", "..", "fixture", "constructor.ts");
const outputDir = relative(process.cwd(), join(tmpdir(), "assemblyscript-unittest-framework"));

function cleanDirSync(path: string) {
  if (existsSync(path)) rmdirSync(path, { recursive: true });
  mkdirSync(path);
}

test("Instrument", async () => {
  cleanDirSync(outputDir);
  await compile([fixturePath], { outputFolder: outputDir, flags: "--memoryBase 16 --exportTable", isolated: true });
  const base = join(outputDir, "constructor").replaceAll(/\\/g, "/");
  const wasmPath = base.concat(".wasm");
  const sourceCodePath = "tests/ts/fixture/constructor.ts";
  const results = await instrument([wasmPath], [sourceCodePath], true);
  expect(results.length).toEqual(1);
  const result = results[0]!;
  const instrumentedWasm = base.concat(".instrumented.wasm");
  const debugInfo = base.concat(".debugInfo.json");
  const expectInfo = base.concat(".expectInfo.json");
  expect(result.baseName).toEqual(base);
  expect(result.sourceWasm).toEqual(wasmPath);
  expect(result.instrumentedWasm).toEqual(instrumentedWasm);
  expect(result.debugInfo).toEqual(debugInfo);
  expect(result.expectInfo).toEqual(expectInfo);
  expect(existsSync(instrumentedWasm)).toEqual(true);
  expect(existsSync(debugInfo)).toEqual(true);
  expect(existsSync(expectInfo)).toEqual(true);
  const debugInfoContent = readFileSync(debugInfo, { encoding: "utf8" });
  expect(debugInfoContent).toMatchSnapshot();
});
